import Keplr from "../lib/keplr";

import store from '../store/wallet';

import Vuex from 'vuex';



export default {
  install(Vue, options) {

    Vue.use(Vuex);

    Vue.prototype.$store = store;


    const keplrWallet = new Keplr(
      options.chainId,
      options.chainName,
      options.restUrl,
      options.rpcUrl,
      // On load
      () => {
        options.onLoad();
      },
      // On address update
      (newAddress) => {
        console.log("Setting new address:", newAddress);

        console.log(Vue.prototype);
        Vue.prototype.$store.commit('walletAddress', newAddress);
      },
      // When something goes wrong
      (err) => {
          console.error(err);
      }
    );

    Object.defineProperty(Vue.prototype, "$keplr", { value: keplrWallet });
  },
};
