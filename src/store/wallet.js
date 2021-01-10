import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    wallet: {
        address: null,
        balance: 0,
        denom: "",
    }
  },
  mutations: {
    walletAddress(state, address) {
        console.log('inside store', address);
      state.wallet.address = address;
    },
  },
});

export default store;