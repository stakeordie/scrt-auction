import Keplr from '../lib/keplr';

export default {
    install(Vue, options) {
        Vue.prototype.$keplr = new Keplr(options.chainId);

        Vue.filter('shortAddress', (address) => {
            return address.substring(0, 13) + '...' + address.substring(address.length - 6, address.length);
      })
    }
 }