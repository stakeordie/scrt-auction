import { AuctionsApi } from '../lib/auctions-api.js'

export default {
    install(Vue, options) {
        Vue.prototype.$auctions =  new AuctionsApi(Vue.prototype.$scrtjs, options.factoryAddress);
    }

}