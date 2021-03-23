import statePersist from '../plugins/state-persist.js';

//any function definitions

export class LimitApi {

    factoryAddress
    scrtClient

    constructor(scrtClient, factoryAddress /*, otherAddress*/) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
    }

    // TODO: #64 Find out what fees will be and set them
    getFees(txName) {
        let feesObj = {};
        let gas = "1000000";
        let type = "exec";
        let amount = "0";
        let denom = "uscrt";
        switch(txName) {

            default:
        }
        if(amount == "0") {
            amount = gas;
        }
        
        feesObj[type] = {
            amount: [{amount, denom}],
            gas
        };

        return feesObj;
    }

    

}