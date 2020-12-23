import keplr from '../lib/keplr';

export default {
    install(Vue, options) {
        keplr.init(options.chainId);
        Vue.prototype.$keplr = keplr;

        Vue.filter('bech32', (address) => {
            const value = address.bech32Address;
            return value.substring(0, 10) + '...' + value.substring(value.length - 4, value.length);
      })
    }
 }