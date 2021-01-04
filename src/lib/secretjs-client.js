import {
  SigningCosmWasmClient,
  CosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
  makeSignBytes,
} from "secretjs";

import { Bip39, Random } from "@iov/crypto";


export class SecretJsClient {
  secretRestUrl;
  client;
  signingClient;

  constructor(secretRestUrl) {
    this.secretRestUrl = secretRestUrl;
    this.client = new CosmWasmClient(this.secretRestUrl);
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
  async executeContract(address, handleMsg) {
      const chainId = await this.getChainId();
      const keplr = window.keplr;
      const offlineSigner = window.getOfflineSigner(chainId);
      const enigmaUtils = window.getEnigmaUtils(chainId);
      await keplr.experimentalSuggestChain({
        // Chain-id of the Cosmos SDK chain.
        chainId,
        gasPriceStep: {
          low: 0.1,
          average: 0.25,
          high: 0.4,
        }
      });
      console.log(window.keplr)
      await keplr.enable(chainId);
      const accounts = await offlineSigner.getAccounts();
      console.log(window.keplr)
      this.signingClient = new SigningCosmWasmClient(
        this.secretRestUrl,
        accounts[0].address,
        offlineSigner,
        enigmaUtils,
        {
            exec: {
                amount: [{amount: '94',denom: 'uscrt'}],
                gas: '377000'
            }
        }
     );
    return await this.signingClient.execute(address, handleMsg);
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
