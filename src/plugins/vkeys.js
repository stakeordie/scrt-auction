import { SecretJsClient } from '../lib/secretjs-client.js'
import Vuex from 'vuex';

function aRandomStringForEntropy(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default {
    install(Vue, options) {
        const secretJsClient = new SecretJsClient(options.restUrl, options.wallet);

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$vkeys', {
            namespaced: true,
            state: {
                vkeys: [],
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
                createViewingKey: async({state}, { userAddress, contractAddress, fees}) => {
                    let userVkeys = state.vkeys.find(vkey => vkey.userAddress == userAddress);
                    if(userVkeys == undefined) {
                        userVkeys = {
                            userAddress,
                            viewingKeys: [],
                        }
                        state.vkeys.push(userVkeys);
                    }
                    if(!fees) {
                        fees = "120000";
                    }
                    const msg = {
                        "create_viewing_key":{
                            "entropy": aRandomStringForEntropy(27),
                            "padding": "*".repeat(13)
                        }
                    }
                    const response = await secretJsClient.executeContract(contractAddress, msg, fees);
                    console.log(response);
                    if(response.create_viewing_key) {
                        return response.create_viewing_key.key;
                    } else {
                        return response.viewing_key.key;
                    }
                },
                putViewingKey: async ({ commit }, { userAddress, contractAddress, viewingKey }) => {
                    commit("updateViewingKey", { userAddress, contractAddress, viewingKey });
                },
                deleteViewingKey: async ({ commit }, { userAddress, contractAddress }) => {
                    commit("deleteViewingKey", { userAddress, contractAddress });
                }
            }
        });

        const vkeys = {
            create: (userAddress, contractAddress, fees) => {
                return Vue.prototype.$store.dispatch('$vkeys/createViewingKey', { userAddress, contractAddress, fees});
            },
            list: Vue.prototype.$store.getters['$vkeys/listViewingKeys'],
            get: Vue.prototype.$store.getters['$vkeys/getViewingKey'],
            delete: (userAddress, contractAddress) => {
                Vue.prototype.$store.dispatch('$vkeys/deleteViewingKey', { userAddress, contractAddress });
            },
            put: (userAddress, contractAddress, viewingKey) => {
                Vue.prototype.$store.dispatch('$vkeys/putViewingKey', { userAddress, contractAddress, viewingKey });
            }
        };

        Vue.prototype.$vkeys = vkeys;
    }
}