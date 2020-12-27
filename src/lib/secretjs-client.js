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

  async getBlocks(number) {
    return await this.client.restClient.blocks(number);
  }

  async queryAccount(address) {
    return await this.client.getAccount(address);
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
