<template>
  <page>
      <columns>
      <h1>Secret Auction</h1>
      <block v-if="auctionInfo">
        <h2>Auction Info</h2>
        <div>Amount: {{auctionInfo.auction_info.sell_amount / Math.pow(10, auctionInfo.auction_info.sell_token.token_info.decimals)}}</div>
        <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.symbol }}</div>
        <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.symbol }}</div>
        <div>Min Bid: {{ auctionInfo.auction_info.minimum_bid / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}}</div>
        <div>Description: {{ auctionInfo.auction_info.description }}</div>
        <div>Status: {{ auctionInfo.auction_info.status }}</div>
        <div v-if="bidInfo.bid.amount_bid > 0">
          <div>Bids: {{ bidInfo.bid.message }} in the amount of {{ bidInfo.bid.amount_bid  / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}} {{auctionInfo.auction_info.bid_token.token_info.symbol}}</div>
          <button @click="retractBid()">Retract Your Bid</button>
        </div>
        <div v-if="bidInfo.bid.amount_bid == 0 || bidInfo.bid.status == 'Failure'">Bids: You have no active bids on this auction.</div>
      </block>
      <block>
        <h2>Place a Bid</h2>
        <validation-observer v-slot="{ handleSubmit, invalid }">
          <form class="form" @submit.prevent="handleSubmit(placeBid)">
            <ul>
              <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
            </ul>

            <div class="form__frame">
              <validation-provider :rules="minValueRules" v-slot="{ errors }">
                  <label for="bid-amount">Bid Amount</label>
                  <span class="error">{{ errors[0] }}</span>
                  <input name="bid-amount" type="text" v-model="formBidAmount"/>
              </validation-provider>
              <button :disabled="invalid">Place Bid</button>
            </div>
          </form>
        </validation-observer>
      </block>
      </columns>
  </page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, integer, min_value } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("integer", {
  ...integer,
  message: "This field must be an integer",
});

extend("min_value", {
  ...min_value,
  message: "The bid must be greater than the minimum value allowed by the auction.",
});

export default {
  components: { ValidationObserver, ValidationProvider},
  data() {
    return {
      errors: [],
      auctionAddress: "",
      auctionInfo: null,
      bidInfo: {
        "bid": {
          "message": "",
          "amount_bid": ""
        }
      },
      codeHash: "",
      formBidAmount: null,
      minValueRules: ""
    };
  },
  async created() {
    this.auctionAddress = this.$route.params.address;
    const viewingKey = await this.$auctions.getViewingKey();
    if(viewingKey) {
      const bidInfoResponse = await this.$auctions.getAuctionBidInfo(this.auctionAddress, viewingKey);
      if(!bidInfoResponse.viewing_key_error) {
        this.bidInfo = bidInfoResponse;
      }
    }
    console.log(this.bidInfo)
    this.auctionInfo = await this.$auctions.getAuctionInfo(this.auctionAddress)
    this.codeHash = await this.$scrtjs.getContractHash(this.auctionAddress);
    this.formBidAmount = this.auctionInfo.auction_info.minimum_bid;
    this.minValueRules = "required|integer|min_value:" + this.auctionInfo.auction_info.minimum_bid;
  },
  methods: {
    async placeBid() {
      let placedBid = await this.$auctions.placeBid(this.auctionInfo.auction_info.bid_token.contract_address, this.auctionAddress, this.formBidAmount);
      console.log(placedBid);
    },
    async retractBid() {
      let bidRetracted = await this.$auctions.retractBid(this.auctionAddress);
      console.log(bidRetracted);
    }
  }
};
</script>

<style></style>