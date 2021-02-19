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

        // This transforms the auction info object into a compatible auction object to be
        // blended with the list
        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$auctions', {
              namespaced: true,
              state: {
                  auctions: [],
                  auctionsViewer: {},
                  auctionsFilter: {
                    sellToken: "",
                    bidToken: "",
                    onlyMine: false,
                    showClosed: false,
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
                        if(state.auctionsFilter.onlyMine && !(auction.viewerIsSeller || auction.viewerIsBidder || auction.viewerWasSeller || auction.viewerIsWinner)) {
                            return false;
                        }
                        if(!state.auctionsFilter.showClosed && auction.status === 'CLOSED') {
                            return false;
                        }
                        if(state.auctionsFilter.showClosed && auction.status === 'ACTIVE') {
                            return false;
                        }
                        if(state.auctionsFilter.showClosed && auction.status === 'CLOSED' && !auction.bid.winner) {
                            return false;
                        }

                        return true;
                    }).sort((a, b) => {
                        // First we show the active ones by default
                        if (a.status != b.status) {
                            return a.status == "ACTIVE" ? -1 : 1;
                        } else {
                            const priceOrderFactor = state.auctionsFilter.sort.fields.price == "asc" ? -1 : 1;
                            if(state.auctionsFilter.sort.priority == "price") {
                                if(a.price > b.price) {
                                    return priceOrderFactor * -1;
                                } else {
                                    return priceOrderFactor;
                                }
                            }
                        }

                    });
                },
                sellDenoms: state => {
                    return [...new Set(state.auctions.filter(auction => auction.sell).map(auction => {
                        return auction.sell.denom;
                    }))];
                },
                bidDenoms: state => {
                    return [...new Set(state.auctions.filter(auction => auction.bid).map(auction => {
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
                    let currentAuction = state.auctions.find(a => a.address == auction.address );
                    if(!currentAuction) {
                        state.auctions.push(auction);
                    } else {
                        currentAuction.description = auction.description;
                        currentAuction.endsAt = auction.endsAt;
                        currentAuction.bid.contract = auction.bid.contract;
                        currentAuction.sell.contract = auction.sell.contract;
                    }
                },

                // Merge from auctions with existing auctions
                updateAuctions: (state, auctions) => {
                    let currentAuction;
                    auctions.forEach(auction => {
                        currentAuction = state.auctions.find(sa => sa.address == auction.address);
                        if(!currentAuction) {
                            state.auctions.push(auction);
                        } else {
                            Object.assign(currentAuction, auction);
                        }
                    });
                },

                updateAuctionsFilter: (state, auctionsFilter) => {
                    state.auctionsFilter = auctionsFilter;
                },

                updateAuctionsViewer: (state, { auctionsViewer, sellerAuctions, bidderAuctions, wasSellerAuctions, wonAuctions }) => {
                    state.auctions.forEach(auction => {
                        auction.viewerIsSeller  = sellerAuctions?.findIndex(a => a.address == auction.address) > -1;
                        auction.viewerIsBidder  = bidderAuctions?.findIndex(a => a.address == auction.address) > -1;
                        auction.viewerWasSeller = wasSellerAuctions?.findIndex(a => a.address == auction.address) > -1;
                        auction.viewerIsWinner  = wonAuctions?.findIndex(a => a.address == auction.address) > -1;
                    });
                    state.auctionsViewer = auctionsViewer;
                },

                clearAuctionsViewer: (state) => {
                    state.auctions.forEach(auction => {
                        auction.viewerIsSeller = false;
                        auction.viewerIsBidder = false;
                        auction.viewerWasSeller = false;
                        auction.viewerIsWinner = false;
                        // auction.hasBids = null,
                        // auction.bidsPlaced = null
                    });
                    state.auctionsViewer = null;
                },


                updateAvailableTokens(state, tokenData) {
                    state.tokenData = tokenData;
                },
                
              },
              actions: {
                updateAuction: async ({ commit }, address) => {
                    //replacement
                    const auction = await auctionsApi.getAuction(address);
                    //replaced
                    //const auctionInfo = await auctionsApi.getAuctionInfo(address);

                    commit("updateAuction", auction);
                },

                updateAuctionBidDetails: async ({ commit }, {address, userAddress, viewingKey}) => {
                    let auction = {
                        address,
                        hasBids: false,
                        currentBid: false
                    }
                
                    const userAuctions = await auctionsApi.listUserAuctions(userAddress, viewingKey); //get userAuctions
                    
                    if(userAuctions.bidderAuctions?.findIndex(a => a.address == address) > -1) { //if am bidder
                        auction.currentBid = await auctionsApi.getCurrentBid(address, userAddress, viewingKey);
                        auction.hasBids = true;
                    } else if(userAuctions.bidderAuctions?.findIndex(a => a.address == address) > -1) { //if am seller
                        auction.hasBids = await auctionsApi.getAuctionHasBidsInfo(address, userAddress, viewingKey);
                        
                    }
                    
                    commit("updateAuction", auction);
                },

                updateActiveAuctions: async ({ commit }) => {
                    const activeAuctions = await auctionsApi.listAuctions();
                    if (activeAuctions) {
                        commit("updateAuctions", activeAuctions);
                    }
                },

                updateClosedAuctions: async ({ commit }) => {
                    const closedAuctions = await auctionsApi.listClosedAuctions();
                    if (closedAuctions) {
                        commit("updateAuctions", closedAuctions);
                    }
                },
                
                updateAuctionsFromViewer: async ({ commit, state }, auctionsViewer) => {
                    let viewer;
                    
                    if(auctionsViewer != undefined) {
                        viewer = auctionsViewer;
                    } else {
                        viewer = state.auctionsViewer;
                    }
                    
                    if(viewer?.viewingKey) {
                        const userAuctions = await auctionsApi.listUserAuctions(viewer.userAddress, viewer.viewingKey);
                        // First we load the new auction information
                        if (userAuctions.sellerAuctions) {
                            commit("updateAuctions", userAuctions.sellerAuctions);
                        }
                        if (userAuctions.bidderAuctions) {
                            commit("updateAuctions", userAuctions.bidderAuctions);
                        }
                        if (userAuctions.wasSellerAuctions) {
                            commit("updateAuctions", userAuctions.wasSellerAuctions);
                        }
                        if (userAuctions.wonAuctions) {
                            commit("updateAuctions", userAuctions.wonAuctions);
                        }
                        // Then we commit the auctions viewer so the viewer and auction tags "isSeller", and "isBidder" are updated
                        // always at once
                        commit("updateAuctionsViewer", { 
                            auctionsViewer: viewer, 
                            sellerAuctions: userAuctions.sellerAuctions, 
                            bidderAuctions: userAuctions.bidderAuctions,
                            wasSellerAuctions: userAuctions.wasSellerAuctions,
                            wonAuctions: userAuctions.wonAuctions,
                        });

                        return userAuctions;
                    }
                },

                // If the server was the one doing the filtering and sorting the API call
                // would be made here and results stored in the state (through a mutation of course)
                updateAuctionsFilter: async({ commit }, auctionsFilter) => {
                    commit("updateAuctionsFilter", auctionsFilter)
                },

                // This method uses vuex mutation atomicity in three steps (first two related) so the state is always consistent no matter what
                updateAuctionsViewer: async({ commit, dispatch }, auctionsViewer) => {
                    if(auctionsViewer.viewingKey) {
                        await dispatch("updateAuctionsFromViewer", auctionsViewer);
                    } else {
                        commit("clearAuctionsViewer");
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

        Vue.prototype.$auctions.updateAuctions = async () => {
            Vue.prototype.$store.dispatch('$auctions/updateActiveAuctions');
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsFromViewer');
            Vue.prototype.$store.dispatch('$auctions/updateClosedAuctions');
        };

        Vue.prototype.$auctions.updateAuction = async (address) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuction', address);
        };

        Vue.prototype.$auctions.updateAuctionBidDetails = async (address, userAddress, viewingKey) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionBidDetails', {address, userAddress, viewingKey});
        };

        Vue.prototype.$auctions.updateAuctionsFilter = async (auctionsFilter) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsFilter', auctionsFilter);
        };

        Vue.prototype.$auctions.updateAuctionsViewer = async (auctionsViewer) => {
            Vue.prototype.$store.dispatch('$auctions/updateAuctionsViewer', auctionsViewer);
        };
    }
}
