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
          symbol: "TSUNI",
          address: "secret16v7a5lhuglkp5szdkfdxwhgkg3g2t2hmmy92h4",
          name: "Test Secret Uniswap",
          label: "tsUNI",
          decimals: 18
      },
      {
          codeId: 1,
          symbol: "TSDAI",
          address: "secret1r4z6fh6gzlqdf4gaqx29mr6340w9vastj4jhvv",
          name: "Test Secret Dai",
          label: "tsDAI",
          decimals: 18
      },
      {
          codeId: 1,
          symbol: "TSUSDT",
          address: "secret196uyuzlw039hztfmv4g0kjp2u376ucsfv0fmss",
          name: "Test Secret Tether",
          label: "tsUSDT",
          decimals: 6
      },
      {
          codeId: 1,
          symbol: "TSSNDY",
          address: "secret10urze7sugs0phls3zvd7fh5354e993ta32873p",
          name: "Test Secret Sandy",
          label: "tsSNDY",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSVCTR",
          address: "secret1apmpvsvue9skm7a7vedpplgzdc46uv7h346m00",
          name: "Test Secret Victor",
          label: "tsVCTR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSCAN",
          address: "secret10cwxfegdvusw05n095dec3a26ewk8nuluwvt28",
          name: "Test Secret Can",
          label: "tsCAN",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSTOR",
          address: "secret15vh7r8c379r7vp86m24r6uwequ2az6agnhfh4p",
          name: "Test Secret Tor",
          label: "tsTOR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSJRDN",
          address: "secret1u42dr4kxrgjsj9c37e3lq9a9akhdxzrzg32ez3",
          name: "Test Secret Jordan",
          label: "tsJRDN",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSCRTR",
          address: "secret1m8px7yknnyaxvhmk0ekyxtkekj6gud0dalk2g2",
          name: "Test Secret Carter",
          label: "tsCRTR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSBRDN",
          address: "secret1jp9e3jnnesacndgwhhwm3glq3p6y56v6vxdzd7",
          name: "Test Secret Brendan",
          label: "tsBRDN",
          decimals: 2
      }
    ]
  });
  

}
