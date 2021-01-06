import "animate.css"

import "./sass/style.scss"

import Flare from "@lkmx/flare"

import Keplr from "./plugins/keplr"
import ScrtJs from "./plugins/scrt"
import AuctionsApi from "./plugins/auctions"

import DefaultLayout from "~/layouts/DefaultLayout.vue";
import VueTheMask from 'vue-the-mask'


export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("DefaultLayout", DefaultLayout);

  Vue.use(Flare);
  Vue.use(VueTheMask)


  Vue.use(Keplr, { 
    chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
    chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
    restUrl: process.env.GRIDSOME_SECRET_REST_URL,
    rpcUrl: process.env.GRIDSOME_SECRET_RPC_URL,
    gasPriceSuggestion: {
      low: 0,
      mid: 1,
      high: 2,
    }
  });

  Vue.use(ScrtJs, { restUrl: process.env.GRIDSOME_SECRET_REST_URL });
  Vue.use(AuctionsApi, { factoryAddress: process.env.GRIDSOME_AUCTIONS_FACTORY});
  

}
