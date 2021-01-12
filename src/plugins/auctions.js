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
                async listAuctions(status) {
                    return await auctionsApi.listAuctions(status);
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
                async addUpdateWalletKey(viewingKey) {
                    return await auctionsApi.addUpdateWalletKey(viewingKey);
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

            Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);
        }
    }