<template>
    <page>
        <columns>
        <h1>Secret Auction</h1>
        <block>
            <div>
                Viewing Key = {{ viewingKey }}.
            </div>
            <button @click="createAuction()">Click Me</button>
        </block>
        </columns>
    </page>
</template>

<script>
export default {
    data() {
        return {
            viewingKey: ""
        }
    },
    async mounted() {
        this.viewingKey = await this.$auctions.getViewingKey();
        console.log(this.viewingKey);
    },
    methods: {
        async createAuction() {
            const sellTokenAddress = "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga";
            const bidTokenAddress = "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy";
            const sellAmount = "10";
            const minBidAmount = "10";
            const description = "This is a test description";
            //secretcli tx compute execute --label *factory_contract_label* '{"create_auction":{"label":"*your_auction_name*","sell_contract":{"code_hash":"*sale_tokens_code_hash*","address":"*sale_tokens_contract_address*"},"bid_contract":{"code_hash":"*bid_tokens_code_hash*","address":"*bid_tokens_contract_address*"},"sell_amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*","minimum_bid":"*minimum_accepted_bid_in_smallest_denomination_of_bid_token*","description":"*optional_text_description*"}}' --from *your_key_alias_or_addr* --gas 400000 -y
            const auction = await this.$auctions.createAuction("AuctionCreate Test 20",
                sellTokenAddress,
                bidTokenAddress,
                sellAmount,
                minBidAmount,
                description
            );
            if(auction) {
                const auctionAddress = auction.logs[0].events[1].attributes[5].value;
                console.log(auctionAddress);
                let auctionConsignment = await this.$auctions.consignToAuction(sellTokenAddress, auctionAddress, sellAmount);
                console.log(auctionConsignment);
                //secretcli tx compute execute *sale_tokens_contract_address* '{"send": {"recipient": "*auction_contract_address*", "amount": "*amount_being_sold_in_smallest_denomination_of_sell_token*"}}' --from *your_key_alias_or_addr* --gas 500000 -y
            }
        }
    }
}
</script>

<style>

</style>