
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

                },
                putVKey: (state) => {

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