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

    async getUserAddress() {
        // get user address
        const chainId = await this.scrtClient.getChainId()
        const offlineSigner = await window.getOfflineSigner(chainId);
        const address = (await offlineSigner.getAccounts())[0].address;
        return address;
    }

    // secretcli q compute query *factory_contract_address* '{"list_active_auctions":{}}'
    async listAuctions(auctionState) {
        if(auctionState == "active") {
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_active_auctions":{}})).list_active_auctions.active;
        } else if(auctionState == "closed") {
            return (await this.scrtClient.queryContract(this.factoryAddress, {"list_closed_auctions":{}})).list_closed_auctions.closed;
        }
    }
    
    // BELOW HERE ADDED BY SANDY
    // secretcli q compute query *factory_contract_address* '{"list_my_auctions":{"address":"*address_whose_auctions_to_list*","viewing_key":"*viewing_key*","filter":"*optional choice of active, closed, or all"}}'
    async listUserAuctions() {
        const address =  await this.getUserAddress();
        const viewingKey = await this.getViewingKey(address, this.factoryAddress);
        if(viewingKey) {
            return await this.scrtClient.queryContract(this.factoryAddress, { "list_my_auctions": { "address": address, "viewing_key": viewingKey, "filter": "all"}});
        } else {
            console.log("No viewingKey Record found")
        }
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

    async getWallet() {
        let wallet = localStorage.getItem('sodWallet');
        if(wallet == null) {
            return [];
        } else {
            return JSON.parse(wallet);
        }
    }

    async getViewingKeyWallet(address) {
        let viewingKeyStore = this.getViewingKeyStore();
        let result = viewingKeyStore.find( viewingKeyWallet => viewingKeyWallet.address === address );
        if(result) {
            return result;
        } else {
            viewingKeyStore.push({ address, viewingKeys: {}});
            this.saveViewingKeyStore(viewingKeyStore);
            return { address, viewingKeys: {}};
        }
    }

    async getViewingKeys(address) {
        let rawViewingKeys = localStorage.getItem('viewingKeys');
        if(rawViewingKeys !== null) {
            return JSON.parse(rawViewingKeys);
        } else {
            rawViewingKeys = [];
            return rawViewingKeys
        }
    }

    async getViewingKey(address, contractAddress) {
        const wallet = await this.getWallet();
        if (wallet === undefined || wallet.length == 0) {
            return undefined;
        }
        let walletEntryIndex = await wallet.findIndex(entry => entry.address === address);
        if(walletEntryIndex > -1) {
            let walletEntryKey = await wallet[walletEntryIndex].keys.find(key => key.contractAddress === contractAddress);
            if(walletEntryKey) {
                return walletEntryKey.viewingKey;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    async createViewingKey() {
        const msg = {
            "create_viewing_key":{
                "entropy": "A Random String for Entropy",
                "padding": "*".repeat((40 - "A Random String for Entropy".length))
            }
        }
        const response = await this.scrtClient.executeContract(this.factoryAddress, msg);
        const parsedResponse = JSON.parse(new TextDecoder("utf-8").decode(response.data));
        if(parsedResponse.create_viewing_key) {
            return parsedResponse.create_viewing_key.key;
        } else {
            return parsedResponse.viewing_key.key;
        }
    }

    async addUpdateWalletKey(contractAddress, viewingKey) {
        
        const contractCodeId = (await this.scrtClient.getContract(contractAddress)).codeId;

        console.log("auctions-api/addUpdateWalletKey/contractAddress"); console.log(contractAddress);
        console.log("auctions-api/addUpdateWalletKey/viewingKey"); console.log(viewingKey);
        console.log("auctions-api/addUpdateWalletKey/contractCodeId"); console.log(contractCodeId);
        // get user address
        const address = await this.getUserAddress();
        //console.log("User Address: " +  address);

        // get viewing key store
        let wallet = await this.getWallet();
        //console.log(wallet);

        // get the index of the address object
        let walletEntryIndex = await wallet.findIndex(entry => entry.address === address);
        //console.log(walletEntryIndex);

        // if the user address has a record in the store
        if(walletEntryIndex > -1) {
            // check if this contract has a viewing key
            let walletKeyIndex = wallet[walletEntryIndex].keys.findIndex(key => key.contractAddress === contractAddress);

            // if the walletItem exists, 
            if(walletKeyIndex > -1) {
                //update viewingkey Record
                wallet[walletEntryIndex].keys[walletKeyIndex] = {
                    contractAddress,
                    contractCodeId,
                    viewingKey
                }
            } else {
                //add viewingKey Record
                wallet[walletEntryIndex].keys.push({
                    contractAddress,
                    contractCodeId,
                    viewingKey
                });
            }
        } else {
            //add address record, wallet, and viewingKey Record
            //console.log(typeof(wallet))
            wallet.push({
                address,
                keys: [
                    {
                        contractAddress,
                        contractCodeId,
                        viewingKey
                    }
                ]
            });
        }
        // save the store
        await this.saveWallet(wallet);
        //console.log(JSON.stringify(wallet));

        // Model:
        /*
            [
                {
                    address: abc
                    wallet: [
                        {
                            contractAddress: abcd
                            veiwingKey: 123
                        },
                        {
                            contractAddress: efgh
                            veiwingKey: 456
                        },
                        {
                            contractAddress: ijkl
                            veiwingKey: 789
                        }
                    ]
                },
                {
                    address: efg
                    wallet: [
                        {
                            contractAddress: abcd
                            veiwingKey: 321
                        },
                        {
                            contractAddress: efgh
                            veiwingKey: 654
                        },
                        {
                            contractAddress: ijkl
                            veiwingKey: 987
                        }
                    ]
                }
            ]
        */
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

    async saveWallet(wallet) {
        const parsed = JSON.stringify(wallet);
        localStorage.setItem('sodWallet', parsed);
    }

    async closeAuction(auctionAddress) {
        //secretcli tx compute execute *auction_contract_address* '{"finalize": {"only_if_bids": *true_or_false*}}' --from *your_key_alias_or_addr* --gas 2000000 -y
        const msg = {
            "finalize": {
                "only_if_bids": false
            }
        };
        const bidFees = {
            exec: {
                amount: [{ amount: '1000000', denom: 'uscrt' }],
                gas: '1000000',
            },
        }
        const response = await this.scrtClient.executeContract(auctionAddress, msg, bidFees);
        return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }

    async changeMinimumBid(auctionAddress, newMinimumBidAmount) {
        const msg = {
            "change_minimum_bid": {
                "minimum_bid": newMinimumBidAmount.toString()
            }
        }
        const bidFees = {
            exec: {
                amount: [{ amount: '400000', denom: 'uscrt' }],
                gas: '400000',
            },
        }
        console.log("auctions-api/changeMinimumBid/msg"); console.log(msg);
        const response = await this.scrtClient.executeContract(auctionAddress, msg, bidFees);
        console.log("auctions-api/changeMinimumBid/response"); console.log(await this.scrtClient.decryptTxHash(response.transactionHash));
        return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }

    async placeBid(bidTokenAddress, auctionAddress, bidAmount) {
        //console.log("auctions-api/placeBid/padding"); console.log("*".repeat((40 - bidAmount.toString().length)));
        //secretcli tx compute execute *bid_tokens_contract_address* '{"send": {"recipient": "*auction_contract_address*", "amount": "*bid_amount_in_smallest_denomination_of_bidding_token*"}}' --from *your_key_alias_or_addr* --gas 500000 -y
        const msg = {
            "send": {
                "recipient": auctionAddress, 
                "amount": bidAmount.toString(),
                "padding": "*".repeat((40 - bidAmount.toString().length))
            }
        };
        const bidFees = {
            exec: {
                amount: [{ amount: '400000', denom: 'uscrt' }],
                gas: '400000',
            },
        }
        console.log("auctions-api/placeBid/msg"); console.log(msg);
        const response = await this.scrtClient.executeContract(bidTokenAddress, msg, bidFees);
        console.log("auctions-api/placeBid/response"); console.log(await this.scrtClient.decryptTxHash(response.transactionHash));
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
        try {
            //secretcli tx compute execute *sale_tokens_contract_address* '{"increase_allowance":{"spender":"secret1xr4mdrh5pr68846rehk3m2jgldfaek03dx0nsn","amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*"}}' --from *your_key_alias_or_addr* --gas 150000 -y
            const msg = {
                "increase_allowance":
                {
                    "spender": this.factoryAddress,
                    "amount": sellAmount,
                    "padding": "*".repeat((40 - sellAmount.toString().length))
                }
            }
            const response = await this.scrtClient.executeContract(sellTokenAddress, msg);
            return response;
        } catch(e) {
            throw e;
        }
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
        try {
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
    
            return await this.scrtClient.executeContract(this.factoryAddress, msg);
        } catch(e) {
            // TODO improve this
            const regex = /\"msg\":\"(.*)\"/g;
            console.log(e.message);
            throw new Error(e.message.match(regex));
        }
    }
}