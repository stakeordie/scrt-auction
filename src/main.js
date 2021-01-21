import "@fontsource/hind/600.css"
import "@fontsource/montserrat"
import "@fontsource/montserrat/600.css"
import "animate.css"
import "./sass/style.scss"


import Flare from "@lkmx/flare"

import VKeys from "./plugins/vkeys"
import Keplr from "./plugins/keplr"
import ScrtJs from "./plugins/scrt"
import AuctionsApi from "./plugins/auctions"

import DefaultLayout from "~/layouts/DefaultLayout.vue";


import Vuex from 'vuex';

Number.prototype.countDecimals = function () {
  if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
  return this.toString().split(".")[1].length || 0; 
}

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("DefaultLayout", DefaultLayout);

  Vue.use(Flare);


  Vue.use(Vuex);
  Vue.prototype.$store = new Vuex.Store({});

  Vue.use(VKeys);
  
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
        });
      }

    }
  });

  Vue.use(ScrtJs, { 
    restUrl: process.env.GRIDSOME_SECRET_REST_URL, 
    wallet: Vue.prototype.$keplr 
  });

  Vue.use(AuctionsApi, { 
    chainClient: Vue.prototype.$scrtjs,
    factoryAddress: process.env.GRIDSOME_AUCTIONS_FACTORY,
    availableTokens: [
      {
          codeId: 1,
          symbol: "SODTA",
          address: "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga",
          name: "sodta",
          label: "sodta",
          decimals: 8
      },
      {
          codeId: 1,
          symbol: "SODTB",
          address: "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy",
          name: "sodtb",
          label: "sodtb",
          decimals: 6
      },
      {
          codeId: 1,
          symbol: "SODTC",
          address: "secret1rdz9e9hln0lv0y33se380fczmmst72ffzlqg9a",
          name: "SODTC",
          label: "sodtc",
          decimals: 6
      },
      {
          codeId: 1,
          symbol: "SODTD",
          address: "secret1yt94lse0rl89a9kdylhr80jffpuekv0tzpx2k0",
          name: "Stake or Die Token D",
          label: "sodtd",
          decimals: 6
      },
      {
          codeId: 1,
          symbol: "SODTE",
          address: "secret18u0m2um6vv08ftzxls897gytd4tzcc2w6vlem6",
          name: "Stake or Die Token E",
          label: "sodta",
          decimals: 6
      }
    ]
  });
  

}
