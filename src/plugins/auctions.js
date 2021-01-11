import { AuctionsApi } from '../lib/auctions-api.js'

export default {
    install(Vue, options) {
        Vue.prototype.$auctions =  new AuctionsApi(options.chainClient, options.factoryAddress);
    }
}