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
    this.client = new CosmWasmClient(this.secretRestUrl);

    this.wallet = wallet;
  }

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
    try {
      return await this.client.restClient.blocks(number);
    } catch(err) {
      // In case errors need to be processed this would happen here
      throw err;
    }
  }


  async sendTokens(deposit) {

  }

  async queryAccount(address) {
    return await this.client.getAccount(address);
  }

  async queryContract(address, query) {
    return await this.client.queryContractSmart(address, query);
  }

  // TODO review this

  async decryptTxHash(txHash) {
    const query = {id: txHash}
    return await this.client.searchTx(query);
    //secretcli q tx ${txHash}
  }

  async decryptTxResponse(response) {
    console.log(response);
    return await this.client.restClient.decryptTxsResponse(response);
  }

  async executeContract(address, handleMsg, fees) {
    console.log(handleMsg);
    const chainId = await this.getChainId();
      try {
        await window.keplr.enable(chainId);

        this.signingClient = new SigningCosmWasmClient(
          this.secretRestUrl,
          this.wallet.getSelectedAddress(),
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

  async queryAccountFromMnemonic(mnemonic) {
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress = pubkeyToAddress(pubkey, "secret");

    return await this.client.getAccount(accAddress);
  }

  getRandomMnemonic() {
    return Bip39.encode(Random.getBytes(16)).toString();
  }
}
