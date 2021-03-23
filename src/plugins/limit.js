import {LimitApi} from '../lib/limit-api.js'
import moment from 'moment'
import {Decimal} from 'decimal.js';

import Vuex from 'vuex';

//setup variables

export default {
    install(Vue, options) {
        const limitApi = new LimitApi(options.chainClient, options.factoryAddress);
        
        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$limit', {
            namespaced: true,
            state: {
                // auctions: [],
                // auctionsViewer: {
                //     stats: {
                //       isSellerTotal: 0,
                //       isBidderTotal: 0,
                //       wasSellerTotal: 0,
                //       isWinnerTotal: 0,
                //       successfulSellerTotal: 0
                //     }
                // },
                // auctionsFilter: {
                //   sellToken: "",
                //   bidToken: "",
                //   onlyMine: false,
                //   showClosed: false,
                //   viewMode: "grid",
                //   sort: {
                //       priority: "price",
                //       fields: {
                //           sell: "asc",
                //           sell: "asc",
                //           price:  "asc"
                //       }
                //   }
                // },
                // tokenData: [],
            },
            getters: {
                getBooks: async () => {
                    console.log("pluginTEST");
                    return await limitApi.getBooker();
                },              
            },
            mutations: {
                //EXAMPLE Mutation
                updateAuction: (state, auction) => {
                    // let currentAuction = state.auctions.find(a => a.address == auction.address );
                    // if(!currentAuction) {
                    //     state.auctions.push(auction);
                    // } else {
                    //     Vue.set(currentAuction,"description",auction.description);
                    //     Vue.set(currentAuction,"endsAt",auction.endsAt);
                    // }
                },
            },
            actions: {
                //EXAMPLE Action
                updateAuction: async ({ commit }, address) => {
                    // //replacement
                    // const auction = await auctionsApi.getAuction(address);
                    // //replaced
                    // //const auctionInfo = await auctionsApi.getAuctionInfo(address);

                    // commit("updateAuction", auction);
                },
            }
      });

      Vue.prototype.$limit = new LimitApi(options.chainClient, options.factoryAddress);

      Vue.prototype.$limit.getBooks = Vue.prototype.$store.getters['$limit/getBooks'];

        // updateClosedAuctions: async ({ commit, state }) => {
        //     const closedAuctions = await auctionsApi.listClosedAuctions(state.tokenData);
        //     if (closedAuctions) {
        //         commit("updateAuctions", closedAuctions);
        //     }
        // }
    }
}