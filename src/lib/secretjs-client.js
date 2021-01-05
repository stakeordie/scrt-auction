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

  async decryptTxHash(txHash) {
    const query = {id: txHash}
    return await this.client.searchTx(query);
    //secretcli q tx ${txHash}
  }

  async decryptTxResponse(response) {
    console.log(response);
    return await this.client.restClient.decryptTxsResponse(response);
  }

  async executeContract(address, handleMsg) {
    console.log(handleMsg);
    const chainId = await this.getChainId();
    if (window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain({
          chainId: chainId,
          chainName: 'Scrt Testnet',
          rpc: this.secretRestUrl + ':26657',
          rest: this.secretRestUrl,
          bip44: {
              coinType: 529,
          },
          coinType: 529,
          stakeCurrency: {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub',
          },
          currencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          gasPriceStep: {
            low: "0.1",
            average: "0.25",
            high: "0.4",
          },
          features: ['secretwasm'],
        });
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const enigmaUtils = window.getEnigmaUtils(chainId);
        const accounts = await offlineSigner.getAccounts();
        this.signingClient = new SigningCosmWasmClient(
          this.secretRestUrl,
          accounts[0].address,
          offlineSigner,
          enigmaUtils,
          {
            init: {
              amount: [{ amount: '300000', denom: 'uscrt' }],
              gas: '300000',
            },
            exec: {
                amount: [{ amount: '1000000', denom: 'uscrt' }],
                gas: '1000000',
            },
          }
        );
        return await this.signingClient.execute(address, handleMsg);
      } catch (error) {
        console.error(error)
      }
    } else {
        alert("Please use the recent version of keplr extension");
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
