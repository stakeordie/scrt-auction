import {
  SigningCosmWasmClient,
  CosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
  makeSignBytes,
} from "secretjs";

import { Bip39, Random } from "@iov/crypto";

// Default fees to be used when no fees are specified for the transaction
const defaultFees = {
  init: {
    amount: [{ amount: '300000', denom: 'uscrt' }],
    gas: '300000',
  },
  exec: {
      amount: [{ amount: '200000', denom: 'uscrt' }],
      gas: '1000000',
  },
};

export class SecretJsClient {
  secretRestUrl;
  client;
  signingClient;

  wallet;

  constructor(secretRestUrl, wallet) {
    this.secretRestUrl = secretRestUrl;
    this.wallet = wallet;
    this.client = new CosmWasmClient(this.secretRestUrl);
  }

  async getAccount(address) {
    // If address is undefined it retrieves the balance of
    // the selected account in the wallet
    if(address === undefined) {
      address = this.wallet.address;
    } 

    return await this.client.getAccount(address);
  }

  async queryContract(address, query) {
    return await this.client.queryContractSmart(address, query);
  }

  async decryptTxHash(txHash) {
    const query = {id: txHash};
    return await this.client.searchTx(query);
    //secretcli q tx ${txHash}
  }

  async decryptTxResponse(response) {
    return await this.client.restClient.decryptTxsResponse(response);
  }

  async sendTokens(payment) {
    if(payment.type == "SCRT") {
      const chainId = await this.getChainId();
      const fees = defaultFees
      try {
        await window.keplr.enable(chainId);
  
        this.signingClient = new SigningCosmWasmClient(
          this.secretRestUrl,
          this.wallet.address,
          this.wallet.getSigner(),
          this.wallet.getSeed(),
          fees
        );

        const response = await this.signingClient.sendTokens(payment.recipient, [{amount: payment.amount, denom: "uscrt"}], payment.memo);
        const query = {id: response.transactionHash}
        const tx = await this.client.searchTx(query)
      } catch(error) {
        console.log(error);
      }
    } else {
      const msg = {
          "send": {
              "recipient": payment.recipient, 
              "amount": payment.amount
          }
      };
      const response = await this.executeContract(payment.tokenAddress, msg);
      return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }
  }

  async mintTokens(mint) {
    //secretcli tx compute execute secret16v7a5lhuglkp5szdkfdxwhgkg3g2t2hmmy92h4 '{"mint": { "recipient": "secret1u64kcphxpt9lmeppz9xgk9tkjpxcrt60hylgzm", "amount": "500", "address": "secret10uc40qc5rjkh6zhu8dyqheetejyevukzkkecvs"}}' --from testwalleta
    const msg = {
        "mint": {
            "recipient": mint.recipient,
            "address": mint.recipient,
            "amount": mint.amount
        }
    };
    return await this.executeContract(mint.tokenAddress, msg);
  }

  async executeContract(address, handleMsg, fees = defaultFees) {
    const chainId = await this.getChainId();
    console.log("this.secretRestUrl",this.secretRestUrl);
    console.log("this.wallet.address",this.wallet.address);
    console.log("this.wallet.getSigner()",this.wallet.getSigner());
    console.log("this.wallet.getSeed()",this.wallet.getSeed());
    console.log("fees",fees);
    try {
      await window.keplr.enable(chainId);

      this.signingClient = new SigningCosmWasmClient(
        this.secretRestUrl,
        this.wallet.address,
        this.wallet.getSigner(),
        this.wallet.getSeed(),
        fees
      );

      return this.handleResponse(await this.signingClient.execute(address, handleMsg));
    } catch (err) {
      console.log("ERROR")
      return this.handleResponse(err);
      //throw err;
    }
  }

  async getContract(address) {
    const contract = await this.client.getContract(address);
    //console.log(secretjs-client/getContract(contract)); console.log(x);
    return contract;
  }

  async getContractHash(address) {
    return await this.client.restClient.getCodeHashByContractAddr(address);
  }

  async listContracts(codeId) {
    return await this.client.getContracts(codeId);
  }

  // General chain section

  async getChainId() {
    return await this.client.getChainId();
  }

  async getHeight() {
    return await this.client.getHeight();
  }

  async getNodeInfo() {
    return await this.client.restClient.nodeInfo();
  }

  async getLatestBlocks() {
    return await this.client.restClient.blocksLatest();
  }

  async getBlock(number) {
    return await this.client.restClient.blocks(number);
  }



  // Utilities section

  getRandomMnemonic() {
    return Bip39.encode(Random.getBytes(16)).toString();
  }

  decodedResponse(response) {
    try {
      return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    } catch(e) {
      console.log(e);
      return "Decode Error"
    }
  }

  handleResponse(response) {
    let result;
    try {
      console.log("secretjs-client/handleResponseA", JSON.parse(response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf("response") > -1).value.replace(/\\/g, "")));
      result = JSON.parse(response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf("response") > -1).value.replace(/\\/g, ""));
    } catch(e) {
        try{
            console.log("secretjs-client/handleResponseB", JSON.parse(new TextDecoder("utf-8").decode(response.data)));
            result = JSON.parse(new TextDecoder("utf-8").decode(response.data));
        } catch (e) {
          let errorMessage = "";
          switch(true) {
            case /unknown variant/.test(response.message):
              errorMessage = "Bad tx send to chain";
              break;
            case /Auction has ended. Bid tokens have been returned/.test(response.message):
              errorMessage = "Auction has ended. Bid tokens have been returned";
              break;
            case /insufficient funds to pay for fees;/.test(response.message):
              console.log(response);
              errorMessage = "Not enough SCRT to pay for fees.";
              break;
            case /insufficient funds:/.test(response.message):
              errorMessage = "Insufficient Funds.";
              break;
            case /contract account already exists:/.test(response.message):
              errorMessage = "Auction has already been created";
              break;
            case /Could not establish connection. Receiving end does not exist./.test(response.message):
            case /Request failed with status code 502/.test(response.message):
              errorMessage = "Connection Error. Please refresh the page and try again."
            default:
              console.log(response);
              errorMessage = response.message;
          }
          console.log("secretjs-client/handleResponseC", {"error": errorMessage});
          return {"error": errorMessage};
        }
    }
    //check if error
    return result;
  }

  
}
