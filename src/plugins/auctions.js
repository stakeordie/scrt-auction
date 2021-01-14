import { AuctionsApi } from '../lib/auctions-api.js'

import Vuex from 'vuex';


const tokens2Human = (amount, decimals) => {
    return (amount / Math.pow(10, decimals)).toFixed(decimals);
}


// This plugin is the abstraction layer in charge of picking up the results from the API client, 
// convert the 
export default {
    install(Vue, options) {
        const auctionsApi = new AuctionsApi(options.chainClient, options.factoryAddress);

        const transformAuction = (rawction, status) => {
            const auction = {
                address: rawction.address,
                label: rawction.label,
                pair: rawction.pair,
                sell: {
                    amount: rawction.sell_amount,
                    humanAmount: tokens2Human(rawction.sell_amount, rawction.sell_decimals),
                    decimals: rawction.sell_decimals,
                    denom: rawction.pair.split("-")[0]
                },
                bid: {
                    decimals: rawction.bid_decimals,
                    denom: rawction.pair.split("-")[1]
                },
            };

            if(status == "active") {
                auction.bid.minimum = rawction.minimum_bid;
                auction.bid.humanMinimum = tokens2Human(rawction.minimum_bid, rawction.bid_decimals);
                auction.closed = false;
            }
            if(status == "closed") {
                if(auction.winning_bid) {
                    auction.winning = {
                        amount: auction.winning_bid,
                        humanAmount: tokens2Human(auction.winning_bid, auction.bid_decimals),
                        timestamp: auction.timestamp,
                    }
                }
                auction.closed = true;
            }

            return auction;
        }

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$auctions', {
              namespaced: true,
              state: {
                  auctions: [],
                  auctionsFilter: {
                    sellToken: "",
                    bidToken: "",
                    showActive: true,
                    showClosed: true,
                  }
              },
              getters: {
                filteredAuctions: state => {
                    return state.auctions.filter(auction => {
                        if(state.auctionsFilter.sellToken != "" && auction.sell.denom != state.auctionsFilter.sellToken) {
                            return false;
                        }
                        if(state.auctionsFilter.bidToken != "" && auction.bid.denom != state.auctionsFilter.bidToken) {
                            return false;
                        }

                        // Checks for active status filter
                        if(state.auctionsFilter.showActive && !auction.closed) {
                            return true;
                        }
                        // Checks for closed status filter
                        if(state.auctionsFilter.showClosed && auction.closed) {
                            return true;
                        }
                        return false;
                    });
                },
                sellDenoms: state => {
                    return [...new Set(state.auctions.map(auction => {
                        return auction.sell.denom;
                    }))];
                },
                bidDenoms: state => {
                    return [...new Set(state.auctions.map(auction => {
                        return auction.bid.denom;
                    }))];
                },
              },
              mutations: {
                updateAuctions: (state, auctions) => {
                    state.auctions = auctions;
                },
                updateAuctionsFilter: (state, auctionsFilter) => {
                    state.auctionsFilter = auctionsFilter;
                },
              },
              actions: {
                updateAuctions: async ({ commit }) => {                    
                    const activeAuctions = (await auctionsApi.listAuctions("active")).map(auction => {
                        return transformAuction(auction, "active");
                    });
                    
                    const closedAuctions = (await auctionsApi.listAuctions("closed")).map(auction => {
                        return transformAuction(auction, "closed");
                    });

                    // We'll deal with the concurrency later
                    commit("updateAuctions", [...activeAuctions, ...closedAuctions]);
                },
                updateAuctionsFilter: async({ commit }, auctionsFilter) => {
                    commit("updateAuctionsFilter", auctionsFilter)
                },
            }
        });
        
        Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);

        Vue.prototype.$auctions.updateAuctions = async () => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctions');
        };

        Vue.prototype.$auctions.updateAuctionsFilter = async (auctionsFilter) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsFilter', auctionsFilter);
        };

    }
}