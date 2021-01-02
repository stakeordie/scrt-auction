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
        sellTokenAddress,
        bidTokenAddress,
        amount,
        minBid,
        description
    ) {
        const handleMsg = {
            "create_auction": {
                "label": label,
                "sell_contract": {
                    "code_hash": await this.scrtClient.getContractHash(sellTokenAddress),
                    "address": sellTokenAddress
                },
                "bid_contract": {
                    "code_hash": await this.scrtClient.getContractHash(bidTokenAddress),
                    "address": bidTokenAddress
                },
                "sell_amount": amount,
                "minimum_bid": minBid,
                "description": description
            }
        }
        return await this.scrtClient.executeContract(this.factoryAddress, handleMsg);
    }
}