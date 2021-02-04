export default {
    chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
    chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
    rest: process.env.GRIDSOME_SECRET_REST_URL,
    rpc: process.env.GRIDSOME_SECRET_RPC_URL,
    
    currencies: [
      {
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
      },
    ],
    stakeCurrency: {
      coinDenom: 'SCRT',
      coinMinimalDenom: 'uscrt',
      coinDecimals: 6,
      // coinGeckoId: ""
    },
    feeCurrencies: [
      {
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
      },
    ],
    gasPriceStep: {
      low: .1,
      average: .25,
      high: .4,
    },

    // walletUrlForStaking: "",
    bip44: {
      coinType: 529,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'secret',
      bech32PrefixAccPub: 'secretpub',
      bech32PrefixValAddr: 'secretvaloper',
      bech32PrefixValPub: 'secretvaloperpub',
      bech32PrefixConsAddr: 'secretvalcons',
      bech32PrefixConsPub: 'secretvalconspub',
    },
    coinType: 529,
    features: ['secretwasm'],
  }