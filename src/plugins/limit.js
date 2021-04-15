import {LimitApi} from '../lib/limit-api.js'
import moment from 'moment'
import {Decimal} from 'decimal.js';

import Vuex from 'vuex';

const tokens2Decimal = (amount, decimals) => {
    return Number(amount / Math.pow(10, decimals));
};

const arrayHash = (str, array) => {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return array[Math.abs(hash) % array.length];
}

//setup variables

export default {
    install(Vue, options) {
        const limitApi = new LimitApi(options.chainClient, options.factoryAddress);

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$limit', {
            namespaced: true,
            state: {
                orderBooks: [],
                ammPairs: [],
                tokenData: [],
                refresh: {}
            },
            getters: {
                orderBooks: state => {
                    return state.orderBooks;
                },
                ammPairs: state => {
                    return state.ammPairs;
                },
                tokenData: state => {
                    return state.tokenData;
                }       
            },
            mutations: {
                updateTokenData(state, tokenData) {
                    state.tokenData = tokenData;
                    state.refresh = { ...state.refresh, tokenData: moment().add(15,'minutes').format()}
                },
                updateOrderBooks: (state, orderBooks) => {
                    let currentOrderBook;
                    orderBooks.forEach(orderBook => {
                        currentOrderBook = state.orderBooks.find(ob => ob.address == orderBook.address);
                        if(!currentOrderBook) {
                            state.orderBooks.push(orderBook);
                        } else {
                            Object.assign(currentOrderBook, orderBook);
                        }
                    });
                    state.refresh = { ...state.refresh, orderBooks: moment().add(15,'minutes').format()}
                },
                updateAmmPairs: (state, ammPairs) => {
                    let currentAmmPair;
                    ammPairs.forEach(ammPair => {
                        currentAmmPair = state.ammPairs.find(amm => amm.address == ammPair.address);
                        if(!currentAmmPair) {
                            state.ammPairs.push(ammPair);
                        } else {
                            Object.assign(currentAmmPair, ammPair);
                        }
                    });
                    state.refresh = { ...state.refresh, ammPairs: moment().add(15,'minutes').format()}
                }
            },
            actions: {
                updateOrderBooks: async ({commit, state}) => {
                    //check refresh time
                    const orderBooks = await limitApi.getOrderBooks(state.tokenData);
                    if (orderBooks) {
                        commit("updateOrderBooks", orderBooks);
                    }
                },
                updateAmmPairs: async ({commit, state}) => {
                    //check refresh time
                    const ammPairs = await limitApi.getAmmPairs(state.tokenData);
                    console.log(ammPairs);
                    if (ammPairs) {
                        commit("updateAmmPairs", ammPairs);
                    }
                },
                createBid: async({commit, state}, {orderBook, priceUBase, amountUBase}) => {
                    const response = await limitApi.createBid(orderBook, priceUBase, amountUBase);
                    console.log(response);
                    return response;
                }
            }
      });

      //Mutate up front
      Vue.prototype.$store.commit('$limit/updateTokenData', options.tokenData);

      //Passthrough
      Vue.prototype.$limit = new LimitApi(options.chainClient, options.factoryAddress);

      //GETTERS
      Vue.prototype.$limit.getOrderBooks = Vue.prototype.$store.getters['$limit/orderBooks'];
      Vue.prototype.$limit.getAmmPairs = Vue.prototype.$store.getters['$limit/ammPairs'];
      Vue.prototype.$limit.getTokenData = Vue.prototype.$store.getters['$limit/tokenData'];

      //Actions
      Vue.prototype.$limit.updateOrderBooks = async () => {
        Vue.prototype.$store.dispatch('$limit/updateOrderBooks');
      }

      Vue.prototype.$limit.updateAmmPairs = async () => {
        Vue.prototype.$store.dispatch('$limit/updateAmmPairs');
      }

      Vue.prototype.$limit.createBid = async (bidForm) => {
        return Vue.prototype.$store.dispatch('$limit/createBid', {orderBook: bidForm.orderBook, priceUBase: bidForm.bidPrice, amountUBase: bidForm.askAmount});
     };
    }
}