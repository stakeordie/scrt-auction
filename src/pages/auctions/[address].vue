<template>
  <page>
    <columns>
        <h1>Secret Auction</h1>
        <block>
          <keplr-account v-model="keplrAccount" :abbreviation="16"></keplr-account>
          <h2>Auction Info</h2>
          <div>Amount: {{ sellAmountFromFractional }}</div>
          <div>Sell Token: {{ auctionInfo.auction_info.sell_token.token_info.name }} ({{ auctionInfo.auction_info.sell_token.token_info.symbol }})</div>
          <div>Bid Token: {{ auctionInfo.auction_info.bid_token.token_info.name }} ({{ auctionInfo.auction_info.bid_token.token_info.symbol }})</div>
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

        <button v-show="isOwner & !changeMinimumBidRequested" @click="changeMinimumBidRequested = !changeMinimumBidRequested">Change Minimum Bid</button><br/>
        <validation-observer v-show="changeMinimumBidRequested" v-slot="{ handleSubmit, invalid }">
          <form class="auction-form" @submit.prevent="handleSubmit(changeMinimumBid)">
            <validation-provider class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
              <label for="minimum-bid-amount">Minimum bid</label>
              <span class="error">{{ errors[0] }}</span>
              <input name="minimum-bid-amount" type="text" v-model.trim="newMinimumBid" />
            </validation-provider>
            <button :disabled="invalid">Change Minimum Bid</button>
          </form>
        </validation-observer>

        <button v-show="isOwner & !isEnded & !updateEndTimeRequested" @click="updateEndTimeRequested = !updateEndTimeRequested">Update End Time</button><br/>
        <validation-observer v-show="isOwner & !isEnded & updateEndTimeRequested" v-slot="{ handleSubmit, invalid }">
          <form class="auction-form" @submit.prevent="handleSubmit(changeEndTime)">
            <!-- End auction date time -->
            <validation-provider class="auction-form__end-time" rules="required" v-slot="{ errors }">

                <label for="auction-end-time">End time</label>
                <span class="error">{{ errors[0] }}</span>
                <input class="auction-form__end-time__time" readonly name="auction-end-time" type="text" v-model="endTimeString" />

                <p>Can be closed after 
                    <input class="auction-form__end-time__amount" type="number" min="1" max="60" @change="updateEndTime()" v-model="endTimeAmount">
                    <select class="auction-form__end-time__unit" @change="updateEndTime()" v-model="endTimeUnit">
                        <option value="1">minute<span v-if="endTimeAmount > 1">s</span></option>
                        <option value="60">hour<span v-if="endTimeAmount > 1">s</span></option>
                        <option value="1440">day<span v-if="endTimeAmount > 1">s</span></option>
                        <option value="10080">week<span v-if="endTimeAmount > 1">s</span></option>
                    </select>
                </p>
            </validation-provider>
          
            <button :disabled="invalid">Change End Time</button>
            
          </form>
        </validation-observer>

        <button v-show="isOwner || isEnded" @click="closeAuction()">Close Auction</button>

        <block v-show="!isClosed">
          <h2>Place a Bid</h2>
          <validation-observer v-slot="{ handleSubmit, invalid }">
            <form class="form" @submit.prevent="handleSubmit(placeBid)">
              <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
              </ul>
              <div class="form__frame">
                <validation-provider :rules="validationRules" v-slot="{ errors }">
                  <label for="payment-amount">Price</label>
                  <span class="error">{{ errors[0] }}</span>
                  <input name="payment-amount" type="text" v-model.trim="placeBidForm.bidPrice" />
                </validation-provider>
                <validation-provider class="auction-form__min-bid-amount" rules="required|min_value:0" v-slot="{ errors }">
                    <label for="minimum-bid-amount">Minimum bid</label>
                    <span class="error">{{ errors[0] }}</span>
                    <input name="minimum-bid-amount" readonly type="text" v-model="bidAmount" />
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
import { mapGetters } from 'vuex'

import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value/*, max_decimals */} from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

import { Decimal } from 'decimal.js';

extend("required", {
  ...required,
  message: "This field is required",
});

extend("min_value", {
  params: ["minimumBid"],
  validate: (value, param) => {
    return parseFloat(value) >= parseFloat(param.minimumBid);
  },
  message: "The minimum bid for this auction is {minimumBid}.",
});

// extend("max_decimals", {
//   params: ["maxDecimalsAllowed"],
//   validate: (value, param) => {
//     return parseInt(param.maxDecimalsAllowed) >= parseFloat(value).countDecimals();
//   },
//   message: "The maximum # of decimals allowed is {maxDecimalsAllowed}",
// });

