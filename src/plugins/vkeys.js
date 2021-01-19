
import Vuex from 'vuex';

export default {
    install(Vue, options) {

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$vkeys', {
            namespaced: true,
            state: {
                vkeys: [],
            },
            getters: {
                getVKey: (state) => {
                    return (userAddress, contractAddress) => {
                        return state.availableTokens.filter(token => { return token.address == address})[0];
                    };
                },
                putVKey: (state) => {
                    return (userAddress, contractAddress, vKey) => {
                        return state.availableTokens.filter(token => { return token.address == address})[0];
                    };
                }
            },
            mutations: {
                
            },
            actions: {

            }
        });


        Vue.prototype.$vkeys = {
            list: (userAddress, contractAddress) => {

            },
            get: (userAddress, contractAddress) => {

            },
            put: (userAddress, contractAddress, vKey) => {

            }
        };
    }
}