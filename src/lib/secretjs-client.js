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

    console.log(this.wallet);
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
    console.log(response);
    return await this.client.restClient.decryptTxsResponse(response);
  }


  async sendTokens(payment) {
    console.log(payment);
  }


  async executeContract(address, handleMsg, fees) {
    console.log(handleMsg);
    const chainId = await this.getChainId();
    try {
      await window.keplr.enable(chainId);

      this.signingClient = new SigningCosmWasmClient(
        this.secretRestUrl,
        this.wallet.address,
        this.wallet.getSigner(),
        this.wallet.getSeed(),
        fees || defaultFees
      );
      return await this.signingClient.execute(address, handleMsg);
    } catch (error) {
      console.error(error)
    }
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
}
