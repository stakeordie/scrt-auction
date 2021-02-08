import { AuctionsApi } from '../lib/auctions-api.js'
import emojis from '../lib/emojis.js'

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

// This plugin is the abstraction layer in charge of picking up the domain from the API client, 
// and convert it into a model usable by the UI
export default {
    install(Vue, options) {
        const auctionsApi = new AuctionsApi(options.chainClient, options.factoryAddress);

        const transformActiveAuction = (rawction, status) => {
            const colors = ["purple", "orange", "cream", "blue", "yellow", "red", "green"];
            const auction = {
                address: rawction.address,
                label: rawction.label,
                pair: rawction.pair,
                emoji: arrayHash(rawction.label, emojis),
                color: arrayHash(rawction.pair, colors),
                color2: arrayHash(rawction.address, colors),
                description: null,    // MIA
                sell: {
                    amount: rawction.sell_amount,
                    decimalAmount: tokens2Decimal(rawction.sell_amount, rawction.sell_decimals),
                    decimals: rawction.sell_decimals,
                    denom: rawction.pair.split("-")[0],
                    contract: null,    // MIA
                },
                bid: {
                    decimals: rawction.bid_decimals,
                    denom: rawction.pair.split("-")[1],
                    contract: null,    // MIA
                },
                endsAt: new Date(rawction.ends_at * 1000),
            };

            auction.bid.minimum = rawction.minimum_bid;
            auction.bid.decimalMinimum = tokens2Decimal(rawction.minimum_bid, rawction.bid_decimals);
            auction.price = auction.bid.decimalMinimum / auction.sell.decimalAmount;
            auction.status = "ACTIVE";

            return auction;
        };

        // This transforms the auction info object into a compatible auction object to be
        // blended with the list
        const transformAuctionInfo = (rawction) => {
            const auction = {
                address: rawction.auction_info.auction_address,
                label: null,    // MIA
                pair: null,     // MIA
                emoji: 0x1F41D,     // MIA
                color: "purple",    // MIA
                color2: "purple",   // MIA
                description: rawction.auction_info.description,  // NEW
                sell: {
                    amount: rawction.auction_info.sell_amount,
                    decimalAmount: tokens2Decimal(rawction.auction_info.sell_amount, rawction.auction_info.sell_token.token_info.decimals),
                    decimals: rawction.auction_info.sell_token.token_info.decimals,
                    denom: rawction.auction_info.sell_token.token_info.symbol,
                    contract: rawction.auction_info.sell_token.contract_address,  // NEW
                },
                bid: {
                    decimals: rawction.auction_info.bid_token.token_info.decimals,
                    denom: rawction.auction_info.bid_token.token_info.symbol,
                    contract: rawction.auction_info.bid_token.contract_address,  // NEW
                },
                endsAt: new Date(rawction.auction_info.ends_at),
                status: rawction.auction_info.status.startsWith("Accepting bids") ? "ACTIVE" : "CLOSED",
            };

            if(rawction.auction_info.minimum_bid) {
                auction.bid.minimum = rawction.auction_info.minimum_bid;
                auction.bid.decimalMinimum = tokens2Decimal(rawction.auction_info.minimum_bid, auction.bid.decimals);
                auction.price = auction.bid.decimalMinimum / auction.sell.decimalAmount;
            }
            return auction;
        };
        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$auctions', {
              namespaced: true,
              state: {
                  auctions: [],
                  viewer: {
                    userAddress: null,
                    viewingKey: null,
                  },
                  auctionsFilter: {
                    sellToken: "",
                    bidToken: "",
                    showActive: true,
                    showClosed: false,
                    showMine: false,
                    viewMode: "grid",
                    sort: {
                        priority: "price",
                        fields: {
                            sell: "asc",
                            sell: "asc",
                            price:  "asc"
                        }
                    }
                  },
                  tokenData: [],
              },
              getters: {
                getAuction: state => {
                    return (auctionAddress) => {
                        return state.auctions.find(auction => auction.address == auctionAddress);
                    }
                },
                // Since filter and sorting is done in the client, this is performed by a getter instead
                // of a dispatcher storing a plain list of search results filtered and ordered in the server
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
                    }).sort((a, b) => {
                        const priceOrderFactor = state.auctionsFilter.sort.fields.price == "asc" ? -1 : 1;
                        if(state.auctionsFilter.sort.priority == "price") {
                            if(a.price > b.price) {
                                return priceOrderFactor * -1;
                            } else {
                                return priceOrderFactor;
                            }
                        }

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
                tokenData: state => {
                    return state.tokenData;
                },
                availableTokens: state => {
                    return state.tokenData;
                },
                getToken: (state) => {
                    return (address) => {
                        return state.tokenData.filter(token => { return token.address == address})[0];
                    };
                },
              },
              mutations: {
                // Merge from auction with existing auctions
                updateAuction: (state, auction) => {
                    const currentAuction = state.auctions.find(a => a.address == auction.address );
                    if(!currentAuction) {
                        state.auctions.push(auction);
                    } else {
                        currentAuction.description = auction.description;
                        currentAuction.sell.contract = auction.sell.contract;
                        currentAuction.bid.contract = auction.bid.contract;
                        currentAuction.status = auction.status;
                    }
                    //console.log(auction, currentAuction);
                },
                // Merge from auctions with existing auctions
                updateActiveAuctions: (state, auctions) => {
                    auctions.forEach(a => {
                        let auction = state.auctions.find(sa => sa.address == a.address);
                        if(!auction) {
                            state.auctions.push(a);
                        } else {
                            auction.label = a.label;
                            auction.pair = a.pair;
                            auction.emoji = a.emoji;
                            auction.color = a.color;
                            auction.color2 = a.color2;
                            auction.status = a.status;

                            auction.endsAt = a.endsAt;
                        }
                    });
                },





                updateAuctionsFilter: (state, auctionsFilter) => {
                    state.auctionsFilter = auctionsFilter;
                },

                updateAuctionsViewer: (state, auctionsViewer) => {
                    state.viewer = auctionsViewer;
                },

                updateAvailableTokens(state, tokenData) {
                    state.tokenData = tokenData;
                },
                
              },
              actions: {
                updateAuction: async ({ commit }, address) => {
                    commit("updateAuction", transformAuctionInfo(await auctionsApi.getAuctionInfo(address)));
                },  
                updateActiveAuctions: async ({ commit }) => {
                    const activeAuctions = (await auctionsApi.listAuctions("active"))?.map(auction => {
                        return transformActiveAuction(auction);
                    });
                    if(activeAuctions) {
                        commit("updateActiveAuctions", activeAuctions);
                    }
                },
                // If the server was the one doing the filtering and sorting the API call
                // would be made here and results stored in the state (through a mutation of course)
                updateAuctionsFilter: async({ commit }, auctionsFilter) => {
                    commit("updateAuctionsFilter", auctionsFilter)
                },

                updateAuctionsViewer: async({ commit }, auctionsViewer) => {
                    if(auctionsViewer.viewingKey) {
                        const viewerAuctions = await auctionsApi.listUserAuctions(auctionsViewer.userAddress, auctionsViewer.viewingKey);
                        const modifiedAuctions = viewerAuctions.list_my_auctions.active.as_seller.map(rawction => {
                            const auction = transformActiveAuction(rawction);
                            auction.isSeller = true;
                            return auction;
                        });
                        console.log(modifiedAuctions);
                        commit("updateAuctionsViewer", auctionsViewer);
                    } else {
                        // TODO delete the viewer
                    }
                },
            }
        });
        
        Vue.prototype.$store.commit('$auctions/updateAvailableTokens', options.availableTokens);
        
        Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);

        Vue.prototype.$auctions.getAuction = Vue.prototype.$store.getters['$auctions/getAuction'];

        Vue.prototype.$auctions.emojiHash = (label) => {
            return arrayHash(label, emojis);
        };

        Vue.prototype.$auctions.updateActiveAuctions = async () => {
            Vue.prototype.$store.dispatch('$auctions/updateActiveAuctions');
        };

        Vue.prototype.$auctions.updateAuction = async (address) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuction', address);
        };

        Vue.prototype.$auctions.updateAuctionsFilter = async (auctionsFilter) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsFilter', auctionsFilter);
        };

        Vue.prototype.$auctions.updateAuctionsViewer = async (auctionsViewer) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsViewer', auctionsViewer);
        };
    }
}