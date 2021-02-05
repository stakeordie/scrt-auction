export class AuctionsApi {
    factoryAddress;
    scrtClient;

    constructor(scrtClient, factoryAddress) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
    }

    getFees(txName) {
        let feesObj = {};
        let gas = "1000000";
        let type = "exec";
        let amount = "0";
        let denom = "uscrt";
        switch(txName) {
            case "allowance": 
                gas = "150000";
                break;
            case "createAuction":
                gas = "700000";
                break;
            case "changeAskingPrice":
                gas = "190000";
                break;
            case "createViewingKey":
                gas = "120000";
                break;
            case "placeBid":
                gas = "400000";
                break;
            case "retractBid":
                gas = "330000";
                break;
            case "closeAuction":
                gas = "2000000";
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

    /*
        Factory Methods:
        `create_auction`,
        `register_auction`,
        `close_auction`, 
        `register_bidder`, 
        `remove_bidder`, 
        `new_auction_contract`, 
        `create_viewing_key`, 
        `set_viewing_key`,
        `set_status`
    */

    async getUserAddress() {
        // get user address
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        return address;
    }

    async listAuctions(auctionState) {
        // secretcli q compute query *factory_contract_address* '{"list_active_auctions":{}}'
        if(auctionState == "active") {
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}})).list_active_auctions.active;
        } else if(auctionState == "closed") {
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_closed_auctions":{}})).list_closed_auctions.closed;
        }
    }
    
    async listUserAuctions(address, viewingKey) {
         // secretcli q compute query *factory_contract_address* '{"list_my_auctions":{"address":"*address_whose_auctions_to_list*","viewing_key":"*viewing_key*","filter":"*optional choice of active, closed, or all"}}'
        if(viewingKey) {
            return await this.scrtClient.queryContract(this.factoryAddress, { "list_my_auctions": { "address": address, "viewing_key": viewingKey, "filter": "all"}});
        }
    }

    async getAuctionInfo(auctionAddress) {
        return await this.scrtClient.queryContract(auctionAddress, {"auction_info":{}});
    }

    async getAuctionBidInfo(address, auctionAddress, viewingKey) {
        //secretcli q compute query *auction_contract_address* '{"view_bid": {"address":"*address_whose_bid_to_list*","viewing_key":"*viewing_key*"}}'
        return await this.scrtClient.queryContract(auctionAddress, { "view_bid": { "address": address,"viewing_key": viewingKey }});
    }

    async getAuctionHasBids(address, auctionAddress, viewingKey) {
        //secretcli q compute query *auction_contract_address* '{"has_bids": {"address":"*sellers_address*","viewing_key":"*viewing_key*"}}'
        return await this.scrtClient.queryContract(auctionAddress, { "has_bids": { "address": address,"viewing_key": viewingKey }});
    }
    
    async createViewingKey() {
        const fees = this.getFees("createViewingKey");
        const msg = {
            "create_viewing_key":{
                "entropy": "A Random String for Entropy",
                "padding": "*".repeat((40 - "A Random String for Entropy".length))
            }
        }
        const response = await this.scrtClient.executeContract(this.factoryAddress, msg, fees);
        if(response.create_viewing_key) {
            return response.create_viewing_key.key;
        } else {
            return response.viewing_key.key;
        }
    }

    async closeAuction(auctionAddress) {
        //secretcli tx compute execute *auction_contract_address* '{"finalize": {"only_if_bids": *true_or_false*}}' --from *your_key_alias_or_addr* --gas 2000000 -y
        const fees = this.getFees("closeAuction");
        const msg = {
            "finalize": {
                "only_if_bids": false
            }
        };
        const response = await this.scrtClient.executeContract(auctionAddress, msg, fees);
        return response;
    }

    async closeAuctionWithOptions(auctionAddress, endDateTime, newMinBid) {
        //secretcli tx compute execute *auction_contract_address* '{"finalize": {"only_if_bids": *true_or_false*}}' --from *your_key_alias_or_addr* --gas 2000000 -y
        const fees = this.getFees("closeAuction");
        const msg = {
            "finalize": {
                "new_ends_at": endDateTime,
                "new_minimum_bid": newMinBid.toString()
            }
        };
        const response = await this.scrtClient.executeContract(auctionAddress, msg, fees);
        return response;
    }

    async changeMinimumBid(auctionAddress, newMinimumBidAmount) {
        const fees = this.getFees("changeAskingPrice");
        const msg = {
            "change_minimum_bid": {
                "minimum_bid": newMinimumBidAmount.toString()
            }
        }
        const response = await this.scrtClient.executeContract(auctionAddress, msg, fees);
        return response;
    }

    async placeBid(bidTokenAddress, auctionAddress, bidAmount) {
        const fees = this.getFees("placeBid");
        //secretcli tx compute execute *bid_tokens_contract_address* '{"send": {"recipient": "*auction_contract_address*", "amount": "*bid_amount_in_smallest_denomination_of_bidding_token*"}}' --from *your_key_alias_or_addr* --gas 500000 -y
        const msg = {
            "send": {
                "recipient": auctionAddress, 
                "amount": bidAmount.toString(),
                "padding": "*".repeat((40 - bidAmount.toString().length))
            }
        };
        return await this.scrtClient.executeContract(bidTokenAddress, msg, fees);
    }

    async retractBid(auctionAddress) {
        //secretcli tx compute execute *auction_contract_address* '{"retract_bid": {}}' --from *your_key_alias_or_addr* --gas 300000 -y
        const fees = this.getFees("retractBid");
        const response = await this.scrtClient.executeContract(auctionAddress, {"retract_bid": {}}, fees);
        return response;
    }

    async consignAllowance(sellTokenAddress, sellAmount) {
        //secretcli tx compute execute *sale_tokens_contract_address* '{"increase_allowance":{"spender":"secret1xr4mdrh5pr68846rehk3m2jgldfaek03dx0nsn","amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*"}}' --from *your_key_alias_or_addr* --gas 150000 -y
        const fees = this.getFees("allowance");
        const expiration = new Date((new Date()).getTime() + (Number(1) * Number(10) * 60000));
        const msg = {
            "increase_allowance":
            {
                "spender": this.factoryAddress,
                "amount": sellAmount,
                "padding": "*".repeat((40 - sellAmount.toString().length)),
                "expiration": Math.round(expiration.getTime() / 1000)
            }
        }
        return await this.scrtClient.executeContract(sellTokenAddress, msg, fees);
    }

    async changeEndTime(auctionAddress, newEndTime) {
        return true;
    }

    async createAuction(
        label,
        sellTokenAddress,
        bidTokenAddress,
        amount,
        minBid,
        description,
        endDateTime
    ) {
            const fees = this.getFees("createAuction");
            const sellTokenHash = await this.scrtClient.getContractHash(sellTokenAddress);
            const bidTokenHash = await this.scrtClient.getContractHash(bidTokenAddress);
            const msg = {
                "create_auction": {
                    "label": label,
                    "sell_contract": {
                        "code_hash": sellTokenHash,
                        "address": sellTokenAddress
                    },
                    "bid_contract": {
                        "code_hash": bidTokenHash,
                        "address": bidTokenAddress
                    },
                    "sell_amount": amount,
                    "minimum_bid": minBid,
                    "description": description,
                    "ends_at": endDateTime
                }
            };
            //console.log("msg in auction-api/createAuction", msg)
            return await this.scrtClient.executeContract(this.factoryAddress, msg, fees);
    }
}