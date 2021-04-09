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

    async getOrderBooks(tokenData) {
        //secretcli q compute query $order_factory_contract_address '{"secret_order_books":{}}'
        const orderBooks = await this.scrtClient.queryContract(this.factoryAddress, {"secret_order_books":{}});
        return orderBooks.secret_order_books.secret_order_books.map(orderBook => {
              return this.transformOrderBook(orderBook, tokenData);
        });
    }

    transformOrderBook(rawOrderBook, tokenData) {
        const token1 = tokenData.find(token => token.address == rawOrderBook.asset_infos[0].token.contract_addr)
        const token2 = tokenData.find(token => token.address == rawOrderBook.asset_infos[1].token.contract_addr)
        const orderBook = {
            name: token1.symbol + "/" + token2.symbol,
            address: rawOrderBook.contract_addr,
            ammPairAddress: rawOrderBook.amm_pair_contract_addr,
            asset_infos: [
                rawOrderBook.asset_infos[0],
                rawOrderBook.asset_infos[1]
            ]
        }
        return orderBook;
    }

    async getAmmPairs(tokenData) {
        //secretcli q compute query secret1ypfxpp4ev2sd9vj9ygmsmfxul25xt9cfadrxxy '{"pairs": {}}'
        const ammPairs =  await this.scrtClient.queryContract(this.ammContractAddress, {"pairs":{}});
        return ammPairs.pairs.map(ammPair => {
            return this.transformAmmPair(ammPair, tokenData);
        });
    }

    transformAmmPair(rawAmmPair, tokenData) {
        //console.log(JSON.stringify(rawAmmPair));
        // {
        //     "asset_infos":[
        //        {
        //           "token":{
        //              "contract_addr":"secret1ttg5cn3mv5n9qv8r53stt6cjx8qft8ut9d66ed",
        //              "token_code_hash":"2da545ebc441be05c9fa6338f3353f35ac02ec4b02454bc49b1a66f4b9866aed",
        //              "viewing_key":""
        //           }
        //        },
        //        {
        //           "token":{
        //              "contract_addr":"secret1ttg5cn3mv5n9qv8r53stt6cjx8qft8ut9d66ed",
        //              "token_code_hash":"2da545ebc441be05c9fa6338f3353f35ac02ec4b02454bc49b1a66f4b9866aed",
        //              "viewing_key":""
        //           }
        //        }
        //     ],
        //     "contract_addr":"secret14ur0789ffka2j0afv893ca3rnrwnqnglhh0tg3",
        //     "liquidity_token":"secret1atnf5543a5s2wuhjztd2ryp3m97phecfa5238a",
        //     "token_code_hash":"F86B5C3CA0381CE7EDFFFA534789501AE17CF6B21515213693BAF980765729C2",
        //     "asset0_volume":"0",
        //     "asset1_volume":"0",
        //     "factory":{
        //        "address":"secret1ypfxpp4ev2sd9vj9ygmsmfxul25xt9cfadrxxy",
        //        "code_hash":"b66c6aca95004916baa13f8913ff1222c3e1775aaaf60f011cfaba7296d59d2c"
        //     }
        //  }
            let tokens = [];
            if(rawAmmPair.asset_infos[0]?.token?.contract_addr) {
                tokens[0] = tokenData.find(token => token.address == rawAmmPair.asset_infos[0].token.contract_addr);
                if(tokens[0]) {
                    tokens[0].type = "snip20";
                    tokens[0].volume = rawAmmPair.asset0_volume
                } else {
                    tokens[0] = {
                        type: "snip20",
                        address: rawAmmPair.asset_infos[0].token.contract_addr,
                        volume: rawAmmPair.asset0_volume,
                    }
                }
                
            } else {
                tokens[0] = {
                    type: "native",
                } 
            }  
            if(rawAmmPair.asset_infos[1]?.token?.contract_addr) {
                tokens[1] = tokenData.find(token => token.address == rawAmmPair.asset_infos[1].token.contract_addr);
                if(tokens[1]) {
                    tokens[1].type = "snip20";
                    tokens[1].volume = rawAmmPair.asset1_volume
                } else {
                    tokens[1] = {
                        type: "snip20",
                        address: rawAmmPair.asset_infos[1].token.contract_addr,
                        volume: rawAmmPair.asset1_volume,
                    }
                }
            } else {
                tokens[1] = {
                    type: "native",
                } 
            }  
            const ammPair = {
                name: "",
                address: rawAmmPair.contract_addr,
                liquidityTokenAddress: rawAmmPair.liquidityTokenAddress,
                factoryAddress: rawAmmPair.factory.address,
                tokens
            }
            return ammPair;
    }
}