import statePersist from '../plugins/state-persist.js';

//any function definitions

export class LimitOrderbookApi {
    
    factoryAddress
    //other addresses
    scrtClient

    constructor(scrtClient, factoryAddress /*, otherAddress*/) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
        //set other address
    }

}