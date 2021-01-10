import "animate.css"

import "./sass/style.scss"

import Flare from "@lkmx/flare"

import Keplr from "./plugins/wallet"
import ScrtJs from "./plugins/scrt"
import AuctionsApi from "./plugins/auctions"

import DefaultLayout from "~/layouts/DefaultLayout.vue";


export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("DefaultLayout", DefaultLayout);

  Vue.use(Flare);


  Vue.use(Keplr, { 
    chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
    chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
    restUrl: process.env.GRIDSOME_SECRET_REST_URL,
    rpcUrl: process.env.GRIDSOME_SECRET_RPC_URL,
    
    onLoad: () => {

      if(process.env.GRIDSOME_SECRET_EXPERIMENTAL_CHAIN) {
        Vue.prototype.$keplr.suggestExperimental({
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
            low: 1,
            average: 5,
            high: 4,
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
        });
      }

    }
  });

  Vue.use(ScrtJs, { 
    restUrl: process.env.GRIDSOME_SECRET_REST_URL, 
    wallet: Vue.prototype.$kplr 
  });

  Vue.use(AuctionsApi, { 
    chainClient: Vue.prototype.$scrtjs,
    factoryAddress: process.env.GRIDSOME_AUCTIONS_FACTORY,
  });
  

}
