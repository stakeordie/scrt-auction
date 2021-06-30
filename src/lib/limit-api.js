import statePersist from '../plugins/state-persist.js';

//any function definitions

export class LimitApi {
    scrtClient
    factoryAddress
    ammContractAddress

    constructor(scrtClient, factoryAddress) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
        this.ammContractAddress = "secret1ypfxpp4ev2sd9vj9ygmsmfxul25xt9cfadrxxy"
    }

    getFees(txName) {
        let feesObj = {};
        let gas = "1000000";
        let type = "exec";
        let amount = "0";
        let denom = "uscrt";
        switch(txName) {
            case "createBid": 
                gas = "400000";
                break;
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

    async getLimitOrders(orderBookAddress, userAddress, viewingKey) {

        if(viewingKey) {    
        //Get User OrderBooks
        //secretcli q compute query $order_factory_contract_address '{"user_secret_order_books": {"address":"'$my_address'", "viewing_key":"'$order_vk'"}}'
            const msg = {
                "get_active_limit_order": {
                    "user_address": userAddress, 
                    "user_viewkey": viewingKey
                }
            }
            const response = await this.scrtClient.queryContract(orderBookAddress, msg);
            console.log(response);
            return response;
        } else {
            return "No Viewing Key";
        }
        // return response;
    }

    async simulateSwap(ammPair, baseTokenAmountUBase) {
        //console.log(ammPair, baseTokenAmountUBase)
        // secretcli q compute query secret148jpzfh6lvencwtxa6czsk8mxm7kuecncz0g0y '{"simulation": {"offer_asset": { "info": { "token": { "contract_addr": "secret1s7c6xp9wltthk5r6mmavql4xld5me3g37guhsx", "token_code_hash": "CD400FB73F5C99EDBC6AAB22C2593332B8C9F2EA806BF9B42E3A523F3AD06F62", "viewing_key": ""}}, "amount": "50000000000"}}}'
        const offerAsset = this.getOfferAsset(ammPair, baseTokenAmountUBase);
        const msg = {
            "simulation": {
                "offer_asset": offerAsset
            }
        };
        const response = await this.scrtClient.queryContract(ammPair.address, msg);
        return this.scrtClient.uFractionalToUBase(response.return_amount,ammPair.tokens[1].decimals);
    }

    async simulateSwapReverse(ammPair, quoteTokenAmountUBase) {
        //console.log(ammPair, baseTokenAmountUBase)
        // secretcli q compute query secret148jpzfh6lvencwtxa6czsk8mxm7kuecncz0g0y '{"simulation": {"offer_asset": { "info": { "token": { "contract_addr": "secret1s7c6xp9wltthk5r6mmavql4xld5me3g37guhsx", "token_code_hash": "CD400FB73F5C99EDBC6AAB22C2593332B8C9F2EA806BF9B42E3A523F3AD06F62", "viewing_key": ""}}, "amount": "50000000000"}}}'
        const offerAsset = this.getOfferAsset(ammPair, quoteTokenAmountUBase, true);
        const msg = {
            "simulation": {
                "offer_asset": offerAsset
            }
        };
        const response = await this.scrtClient.queryContract(ammPair.address, msg);
        return this.scrtClient.uFractionalToUBase(response.return_amount,ammPair.tokens[0].decimals);
    }

    getOfferAsset(ammPair, baseTokenAmountUBase, isReverse = false) {
        if(isReverse) {
            return {
                "info": {
                    "token": {
                        "contract_addr": ammPair.tokens[1].address,
                        "token_code_hash": ammPair.tokens[1].tokenCodeHash,
                        "viewing_key": ""
                    }
                },
                "amount": this.scrtClient.uBaseToUFractional(baseTokenAmountUBase, ammPair.tokens[1].decimals).toString()
            }
        } else {
            return {
                "info": {
                    "token": {
                        "contract_addr": ammPair.tokens[0].address,
                        "token_code_hash": ammPair.tokens[0].tokenCodeHash,
                        "viewing_key": ""
                    }
                },
                "amount": this.scrtClient.uBaseToUFractional(baseTokenAmountUBase, ammPair.tokens[0].decimals).toString()
            }
        }
    }

    async createBid(orderBook, priceUBase, amountUBase) {
        // msg=$(base64 -w 0 <<<'{"create_limit_order": {"is_bid": true, "price": "5000000000000000000", "expected_amount": "200000"}}')
        // secretcli tx compute execute $token2_address '{"send":{"recipient": "'$orderbook_address'", "amount": "1000000000000000000", "msg": "'"$msg"'"}}' --from a -y --gas 1500000 -b block
        const fees = this.getFees("createBid");
        const bidValues = this.getBidValues(orderBook, priceUBase, amountUBase);
        const bidMsg = {
            "create_limit_order": {
                "is_bid": false, 
                "price": bidValues.priceUFractional.toString(), 
                "expected_amount": bidValues.amountUFractional.toString()
            }
        };
        const b64BidMsg = btoa(JSON.stringify(bidMsg));
        const msg =  {
            "send": {
                "recipient": orderBook.address,
                "amount": bidValues.costUFractional.toString(),
                "msg": b64BidMsg,
                "padding": "*".repeat((40 - bidValues.costUFractional.toString().length))
            }
        }
        const response = await this.scrtClient.executeContract(bidValues.baseToken.address, msg, fees);
        console.log("api/createBidresponse",response);
        return response;
    }

    getBidValues(orderBook, priceUBase, amountUBase) {
        const costUBase = priceUBase * amountUBase;
        return {
            baseToken: orderBook.tokens[0],
            quoteToken: orderBook.tokens[1],
            priceUFractional: this.scrtClient.uBaseToUFractional(priceUBase,orderBook.tokens[0].decimals),
            amountUFractional: this.scrtClient.uBaseToUFractional(amountUBase,orderBook.tokens[1].decimals),
            costUFractional: this.scrtClient.uBaseToUFractional(costUBase,orderBook.tokens[0].decimals),
        }
    }

    async getOrderBooks(tokenData) {
        //secretcli q compute query $order_factory_contract_address '{"secret_order_books":{}}'
        const orderBooks = await this.scrtClient.queryContract(this.factoryAddress, {"secret_order_books":{}});
        return orderBooks.secret_order_books.secret_order_books.map(orderBook => {
              return this.transformOrderBook(orderBook, tokenData);
        });
    }

    transformOrderBook(rawOrderBook, tokenData) {
        let tokens = [];
        for(let i=0; i < rawOrderBook.asset_infos.length; i++) {
            if(rawOrderBook.asset_infos[i]?.token?.contract_addr) {
                tokens[i] = tokenData.find(token => token.address == rawOrderBook.asset_infos[i].token.contract_addr);
                if(tokens[i]) {
                    tokens[i].type = "snip20";
                    tokens[i].tokenCodeHash = rawOrderBook.asset_infos[i].token.token_code_hash;
                    //tokens[0].volume = rawOrderBook.asset0_volume
                } else {
                    tokens[i] = {
                        type: "snip20",
                        address: rawOrderBook.asset_infos[i].token.contract_addr,
                        tokenCodeHash: rawOrderBook.asset_infos[i].token.token_code_hash
                        //volume: rawAmmPair.asset0_volume,
                    }
                }
                
            } else {
                tokens[i] = {
                    type: "native",
                } 
            }
        }
        const orderBook = {
            name: tokens[0].symbol + "/" + tokens[1].symbol,
            address: rawOrderBook.contract_addr,
            ammPairAddress: rawOrderBook.amm_pair_contract_addr,
            tokens
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
            let tokens = [];
            for(let i=0; i < rawAmmPair.asset_infos.length; i++) {
                if(rawAmmPair.asset_infos[i]?.token?.contract_addr) {
                    tokens[i] = tokenData.find(token => token.address == rawAmmPair.asset_infos[i].token.contract_addr);
                    if(tokens[i]) {
                        tokens[i].type = "snip20";
                        tokens[i].tokenCodeHash = rawAmmPair.asset_infos[i].token.token_code_hash;
                        tokens[i].volume = rawAmmPair.asset0_volume
                    } else {
                        tokens[i] = {
                            type: "snip20",
                            address: rawAmmPair.asset_infos[i].token.contract_addr,
                            tokenCodeHash: rawAmmPair.asset_infos[i].token.token_code_hash,
                            volume: rawAmmPair.asset0_volume,
                        }
                    }
                    
                } else {
                    tokens[i] = {
                        type: "native",
                    } 
                }  
            }
            const ammPair = {
                name: tokens[0].symbol + "/" + tokens[1].symbol,
                address: rawAmmPair.contract_addr,
                liquidityTokenAddress: rawAmmPair.liquidityTokenAddress,
                factoryAddress: rawAmmPair.factory.address,
                tokens
            }
            return ammPair;
    }
}