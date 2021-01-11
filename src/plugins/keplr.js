import Keplr from "../lib/keplr";

import Vuex from 'vuex';


export default {
  install(Vue, options) {

    Vue.use(Vuex);
    
    Vue.prototype.$store = new Vuex.Store({
      modules: {
        $keplr: {
          namespaced: true,
          state: {
            chainId: "",
            chainName: "",
            accounts: []
          },
          getters: {
            selectedAccount: state => {
              return state.accounts.find(e => e.selected);
            }
          },
          mutations: {
            selectAccount(state, address) {
              state.accounts.forEach(e => {e.selected = false});

              if(address) {
                let account = state.accounts.find(e => e.address == address);
                if(account == undefined) {
                  account = {
                    selected: true,
                    address,
                    balance: null,
                    keys: {}
                  };
  
                  state.accounts.push(account);
                } else {
                  state.accounts.find(e => e.address == account.address).selected = true;
                }
              }
            }
          },
          actions: {
            selectAccount({commit}, address) {
              commit("selectAccount", address);
            }
          }
        }
      },
    });


    const keplrWallet = new Keplr(
      options.chainId,
      options.chainName,
      options.restUrl,
      options.rpcUrl,
      // On load
      () => {
        options.onLoad();
      },
      // When something goes wrong
      (err) => {
        console.error(err);
      }
    );

    keplrWallet.onAddressChanged = (newAddress) => {
      Vue.prototype.$store.dispatch('$keplr/selectAccount', newAddress);
    },

    Object.defineProperty(Vue.prototype, "$keplr", { value: keplrWallet });
  },
};
