import {
    SigningCosmWasmClient,
    CosmWasmClient,
    Secp256k1Pen,
    pubkeyToAddress,
    encodeSecp256k1Pubkey,
    makeSignBytes,
  } from "secretjs";
  

export class SecretJsClient {
    secretRestUrl;
    client;

    constructor(secretRestUrl) {
        this.secretRestUrl = secretRestUrl;
        this.client = new CosmWasmClient(this.secretRestUrl);
    }

    async getChainId() {
        return  await this.client.getChainId();
    }

    async getHeight() {
        return await this.client.getHeight();
    }
}