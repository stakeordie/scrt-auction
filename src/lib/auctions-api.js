export class AuctionsApi {
    factoryAddress;
    scrtClient;

    constructor(scrtClient, factoryAddress) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;

        console.log('auctions ready with address ' + factoryAddress);
    }

    async listActiveAuctions() {
        return await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}});
    }
}