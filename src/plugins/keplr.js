import Keplr from '../lib/keplr';

export default {
    install(Vue, options) {
        Object.defineProperty(Vue.prototype, '$keplr', {
            value: new Keplr(options.chainId, options.chainName, options.restUrl, options.rpcUrl, 
                // On load
                () => {
                    options.onLoad();
                },
                // On address update
                (newAddress) => {
                    console.log("Setting new address:", newAddress);
                }),
        });

        Vue.filter('shortAddress', (address) => {
            return address.substring(0, 13) + '...' + address.substring(address.length - 6, address.length);
      })
    }
 }