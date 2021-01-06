export default class Keplr {
  chainId;
  chainName;
  restUrl;
  rpcUrl;

  constructor(chainId, chainName, restUrl, rpcUrl) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.restUrl = restUrl;
    this.rpcUrl = rpcUrl;


    this.command(async () => {

      if (keplr.experimentalSuggestChain) {
        await keplr.experimentalSuggestChain({
          // Chain-id of the Cosmos SDK chain.
          chainId,
          // The name of the chain to be displayed to the user.
          chainName,
          // RPC endpoint of the chain.
          rpc: rpcUrl,
          // REST endpoint of the chain.
          rest: restUrl,
          // Staking coin information
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: 'SCRT',
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: 'uscrt',
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: 6,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: ""
          },
          // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
          // The 'stake' button in Keplr extension will link to the webpage.
          // walletUrlForStaking: "",
          // The BIP44 path.
          bip44: {
            // You can only set the coin type of BIP44.
            // 'Purpose' is fixed to 44.
            coinType: 529,
          },
          // Bech32 configuration to show the address to user.
          // This field is the interface of
          // {
          //   bech32PrefixAccAddr: string;
          //   bech32PrefixAccPub: string;
          //   bech32PrefixValAddr: string;
          //   bech32PrefixValPub: string;
          //   bech32PrefixConsAddr: string;
          //   bech32PrefixConsPub: string;
          // }
          bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub',
          },
          // List of all coin/tokens used in this chain.
          currencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          // List of coin/tokens used as a fee token in this chain.
          feeCurrencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          // (Optional) The number of the coin type.
          // This field is only used to fetch the address from ENS.
          // Ideally, it is recommended to be the same with BIP44 path's coin type.
          // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
          // So, this is separated to support such chains.
          coinType: 529,
          // (Optional) This is used to set the fee of the transaction.
          // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
          // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
          gasPriceStep: {
            low: 1,
            average: 5,
            high: 4,
          },
          features: ['secretwasm'],
        });
      }


      console.log("Document ready state: " + document.readyState);
      console.log("Keplr client ready, waiting to connet to " + this.chainId);
    });
  }

  async enable() {
    return await this.command(async () => {
      try {
        return await window.keplr.enable(this.chainId);
      } catch {
        throw "Keplr rejected the connection";
      }
    });
  }

  async getSelectedAddress() {
    return await this.command(async () => {
      try {
        const key = await window.keplr.getKey(this.chainId);
        return key.bech32Address;
      } catch {
        return null;
      }
    });
  }

  async getSigner() {
    return window.getOfflineSigner(this.chainId);
  }

  async command(command) {
    const execute = async () => {
      if (!window.getOfflineSigner || !window.keplr) {
        throw "Keplr extension is not installed";
      }
      return await command();
    };

    if (document.readyState === "complete") {
      return await execute();
    } else {
      return new Promise((resolve, reject) => {
        window.onload = async () => {
          try {
            resolve(await execute());
          } catch(err) {
            reject(err);
          }
        };
      });
    }
  }
}
