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
              },
              getters: {
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
              }
            });

            Vue.prototype.$auctions = {
                async updateAuctions() {
                    Vue.prototype.$store.dispatch('$auctions/updateAuctions');
                },

                async getUserAddress() {
                    return await auctionsApi.getUserAddress();
                },
                async listUserAuctions() {
                    return await auctionsApi.listUserAuctions();
                },
                async listAllTokens() {
                    return await auctionsApi.listAllTokens();
                },
                async getAuctionInfo(auctionAddress) {
                    return await auctionsApi.getAuctionInfo(auctionAddress);
                },
                async getAuctionBidInfo(auctionAddress,viewingKey) {
                    return await auctionsApi.getAuctionBidInfo(auctionAddress,viewingKey);
                },
                async getWallet() {
                    return await auctionsApi.getWallet();
                },
                async getViewingKeyWallet(address) {
                    return await auctionsApi.getViewingKeyWallet(address);
                },
                async getViewingKey(address) {
                    return await auctionsApi.getViewingKey(address);
                },
                async getViewingKey(address, contractAddress) {
                    return await auctionsApi.getViewingKey(address, contractAddress);
                },
                async getViewingKeys(contractAddress) {
                    return await auctionsApi.getViewingKeys(contractAddress);
                },
                async createViewingKey(contractAddress, viewingKey, contractCodeId) {
                    return await auctionsApi.createViewingKey(contractAddress, viewingKey, contractCodeId);
                },
                async addUpdateWalletKey(contractAddress, viewingKey, contractCodeId) {
                    return await auctionsApi.addUpdateWalletKey(contractAddress, viewingKey, contractCodeId);
                },
                async addViewingKey() {
                    return await auctionsApi.addViewingKey();
                },
                async removeViewingKey() {
                    return await auctionsApi.removeViewingKey();
                },
                async saveViewingKeys(viewingKeys) {
                    return await auctionsApi.saveViewingKeys(viewingKeys);
                },
                async saveWallet(wallet) {
                    return await auctionsApi.saveWallet(wallet);
                },
                async closeAuction(auctionAddress) {
                    return await auctionsApi.closeAuction(auctionAddress);
                },
                async placeBid(bidTokenAddress, auctionAddress, bidAmount) {
                    return await auctionsApi.placeBid(bidTokenAddress, auctionAddress, bidAmount);
                },
                async retractBid(auctionAddress) {
                    return await auctionsApi.retractBid(auctionAddress);
                },
                async consignAllowance(sellTokenAddress, sellAmount) {
                    return await auctionsApi.consignAllowance(sellTokenAddress, sellAmount);
                },
                async createAuction() {
                    return await auctionsApi.createAuction();
                },
                
            };

            //Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);
        }
    }