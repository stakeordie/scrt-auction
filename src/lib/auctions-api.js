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

    // EVERYTHING IS IN THIS METHOD
    // TODO Review this
    async createAuction(
        label,
        sellTokenAddress,
        bidTokenAddress,
        amount,
        minBid,
        description
    ) {
        const sellTokenHash = await this.scrtClient.getContractHash(sellTokenAddress);
        const bidTokenHash = await this.scrtClient.getContractHash(bidTokenAddress);
        const handleMsg = {
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
                "description": description
            }
        };

        return await this.scrtClient.executeContract(this.factoryAddress, handleMsg);
    }
}