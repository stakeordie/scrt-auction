import { LimitOrderbookApi } from '../lib/limit-orderbook-api.js'
import moment from 'moment'
import decimal from 'Decimal'

import Vuex from Vuex;

//setup variables

export default {
    install(Vue, options) {
        const limitOrderbookApi = new LimitOrderbookApi(options.chainClient, options.factoryAddress);
        // What contract address's do we need?
    }
}