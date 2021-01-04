<template>
  <page>
      <columns>
      <h1>Secret Auction</h1>
      <block>
        {{ address }}
      </block>
      <block v-if="auctionInfo">
        <div>Amount: {{auctionInfo.auction_info.sell_amount / Math.pow(10, auctionInfo.auction_info.sell_token.token_info.decimals)}}</div>
        <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.symbol }}</div>
        <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.symbol }}</div>
        <div>Min Bid: {{ auctionInfo.auction_info.minimum_bid / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}}</div>
        <div>Description: {{ auctionInfo.auction_info.description }}</div>
        <div>Status: {{ auctionInfo.auction_info.status }}</div>
      </block>
      </columns>
  </page>
</template>

<script>
export default {
  data() {
    return {
      address: "",
      auctionInfo: null,
      codeHash: ""
    };
  },
  async created() {
    this.address = this.$route.params.address;
    this.auctionInfo = await this.$scrtjs.queryContract(this.address, {"auction_info":{}})
    this.codeHash = await this.$scrtjs.getContractHash(this.address);
    console.log(this.codeHash);
    console.log(this.auctionInfo);
  },
};
</script>

<style></style>
