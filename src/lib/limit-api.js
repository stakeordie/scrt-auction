import statePersist from '../plugins/state-persist.js';

//any function definitions

export class LimitApi {
    scrtClient
    factoryAddress
    ammContractAddress

    constructor(scrtClient, factoryAddress /*, otherAddress*/) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
        this.ammContractAddress = "secret1ypfxpp4ev2sd9vj9ygmsmfxul25xt9cfadrxxy"
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

    async getAmmPairs() {
        //secretcli q compute query secret1ypfxpp4ev2sd9vj9ygmsmfxul25xt9cfadrxxy '{"pairs": {}}'
        return await this.scrtClient.queryContract(this.ammContractAddress, {"pairs":{}});
    }

    async getBooks() {
        //secretcli q compute query $order_factory_contract_address '{"secret_order_books":{}}'
        return await this.scrtClient.queryContract(this.factoryAddress, {"secret_order_books":{}});
    }

    async getBook(contractAddress) {

    }
    
    
}