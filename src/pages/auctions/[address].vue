<template>
  <page>
    <columns>
        <block>
          <h2>Auction Info</h2>
          <div>Amount: {{auctionInfo.auction_info.sell_amount / Math.pow(10, auctionInfo.auction_info.sell_token.token_info.decimals)}}</div>
          <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.symbol }}</div>
          <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.symbol }}</div>
          <div>Min Bid: {{ auctionInfo.auction_info.minimum_bid / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}}</div>
          <div>Description: {{ auctionInfo.auction_info.description }}</div>
          <div>Status: {{ auctionInfo.auction_info.status }}</div>
          <div v-if="bidInfo.bid.amount_bid > 0">
            <div>Open Bid: {{ bidInfo.bid.message }} in the amount of {{ bidInfo.bid.amount_bid  / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}} {{auctionInfo.auction_info.bid_token.token_info.symbol}}</div>
            <button @click="retractBid()">Retract Your Bid</button>
          </div>
          <div v-if="bidInfo.bid.amount_bid == 0 || bidInfo.bid.status == 'Failure'">Bid: You have no open bids on this auction.</div>
        </block>
        <h1>Secret Auction</h1>
        <button v-if="isOwner" @click="closeAuction()">Close Auction</button>
        <block>
          <h2>Place a Bid</h2>
          <validation-observer v-slot="{ handleSubmit, invalid }">
            <form class="form" @submit.prevent="handleSubmit(placeBid)">
              <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
              </ul>

              <div class="form__frame">
                <validation-provider :rules="minValueRules" v-slot="{ errors }">
                  <label for="tokenAmountInputField">Bid Amount</label>
                  <span class="error">{{ errors[0] }}</span>
                  <!-- <input type="text" v-model="formBidAmount"/> -->
                  <token-amount-input
                    name="tokenAmountInputField"
                    v-model="formBidAmount"
                    :decimals="auctionInfo.auction_info.bid_token.token_info.decimals"
                    :tokenBaseSymbol="'u' + auctionInfo.auction_info.bid_token.token_info.symbol"
                    :tokenSymbol="auctionInfo.auction_info.bid_token.token_info.symbol"
                  ></token-amount-input>
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
import TokenAmountInput from '../../components/TokenAmountInput.vue';

extend("required", {
  validate: value => {
    return String(value.amount).trim().length;
  },
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
  components: { TokenAmountInput, ValidationObserver, ValidationProvider},
  data() {
    return {
      errors: [],
      auctionAddress: "",
      bidInfo: {
        "bid": {
          "message": "",
          "amount_bid": ""
        }
      },
      formBidAmount: {},
      codeHash: "",
        auctionInfo: {
          auction_info: {
            sell_token: {
              contract_address: "",
              token_info: {
                name: "",
                symbol: "",
                decimals: 8,
                total_supply: ""
              }
            },
            bid_token: {
              contract_address: "",
              token_info: {
                name: "",
                symbol: "",
                decimals: 0,
                total_supply: ""
              }
            },
            sell_amount: "",
            minimum_bid: "",
            description: "",
            auction_address: "",
            status: "",
          }
        },
      minValueRules: "",
      isOwner: false
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
      const userAuctions = await this.$auctions.listUserAuctions();
      if(userAuctions?.list_my_auctions?.active?.as_seller) {
        const is_owner = userAuctions.list_my_auctions.active.as_seller.filter(auction => auction.address == this.auctionAddress)
        if(is_owner.length > 0) {
          this.isOwner = true;
        }
      }
    }
    this.auctionInfo = await this.$auctions.getAuctionInfo(this.auctionAddress);
    console.log(JSON.stringify(this.auctionInfo));
    if(this.auctionInfo) {
      this.codeHash = await this.$scrtjs.getContractHash(this.auctionAddress);
      this.minValueRules = "required|integer|min_value:" + this.auctionInfo.auction_info.minimum_bid;
      this.formBidAmount = { "amount": this.auctionInfo.auction_info.minimum_bid };
    }
  },
  methods: {
    async placeBid() {
      let placedBid = await this.$auctions.placeBid(this.auctionInfo.auction_info.bid_token.contract_address, this.auctionAddress, this.formBidAmount.denomValue);
      console.log(placedBid);
    },
    async retractBid() {
      let bidRetracted = await this.$auctions.retractBid(this.auctionAddress);
      console.log(bidRetracted);
    },
    async closeAuction() {
      let closedAuction = await this.$auctions.closeAuction(this.auctionAddress)
    }
  }
};
</script>

<style></style>