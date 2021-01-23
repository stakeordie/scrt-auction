
import Vuex from 'vuex';

export default {
    install(Vue, options) {

        Vue.filter("abbrv", (str, abbrv) => {
            const half = (abbrv / 2) || 8;
            return str.substring(0, half) + "..." + str.substring(str.length - half, str.length);
        });

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
                    let userVkeys = state.vkeys.find(vkey => vkey.userAddress == userAddress);
                    if(userVkeys == undefined) {
                        userVkeys = {
                            userAddress,
                            viewingKeys: [],
                        }
                        state.vkeys.push(userVkeys);
                    }

                    let userContractViewingKey = userVkeys.viewingKeys.find(viewingKey => viewingKey.contractAddress == contractAddress);
                    if(userContractViewingKey == undefined) {
                        userContractViewingKey = {
                            contractAddress,
                            key: viewingKey
                        }
                        userVkeys.viewingKeys.push(userContractViewingKey);
                    } else {
                        userContractViewingKey.key = viewingKey;
                    }
                },
                deleteViewingKey: (state, {userAddress, contractAddress}) => {
                    // First we find the objects holding user's keys
                    const vkey = state.vkeys.find(vkey => vkey.userAddress == userAddress);
                    if(vkey) {
                        const viewingKeyIndex = vkey.viewingKeys.findIndex(viewingKey => viewingKey.contractAddress == contractAddress);
                        vkey.viewingKeys.splice(viewingKeyIndex, 1);
                    }
                },
            },
            actions: {
                putViewingKey: async ({ commit }, { userAddress, contractAddress, viewingKey }) => {
                    commit("updateViewingKey", { userAddress, contractAddress, viewingKey });
                },
                deleteViewingKey: async ({ commit }, { userAddress, contractAddress }) => {
                    commit("deleteViewingKey", { userAddress, contractAddress });
                }
            }
        });


        Vue.prototype.$vkeys = {
            list: Vue.prototype.$store.getters['$vkeys/listViewingKeys'],
            get: Vue.prototype.$store.getters['$vkeys/getViewingKey'],
            delete: (userAddress, contractAddress) => {
                Vue.prototype.$store.dispatch('$vkeys/deleteViewingKey', { userAddress, contractAddress });
            },
            put: (userAddress, contractAddress, viewingKey) => {
                Vue.prototype.$store.dispatch('$vkeys/putViewingKey', { userAddress, contractAddress, viewingKey });
            }
        };
    }
}