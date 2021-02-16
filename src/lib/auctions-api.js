import emojis from '../lib/emojis.js'

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

    tokens2Decimal(amount, decimals)  {
        return Number(amount / Math.pow(10, decimals));
    }

    arrayHash(str, array)  {
        var hash = 0, i, chr;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return array[Math.abs(hash) % array.length];
    }

    transformActiveAuction(rawction, status) {
        const colors = ["purple", "orange", "cream", "blue", "yellow", "green"];
        const auction = {
            address: rawction.address,
            label: rawction.label,
            pair: rawction.pair,
            emoji: this.arrayHash(rawction.label, emojis),
            color: this.arrayHash(rawction.pair, colors),
            color2: this.arrayHash(rawction.address, colors),
            description: null,    // MIA
            sell: {
                amount: rawction.sell_amount,
                decimalAmount: this.tokens2Decimal(rawction.sell_amount, rawction.sell_decimals),
                decimals: rawction.sell_decimals,
                denom: rawction.pair.split("-")[0],
                contract: null,    // MIA
            },
            bid: {
                decimals: rawction.bid_decimals,
                denom: rawction.pair.split("-")[1],
                contract: null,    // MIA
            },
            endsAt: new Date((rawction.ends_at || rawction.timestamp) * 1000),
        };

        auction.bid.minimum = rawction.minimum_bid;
        auction.bid.decimalMinimum = this.tokens2Decimal(rawction.minimum_bid || 0, rawction.bid_decimals || 0);
        auction.price = (auction.bid.decimalMinimum / auction.sell.decimalAmount) || 0;

        auction.status = "ACTIVE";

        return auction;
    }

    // {
    //     "address":"secret1zqcjemap88q4mkryglpl8rxr3xmey6yytkacxd",
    //     "label":"auction-2898281",
    //     "pair":"TSUNI-TSUSDT",
    //     "sell_amount":"1000000000000000000",
    //     "sell_decimals":18,
    //     "timestamp":1612626275
    // }
    transformClosedAuction(rawction) {
        const auction = {
            address: rawction.address,
            pair: rawction.pair,
            label: rawction.label,
            emoji: this.arrayHash(rawction.label, emojis),
            color: "red",
            color2: "red",
            sell: {
                amount: rawction.sell_amount,
                decimalAmount: this.tokens2Decimal(rawction.sell_amount, rawction.sell_decimals),
                decimals: rawction.sell_decimals,
                denom: rawction.pair.split("-")[0],
                contract: null,    // MIA
            },
            closedAt: new Date(rawction.timestamp * 1000),
            status: "CLOSED",
        }
        if(rawction.winning_bid) {
            auction.bid = {
                winner: rawction.winning_bid,
                decimalWinner: this.tokens2Decimal(rawction.winning_bid, rawction.bid_decimals),
                decimals: rawction.bid_decimals,
                denom: rawction.pair.split("-")[1],
                contract: null,    // MIA
            }
        } else {
            auction.bid = {
                decimals: rawction.bid_decimals,
                denom: rawction.pair.split("-")[1],
                contract: null,    // MIA
            }
        }

        return auction;
    }

    // address: "secret1c23rzyy8kdx936e854fchjze95fkxdwd8mcsyz"
    // bid_decimals: 6
    // label: "auction-497183"
    // pair: "TSDAI-TSUSDT"
    // sell_amount: "100000000000000000"
    // sell_decimals: 18
    // timestamp: 1613100794
    // winning_bid: "10000"
    transformWonAuction(rawction) {
        const auction = {
            address: rawction.address,
            pair: rawction.pair,
            label: rawction.label,
            emoji: this.arrayHash(rawction.label, emojis),
            color: "red",
            color2: "red",
            sell: {
                amount: rawction.sell_amount,
                decimalAmount: this.tokens2Decimal(rawction.sell_amount, rawction.sell_decimals),
                decimals: rawction.sell_decimals,
                denom: rawction.pair.split("-")[0],
                contract: null,    // MIA
            },
            bid: {
                winner: rawction.winning_bid,
                decimalWinner: this.tokens2Decimal(rawction.winning_bid, rawction.bid_decimals),
                decimals: rawction.bid_decimals,
                denom: rawction.pair.split("-")[1],
                contract: null,    // MIA
            },
            closedAt: new Date(rawction.timestamp * 1000),
            status: "CLOSED",
        }

        return auction;
    }

    // address: "secret1c23rzyy8kdx936e854fchjze95fkxdwd8mcsyz"
    // label: "auction-497183"
    // pair: "TSDAI-TSUSDT"
    // sell_amount: "100000000000000000"
    // sell_decimals: 18
    // timestamp: 1613100794
    //
    // winning_bid: "10000"
    // bid_decimals: 6

    transformAuctionInfo(rawction) {
        const auction = {
            address: rawction.auction_info.auction_address,
            label: null,    // MIA
            pair: null,     // MIA
            emoji: 0x1F41D,     // MIA
            color: "purple",    // MIA
            color2: "purple",   // MIA
            description: rawction.auction_info.description,  // NEW
            sell: {
                amount: rawction.auction_info.sell_amount,
                decimalAmount: this.tokens2Decimal(rawction.auction_info.sell_amount, rawction.auction_info.sell_token.token_info.decimals),
                decimals: rawction.auction_info.sell_token.token_info.decimals,
                denom: rawction.auction_info.sell_token.token_info.symbol,
                contract: rawction.auction_info.sell_token.contract_address,  // NEW
            },
            bid: {
                decimals: rawction.auction_info.bid_token.token_info.decimals,
                denom: rawction.auction_info.bid_token.token_info.symbol,
                contract: rawction.auction_info.bid_token.contract_address,  // NEW
            },
            endsAt: new Date(rawction.auction_info.ends_at),
        };

        if(rawction.auction_info.minimum_bid) {
            auction.bid.minimum = rawction.auction_info.minimum_bid;
            auction.bid.decimalMinimum = this.tokens2Decimal(rawction.auction_info.minimum_bid, auction.bid.decimals);
            auction.price = auction.bid.decimalMinimum / auction.sell.decimalAmount;
        }
        return auction;
    };

    async listAuctions() {
        const auctions = await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}})

        return auctions.list_active_auctions.active.map(auction => {
            return this.transformActiveAuction(auction);
        });
    }

    async listClosedAuctions() {
        const auctions = await this.scrtClient.queryContract(this.factoryAddress, {"list_closed_auctions":{}})
        return auctions.list_closed_auctions.closed.map(auction => {
            return this.transformClosedAuction(auction);
        });
    }

    async listUserAuctions(address, viewingKey) {
        // secretcli q compute query *factory_contract_address* '{"list_my_auctions":{"address":"*address_whose_auctions_to_list*","viewing_key":"*viewing_key*","filter":"*optional choice of active, closed, or all"}}'
        if (viewingKey) {
            const auctions = await this.scrtClient.queryContract(this.factoryAddress, { "list_my_auctions": { "address": address, "viewing_key": viewingKey, "filter": "all"}});

            const sellerAuctions = auctions.list_my_auctions?.active?.as_seller?.map(rawction => this.transformActiveAuction(rawction));
            const bidderAuctions = auctions.list_my_auctions?.active?.as_bidder?.map(rawction => this.transformActiveAuction(rawction));

            const wasSellerAuctions = auctions.list_my_auctions?.closed?.as_seller?.map(rawction => this.transformClosedAuction(rawction));
            const wonAuctions = auctions.list_my_auctions?.closed?.won?.map(rawction => this.transformWonAuction(rawction));

            return {
                sellerAuctions,
                bidderAuctions,
                wasSellerAuctions,
                wonAuctions,
            }
        }
    }

    //replaces getAuctionInfo
    async getAuction(auctionAddress) {
        const auction = await this.scrtClient.queryContract(auctionAddress, {"auction_info":{}});
        return this.transformAuctionInfo(auction);
    }

    //replaced by getAuction
    async getAuctionInfo(auctionAddress) {
        const auctionInfo = await this.scrtClient.queryContract(auctionAddress, {"auction_info":{}});
        //console.log("auctionInfo",auctionInfo);
        return auctionInfo;
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
        return response
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
