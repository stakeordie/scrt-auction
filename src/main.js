import "./sass/style.scss"

import Flare from "@lkmx/flare"

import Keplr from "./plugins/keplr"
import Scrt from "./plugins/scrt"

import DefaultLayout from "~/layouts/DefaultLayout.vue";


export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("DefaultLayout", DefaultLayout);

  Vue.use(Flare);

  Vue.use(Scrt, {
    restUrl: process.env.GRIDSOME_SECRET_REST_URL,
  });
  
  Vue.use(Keplr, { 
    chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
  });

}
