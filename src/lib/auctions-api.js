export class AuctionsApi {
    factoryAddress;
    scrtClient;

    constructor(scrtClient, factoryAddress) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
    }

    async listActive() {
        return (await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}})).list_active_auctions.active;
    }

    // EVERYTHING IS IN THIS METHOD
    // TODO Review this
    async createAuction(
        label,
        sellToken,
        bidToken,
        amount,
        minBid,
        description
    ) {
        const handleMsg = {
            "create_auction": {
                "label": label,
                "sell_contract": sellToken,
                "bid_contract": bidToken,
                "sell_amount": amount,
                "minimum_bid": minBid,
                "description": description
            }
        }
        return await this.scrtClient.executeContract(this.factoryAddress, handleMsg);
    }

    // {
    //     "create_auction":{
    //        "label":"*your_auction_name*",
    //        "sell_contract":{
    //           "code_hash":"*sale_tokens_code_hash*",
    //           "address":"*sale_tokens_contract_address*"
    //        },
    //        "bid_contract":{
    //           "code_hash":"*bid_tokens_code_hash*",
    //           "address":"*bid_tokens_contract_address*"
    //        },
    //        "sell_amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*",
    //        "minimum_bid":"*minimum_accepted_bid_in_smallest_denomination_of_bid_token*",
    //        "description":"*optional_text_description*"
    //     }
    //  }
 
}