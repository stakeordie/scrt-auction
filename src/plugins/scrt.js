import { SecretJsClient } from '../lib/secretjs-client.js'

export default {
    install(Vue, options) {
        Object.defineProperty(Vue.prototype, "$scrtjs", { value: new SecretJsClient(options.restUrl, options.wallet) });
    }

}