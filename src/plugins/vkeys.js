
import Vuex from 'vuex';

export default {
    install(Vue, options) {

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$vkeys', {
            namespaced: true,
            state: {
                vkeys: [
                    {
                        userAddress: "xxxsecret1dt90gy0e8kqlckx85a62euyv04hpk39f4ngxsl",
                        viewingKeys: [
                            {
                                contractAddress: "secret1j769nz95fklgzge976veqhlknph76ss34k97zw",
                                key: "kkk=",
                            }
                        ]
                    }
                ],
            },
            getters: {
                listViewingKeys: (state) => {
                    return (userAddress) => {
                        return state.vkeys.filter(vkey => vkey.userAddress == userAddress)[0]?.viewingKeys;
                    }
                },
                getViewingKey: (state) => {
                    return (userAddress, contractAddress) => {
                        return state.vkeys.filter(vkey => vkey.userAddress == userAddress)[0]?.viewingKeys.filter(viewingKey => viewingKey.contractAddress == contractAddress)[0];
                    }
                },
            },
            mutations: {
                updateViewingKey: (state, { userAddress, contractAddress, viewingKey }) => {
                    let userVkeys = state.vkeys.filter(vkey => vkey.userAddress == userAddress)[0];
                    if(userVkeys == undefined) {
                        userVkeys = {
                            userAddress,
                            viewingKeys: [],
                        }
                        state.vkeys.push(userVkeys);
                    }

                    let userContractViewingKey = userVkeys.viewingKeys.filter(viewingKey => viewingKey.contractAddress == contractAddress)[0];
                    if(userContractViewingKey == undefined) {
                        userContractViewingKey = {
                            contractAddress,
                            key: viewingKey
                        }
                        console.log('pushing and failing')
                        userVkeys.viewingKeys.push(userContractViewingKey);
                    } else {
                        userContractViewingKey.key = viewingKey;
                    }
                }
            },
            actions: {
                putViewingKey: async ({ commit }, { userAddress, contractAddress, viewingKey }) => {
                    commit("updateViewingKey", { userAddress, contractAddress, viewingKey });
                }
            }
        });


        Vue.prototype.$vkeys = {
            list: Vue.prototype.$store.getters['$vkeys/listViewingKeys'],
            get: Vue.prototype.$store.getters['$vkeys/getViewingKey'],
            put: (userAddress, contractAddress, viewingKey) => {
                Vue.prototype.$store.dispatch('$vkeys/putViewingKey', { userAddress, contractAddress, viewingKey });
            }
        };
    }
}