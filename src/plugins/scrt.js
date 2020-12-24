import { SecretJsClient } from '../lib/secretjs-client.js'

export default {
    install(Vue, options) {
        Vue.prototype.$scrtjs =  new SecretJsClient(options.restUrl);
    }

}