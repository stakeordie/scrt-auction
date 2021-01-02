import Keplr from '../lib/keplr';

export default {
    install(Vue, options) {
        Vue.prototype.$keplr = new Keplr(options.chainId);

        Vue.filter('bech32', (address) => {
            const value = address.bech32Address;
            return value.substring(0, 10) + '...' + value.substring(value.length - 4, value.length);
      })
    }
 }