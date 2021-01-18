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

  async executeContract(address, handleMsg, fees = defaultFees) {
    const chainId = await this.getChainId();
    try {
      await window.keplr.enable(chainId);

      this.signingClient = new SigningCosmWasmClient(
        this.secretRestUrl,
        this.wallet.address,
        this.wallet.getSigner(),
        this.wallet.getSeed(),
        fees
      );
      return await this.signingClient.execute(address, handleMsg);
    } catch (err) {
      throw err;
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
}
