import { AuctionsApi } from '../lib/auctions-api.js'

import Vuex from 'vuex';


export default {
    install(Vue, options) {
        const auctionsApi = new AuctionsApi(options.chainClient, options.factoryAddress);

        Vue.use(Vuex);
        Vue.prototype.$store.registerModule('$auctions', {
              namespaced: true,
              state: {
              },
              mutations: {
                example: (state, { params }) => {
                },
              },
              actions: {
                example: ({ commit }, params) => {
                  commit("example", params);
                },
              }
            });

            Vue.prototype.$auctions = {
                async getUserAddress() {
                    return await auctionsApi.getUserAddress();
                },
                async listUserAuctions() {
                    return await auctionsApi.listUserAuctions();
                },
                async listAllTokens() {
                    return await auctionsApi.listAllTokens();
                },
                async getAuctionInfo() {
                    return await auctionsApi.getAuctionInfo();
                },
                async getAuctionBidInfo() {
                    return await auctionsApi.getAuctionBidInfo();
                },
                async getWallet() {
                    return await auctionsApi.getWallet();
                },
                async getViewingKeyWallet() {
                    return await auctionsApi.getViewingKeyWallet();
                },
                async getViewingKey() {
                    return await auctionsApi.getViewingKey();
                },
                async getViewingKey() {
                    return await auctionsApi.getViewingKey();
                },
                async getViewingKeys() {
                    return await auctionsApi.getViewingKeys();
                },
                async createViewingKey() {
                    return await auctionsApi.createViewingKey();
                },
                async addUpdateWalletKey() {
                    return await auctionsApi.addUpdateWalletKey();
                },
                async addViewingKey() {
                    return await auctionsApi.addViewingKey();
                },
                async removeViewingKey() {
                    return await auctionsApi.removeViewingKey();
                },
                async saveViewingKeys() {
                    return await auctionsApi.saveViewingKeys();
                },
                async saveWallet() {
                    return await auctionsApi.saveWallet();
                },
                async closeAuction() {
                    return await auctionsApi.closeAuction();
                },
                async placeBid() {
                    return await auctionsApi.placeBid();
                },
                async retractBid() {
                    return await auctionsApi.retractBid();
                },
                async consignAllowance() {
                    return await auctionsApi.consignAllowance();
                },
                async createAuction() {
                    return await auctionsApi.createAuction();
                },
                
                async listAuctions(status) {
                    return await auctionsApi.listAuctions(status);
                }
            };

            Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);
        }
    }