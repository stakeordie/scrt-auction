
import Vuex from 'vuex';

export default {
    install(Vue, options) {

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$vkeys', {
            namespaced: true,
            state: {
                vkeys: [
                    {
                        userAddress: "u",
                        viewingKeys: [
                            {
                                contractAddress: "c",
                                key: "kkk=",
                            }
                        ]
                    }
                ],
            },
            getters: {
                getViewingKey: (state) => {
                    return (userAddress, contractAddress) => {
                        return state.vkeys.filter(vkey => vkey.userAddress == userAddress).reverse()[0]?.viewingKeys.filter(viewingKey => viewingKey.contractAddress == contractAddress).reverse()[0];
                    }
                },
            },
            mutations: {
                updateViewingKey: (state, viewingKey) => {
                }
            },
            actions: {
                putViewingKey: async ({ commit }, userAddress, contractAddress, viewingKey) => {
                    commit("updateViewingKey", );
                }
            }
        });


        Vue.prototype.$vkeys = {
            list: (userAddress) => {

            },
            get: (userAddress, contractAddress) => {
                return Vue.prototype.$store.getters['$vkeys/getViewingKey'](userAddress, contractAddress);
            },
            put: (userAddress, contractAddress, viewingKey) => {
                Vue.prototype.$store.dispatch('$vkeys/putViewingKey', userAddress, contractAddress, viewingKey);
            }
        };
    }
}