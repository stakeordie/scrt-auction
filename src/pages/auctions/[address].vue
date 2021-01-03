<template>
  <page>
      <columns>
      <h1>Secret Auction</h1>
      <block>
        {{ address }}
      </block>
      <block v-if="auctionInfo">
        <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.symbol }} ({{auctionInfo.auction_info.sell_amount}})</div>
        <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.symbol }}</div>
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
  },
};
</script>

<style></style>
