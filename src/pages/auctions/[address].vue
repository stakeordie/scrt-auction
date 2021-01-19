<template>
  <page>
    <columns>
        <h1>Secret Auction</h1>
        <block>
          <h2>Auction Info</h2>
          <div>Amount: {{ sellAmountFromFractional }}</div>
          <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.symbol }}</div>
          <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.symbol }}</div>
          <div>Min Bid: {{ minimumBidFromFractional }}</div>
          <div>Description: {{ auctionInfo.auction_info.description }}</div>
          <div>Status: {{ auctionInfo.auction_info.status }}</div>
          <div v-if="isClosed">Winning Bid: {{ winningBidFromFractional }} </div>
          <div>Ends At: {{  auctionInfo.auction_info.ends_at }}</div>
          <div v-if="bidInfo.bid.amount_bid > 0">
            <div>Open Bid: {{ bidInfo.bid.message }} in the amount of {{ bidInfo.bid.amount_bid  / Math.pow(10, auctionInfo.auction_info.bid_token.token_info.decimals)}} {{auctionInfo.auction_info.bid_token.token_info.symbol}}</div>
            <button @click="retractBid()">Retract Your Bid</button>
          </div>
          <div v-if="bidInfo.bid.amount_bid == 0 || bidInfo.bid.status == 'Failure'">Bid: You have no open bids on this auction.</div>
        </block>

        
        
        <button v-if="isOwner || ( isBidder & isEnded )" @click="closeAuction()">Close Auction</button>

        <block v-if="!isClosed">
          <h2>Place a Bid</h2>
          <validation-observer v-slot="{ handleSubmit, invalid }">
            <form class="form" @submit.prevent="handleSubmit(placeBid)">
              <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
              </ul>

              <div class="form__frame">
                <validation-provider :rules="validationRules" v-slot="{ errors }">
                  <label for="payment-amount">Amount</label>
                  <span class="error">{{ errors[0] }}</span>
                  <input name="payment-amount" type="text" v-model.trim="formBidAmount" />
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
import { required, min_value, max_decimals } from "vee-validate/dist/rules";
import TokenAmountInput from '../../components/TokenAmountInput.vue';

extend("required", {
  ...required,
  message: "This field is required",
});

extend("min_value", {
  params: ["minimumBid"],
  validate: (value, param) => {
    return parseInt(value) >= parseInt(param.minimumBid);
  },
  message: "The minimum bid for this auction is {minimumBid}.",
});

extend("max_decimals", {
  params: ["maxDecimalsAllowed"],
  validate: (value, param) => {
    return parseInt(param.maxDecimalsAllowed) >= parseFloat(value).countDecimals();
  },
  message: "The maximum # of decimals allowed is {maxDecimalsAllowed}",
});

export default {
  components: { TokenAmountInput, ValidationObserver, ValidationProvider},
  data() {
    return {
      errors: [],
      auctionAddress: "",
      hasViewingKey: false,
      bidInfo: {
        "bid": {
          "message": "",
          "amount_bid": ""
        }
      },
      formBidAmount: 1,
      codeHash: "",
      auctionInfo: {
        auction_info: {
          sell_token: {
            contract_address: "",
            token_info: {
              name: "",
              symbol: "",
              decimals: 6,
              total_supply: ""
            }
          },
          bid_token: {
            contract_address: "",
            token_info: {
              name: "",
              symbol: "",
              decimals: 6,
              total_supply: ""
            }
          },
          sell_amount: "",
          minimum_bid: "",
          description: "",
          auction_address: "",
          status: "",
          ends_at: "",
          winning_bid: ""
        }
      },
      validationRules: "",
      isOwner: false,
      isEnded: false,
      isBidder: false,
      isClosed: false
    };
  },
  async created() {
    this.auctionAddress = this.$route.params.address;
    const viewingKey = await this.$auctions.getViewingKey(this.$store.state.$keplr.selectedAccount?.address, this.$auctions.factoryAddress);
    console.log("[address].vue/created/viewingKey"); console.log(viewingKey);
    if(viewingKey) {
      this.hasViewingKey = true;
      const bidInfoResponse = await this.$auctions.getAuctionBidInfo(this.auctionAddress, viewingKey);
      if(!bidInfoResponse.viewing_key_error) {
        this.bidInfo = bidInfoResponse;
        this.isBidder = true;
      }
      const userAuctions = await this.$auctions.listUserAuctions();
      console.log("[address].vue/created/userAuctions"); console.log(userAuctions);
      if(userAuctions?.list_my_auctions?.active?.as_seller) {
        const is_owner = userAuctions.list_my_auctions.active.as_seller.filter(auction => auction.address == this.auctionAddress)
        if(is_owner.length > 0) {
          this.isOwner = true;
        }
      }
    }
    this.auctionInfo = await this.$auctions.getAuctionInfo(this.auctionAddress);
    console.log("[address]/created/auctionInfo"); console.log(this.auctionInfo);
    if(this.auctionInfo) {
      this.codeHash = await this.$scrtjs.getContractHash(this.auctionAddress);
      this.validationRules = "required|min_value:" + this.minimumBidFromFractional + "|max_decimals:" + this.auctionInfo.auction_info.bid_token.token_info.decimals;
      this.formBidAmount = this.minimumBidFromFractional;
      if(this.auctionInfo.auction_info.status == "Closed") {
        this.isClosed = true;
      }
      // if ends_at is in the past
      const ended = new Date(this.auctionInfo.auction_info.ends_at);
      const now = new Date();
      if(now > ended) {
        this.isEnded = true;
      }
    }
  },
  computed: {
    sellAmountFromFractional: function () {
      return this.auctionInfo.auction_info.sell_amount / Math.pow(10, this.auctionInfo.auction_info.sell_token.token_info.decimals)
    },
    winningBidFromFractional: function () {
      return this.auctionInfo.auction_info.winning_bid / Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    },
    minimumBidFromFractional: function () {
      return this.auctionInfo.auction_info.minimum_bid / Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    },
    formBidAmountToFractional: function () {
      return this.formBidAmount * Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    }
  },
  methods: {
    async placeBid() {
      let placedBid = await this.$auctions.placeBid(this.auctionInfo.auction_info.bid_token.contract_address, this.auctionAddress, this.formBidAmountToFractional);
      if(!this.hasViewingKey) {
        const viewingKey = await this.$auctions.createViewingKey(this.$auctions.factoryAddress);
        await this.$auctions.addUpdateWalletKey(this.$auctions.factoryAddress,viewingKey);
      }
      //console.log(placedBid);
    },
    async retractBid() {
      let bidRetracted = await this.$auctions.retractBid(this.auctionAddress);
      //console.log(bidRetracted);
    },
    async closeAuction() {
      let closedAuction = await this.$auctions.closeAuction(this.auctionAddress)
    }
  }
};
</script>

<style></style>