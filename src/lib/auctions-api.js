export class AuctionsApi {
    factoryAddress;
    scrtClient;

    constructor(scrtClient, factoryAddress) {
        this.scrtClient = scrtClient;
        this.factoryAddress = factoryAddress;
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

    // secretcli q compute query *factory_contract_address* '{"list_active_auctions":{}}'
    async listAuctions(auctionState) {
        if(auctionState == "active") {
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}})).list_active_auctions.active;
        } else if(auctionState == "closed") {
            console.log(await this.scrtClient.queryContract(this.factoryAddress, {"list_closed_auctions":{}}));
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_closed_auctions":{}})).list_closed_auctions.closed;
        }
    }
    // BELOW HERE ADDED BY SANDY
    // secretcli q compute query *factory_contract_address* '{"list_my_auctions":{"address":"*address_whose_auctions_to_list*","viewing_key":"*viewing_key*","filter":"*optional choice of active, closed, or all"}}'
    async listUserAuctions() {
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        const viewingKey = await this.getViewingKey();
        return await this.scrtClient.queryContract(this.factoryAddress, {"list_my_auctions":{"address":address,"viewing_key":viewingKey,"filter":"all"}});
    }
    //secretcli tx compute execute --label *factory_contract_label* '{"create_viewing_key":{"entropy":"*Some arbitrary string used as entropy in generating the random viewing key*"}}' --from *your_key_alias_or_addr* --gas 200000 -y
    async listAllTokens() {
        const snip20Tokens =  await this.scrtClient.listContracts(1);
        console.log(snip20Tokens);

        // How do I do this?
        // let snip20TokensVerbose = [];
        // snip20Tokens.forEach(function(token,index) {
        //     let tokenVerbose = this.scrtClient.queryContract(token.address, {"tokenInfo": {}});
        //     snip20TokensVerbose.push(tokenVerbose);
        // });
    }

    async getAuctionInfo(auctionAddress) {
        return await this.scrtClient.queryContract(auctionAddress, {"auction_info":{}});
    }

    async getAuctionBidInfo(auctionAddress,viewingKey) {
        //secretcli q compute query *auction_contract_address* '{"view_bid": {"address":"*address_whose_bid_to_list*","viewing_key":"*viewing_key*"}}'
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        return await this.scrtClient.queryContract(auctionAddress, { "view_bid": { "address": address,"viewing_key": viewingKey }});
    }

    async getViewingKeys() {
        let rawViewingKeys = localStorage.getItem('viewingKeys');
        if(rawViewingKeys !== null) {
            return JSON.parse(rawViewingKeys);
        } else {
            rawViewingKeys = [];
            return rawViewingKeys
        }
    }

    async getViewingKey() {
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        const viewingKeys = await this.getViewingKeys();
        if (viewingKeys === undefined || viewingKeys.length == 0) {
            return undefined;
        }
        let result = viewingKeys.find( viewingKey => viewingKey.address === address );
        if(result) {
            return result.viewingKey
        } else {
            return undefined;
        }
    }

    async createViewingKey() {
        const msg = {
            "create_viewing_key":{
                "entropy": "A Random String for Entropy"
            }
        }
        const response = await this.scrtClient.executeContract(this.factoryAddress, msg);
        return JSON.parse(new TextDecoder("utf-8").decode(response.data)).viewing_key.key;
    }

    async addViewingKey(viewingKey) {
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        const newViewingKey = {
            "address": address,
            "viewingKey": viewingKey
        }
        const currentViewingKey = await this.getViewingKey(address);
        if(currentViewingKey) {
            console.log(currentViewingKey);
            this.removeViewingKey(address)
        }
        let viewingKeys = await this.getViewingKeys();
        viewingKeys.push(newViewingKey);
        this.saveViewingKeys(viewingKeys);
    }

    async removeViewingKey() {
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        let viewingKeys = await this.getViewingKeys();
        viewingKeys.splice(viewingKeys.findIndex(item => item.address === address), 1)
        this.saveViewingKeys(viewingKeys);
    }

    async saveViewingKeys(viewingKeys) {
        const parsed = JSON.stringify(viewingKeys);
        localStorage.setItem('viewingKeys', parsed);
    }

    async closeAuction(auctionAddress) {
        //secretcli tx compute execute *auction_contract_address* '{"finalize": {"only_if_bids": *true_or_false*}}' --from *your_key_alias_or_addr* --gas 2000000 -y
        const msg = {"finalize": {"only_if_bids": false}};
        const bidFees = {
            exec: {
                amount: [{ amount: '1000000', denom: 'uscrt' }],
                gas: '1000000',
            },
        }
        const response = await this.scrtClient.executeContract(auctionAddress, msg, bidFees);
        return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }

    async placeBid(bidTokenAddress, auctionAddress, bidAmount) {
        //secretcli tx compute execute *bid_tokens_contract_address* '{"send": {"recipient": "*auction_contract_address*", "amount": "*bid_amount_in_smallest_denomination_of_bidding_token*"}}' --from *your_key_alias_or_addr* --gas 500000 -y
        const msg = {
            "send": {
                "recipient": auctionAddress, 
                "amount": bidAmount
            }
        };
        const bidFees = {
            exec: {
                amount: [{ amount: '400000', denom: 'uscrt' }],
                gas: '400000',
            },
        }
        const response = await this.scrtClient.executeContract(bidTokenAddress, msg, bidFees);
        console.log(response)
        return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }

    async retractBid(auctionAddress) {
        //secretcli tx compute execute *auction_contract_address* '{"retract_bid": {}}' --from *your_key_alias_or_addr* --gas 300000 -y
        const retractBidFees = {
            exec: {
                amount: [{ amount: '300000', denom: 'uscrt' }],
                gas: '300000',
            },
        }
        const response = await this.scrtClient.executeContract(auctionAddress, {"retract_bid": {}}, retractBidFees);
        return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }

    async consignAllowance(sellTokenAddress, sellAmount) {
        //secretcli tx compute execute *sale_tokens_contract_address* '{"increase_allowance":{"spender":"secret1xr4mdrh5pr68846rehk3m2jgldfaek03dx0nsn","amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*"}}' --from *your_key_alias_or_addr* --gas 150000 -y
        const msg = {
            "increase_allowance":
            {
                "spender": this.factoryAddress,
                "amount": sellAmount
            }
        }
        const response = await this.scrtClient.executeContract(sellTokenAddress, msg);
        return response;
    }

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
                "description": description
            }
        };

        return await this.scrtClient.executeContract(this.factoryAddress, msg);
    }
}