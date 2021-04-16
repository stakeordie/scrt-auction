import "@fontsource/hind/600.css"
import "@fontsource/montserrat"
import "@fontsource/montserrat/600.css"
import "animate.css"
import "./sass/style.scss"

import Flare from "@lkmx/flare"

import { VKeys } from "@stakeordie/griptape-vue.js";
import { Keplr } from "@stakeordie/griptape-vue.js";

import ScrtJs from "./plugins/scrt"
import Auctions from "./plugins/auctions"

import DefaultLayout from "~/layouts/DefaultLayout.vue"
import LandingLayout from "~/layouts/LandingLayout.vue"


import Vuex from 'vuex';
import statePersist from './plugins/state-persist';

import testnetChain from "./lib/chain/testnet";

import tokensForTesting from "./lib/tokens/testnet"
import tokensForProduction from "./lib/tokens/mainnet"

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

export default function (Vue, { router, head, isClient }) {
    // Set default layout as a global component
    Vue.component("DefaultLayout", DefaultLayout);
    Vue.component("LandingLayout", LandingLayout);

    Vue.filter("abbrv", (str, abbrv) => {
        const half = (abbrv / 2) || 8;
        return str ? str.substring(0, half) + "..." + str.substring(str.length - half, str.length) : '';
    });

    Vue.use(Flare);

    Vue.use(Vuex);
    Vue.prototype.$store = new Vuex.Store({
        plugins: [statePersist.plugin],
    });

    Vue.use(Keplr, {
        chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
        chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
        restUrl: process.env.GRIDSOME_SECRET_REST_URL,
        rpcUrl: process.env.GRIDSOME_SECRET_RPC_URL,
        onLoad: () => {
            if (process.env.GRIDSOME_SECRET_EXPERIMENTAL_CHAIN) {
                Vue.prototype.$keplr.suggestExperimental(testnetChain);
            }
        }
    });

    Vue.use(VKeys, {
        restUrl: process.env.GRIDSOME_SECRET_REST_URL,
        wallet: Vue.prototype.$keplr
    });

    Vue.use(ScrtJs, {
        restUrl: process.env.GRIDSOME_SECRET_REST_URL,
        wallet: Vue.prototype.$keplr
    });

    // Available tokens are enabled depending on the chain
    let availableTokens;
    if (process.env.GRIDSOME_SECRET_CHAIN_ID == "secret-2") {
        availableTokens = tokensForProduction;
    } else {
        availableTokens = tokensForTesting;
    }

    Vue.use(Auctions, {
        chainClient: Vue.prototype.$scrtjs,
        factoryAddress: process.env.GRIDSOME_AUCTIONS_FACTORY,
        availableTokens
    });

    // The state is persisted after the plugins have been loaded
    statePersist.start();
}