export default {
  components: {ValidationObserver, ValidationProvider, KeplrAccount},
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
      keplrAccount: null,
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
      isClosed: false,

      placeBidForm: { 
        bidPrice: 1
      },
      updateMinimumBidForm: {

      },
      closeAuctionForm: {

      },
      
      changeMinimumBidRequested: false,
      newMinimumBid: 0,

      updateEndTimeRequested: false,
      endTimeAmount: 1,
      endTimeUnit: "60",
      newEndTime: new Date()
    };
  },
  watch: {
    keplrAccount(newValue, oldValue) {
      if(newValue) {
        this.refreshAuction();
      }
    }
  },
  computed: {
    ...mapGetters("$auctions", [
      ""
    ]),
    auction: function() {
      return this.$store.getters[`$auctions/getAuction`](this.$route.params.address)
    },
    bidAmount: function() {
      if(this.auctionInfo.auction_info.bid_token.token_info?.decimals) {
        const rawBidAmount = new Decimal(this.placeBidForm.bidPrice * this.sellAmountFromFractional);
        return rawBidAmount.toFixed(this.auctionInfo.auction_info.bid_token.token_info.decimals).replace(/\.?0+$/,"");
      } else {
        return 0;
      }
    },
    sellAmountFromFractional: function () {
      return (this.auctionInfo.auction_info.sell_amount / Math.pow(10, this.auctionInfo.auction_info.sell_token.token_info.decimals)).toFixed(this.auctionInfo.auction_info.sell_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    winningBidFromFractional: function () {
      return this.auctionInfo.auction_info.winning_bid / Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    },
    minimumBidFromFractional: function () {
      return (this.auctionInfo.auction_info.minimum_bid / Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)).toFixed(this.auctionInfo.auction_info.bid_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    newMinimumBidToFractional: function () {
      return this.newMinimumBid * Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    },
    formBidAmountToFractional: function () {
      return this.formBidAmount * Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals)
    },
    minimumPrice: function () {
      return this.minimumBidFromFractional / this.sellAmountFromFractional;
    },
    endTimeString() {
        return this.newEndTime.toLocaleString();
    }
  },
  mounted () {
    this.updateEndTime();
    this.interval = setInterval(this.updateEndTime, 1000);
  },
  destroyed () {
      clearInterval(this.interval);
  },
  methods: {
    async placeBid() {
      console.log(this.bidPrice)
      const bidAmountToFractional = this.bidAmount * Math.pow(10, this.auctionInfo.auction_info.bid_token.token_info.decimals);
      const placedBid = await this.$auctions.placeBid(this.auctionInfo.auction_info.bid_token.contract_address, this.auctionAddress, (new Decimal(bidAmountToFractional).toFixed(0)));
      if(!this.hasViewingKey) {
        const viewingKey = await this.$auctions.createViewingKey(this.$auctions.factoryAddress);
        await this.$auctions.addUpdateWalletKey(this.$auctions.factoryAddress,viewingKey);
      }
      this.refreshAuction();
      //console.log(placedBid);
    },
    async retractBid() {
      const bidRetracted = await this.$auctions.retractBid(this.auctionAddress);
      this.refreshAuction();
      //console.log(bidRetracted);
    },
    async changeMinimumBid() {
      const changedMinimumBid = await this.$auctions.changeMinimumBid(this.auctionAddress, this.newMinimumBidToFractional);
      this.refreshAuction();
      //console.log(bidRetracted);
    },
    async changeEndTime() {
      const changedEndTime = await this.$auctions.changeEndTime(this.auctionAddress, this.newEndTime);
      this.refreshAuction();
    },
    async closeAuction() {
      const closedAuction = await this.$auctions.closeAuction(this.auctionAddress)
      this.refreshAuction();
    },
    async refreshAuction() {
      this.auctionAddress = this.$route.params.address;
      console.log("[address]/refreshAuction/keprWalletAddress"); console.log(this.$store.state.$keplr.selectedAccount?.address);
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
        this.validationRules = "required|min_value:" + this.minimumPrice /*+ "|max_decimals:" + this.auctionInfo.auction_info.bid_token.token_info.decimals*/;
        this.placeBidForm.bidPrice = this.minimumPrice;
        this.newMinimumBid = this.minimumBidFromFractional;
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
    updateEndTime() {
        this.newEndTime = new Date((new Date()).getTime() + (Number(this.endTimeAmount || 1) * Number(this.endTimeUnit) * 60000));
    },
  }
};
</script>

<style></style>