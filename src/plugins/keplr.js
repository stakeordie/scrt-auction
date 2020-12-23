import keplr from '../lib/keplr';

export default {
    install(Vue, options) {
        Vue.prototype.$keplr = {
            login() {
                keplr.auth.login();
            },
        }
    }
 }