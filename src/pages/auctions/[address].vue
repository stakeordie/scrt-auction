<template>
  <page>
    <columns>
        <h1>Secret Auction</h1>
        <block>
          <column number="2" number-m="1" number-s="1">
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
            <block>
              <div class="stage-panel">
                  <h2>Auction Info</h2>
                  <h3 class="auction__pair">
                    <span class="sell-denom">{{ auctionInfo.sell_token.token_info.name }} ({{ auctionInfo.sell_token.token_info.symbol }})</span> -> 
                    <span class="bid-denom">{{ auctionInfo.bid_token.token_info.name }} ({{ auctionInfo.bid_token.token_info.symbol }})</span>
                  </h3>
                  <dl>
                    <dt>Amount</dt>
                    <dd>
                      {{ sellAmountFromFractional }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>Status</dt>
                    <dd>
                      {{ auctionInfo.status }}
                    </dd>
                  </dl>
                  <dl v-if="auctionInfo.description">
                    <dt>Description</dt>
                    <dd>
                      {{ auctionInfo.description }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>Ends at</dt>
                    <dd>
                      {{  auctionInfo.ends_at }}
                    </dd>
                  </dl>
                  <dl v-if="isClosed">
                    <dt>Winning Bid</dt>
                    <dd>
                      {{ winningBidFromFractional }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>Minimum Bid</dt>
                    <dd>
                      {{ minimumBidFromFractional }}
                    </dd>
                    <dd>
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
                    </dd>
                  </dl>
                  <dl v-if="bidInfo.bid.amount_bid > 0">
                    <dt>Open Bid</dt>
                    <dd>{{ bidInfo.bid.message }} in the amount of {{ bidInfo.bid.amount_bid  / Math.pow(10, auctionInfo.bid_token.token_info.decimals)}} {{auctionInfo.bid_token.token_info.symbol}}</dd>
                    <dd><button @click="retractBid()" class="red-btn">Retract Your Bid</button></dd>
                  </dl>
                  <dl>
                    <dt>Bid</dt>
                    <dd v-if="bidInfo.bid.amount_bid == 0 || bidInfo.bid.status == 'Failure'">
                      You have no open bid on this auction.
                    </dd>
                    <dd v-if="isOwner && hasBids">
                      This auction has 1 or more bids.
                    </dd>
                    <dd v-if="isOwner && hasBids">
                      <button v-show="!isOwner && isEnded" @click="closeAuctionSimple">Close Auction</button>
                      <button v-show="isOwner && !closeAuctionRequested" @click="closeAuctionRequested = !closeAuctionRequested" class="orange-btn">Close Auction</button>
                      <div v-show="closeAuctionRequested" class="stage-panel stage-panel__info">
                          <h3>Close Auction</h3>
                          <div class="details">
                              <p>As the owner of this auction you have ways to close.</p>
                              <p>You can close as is, or you can choose to extend the auction if there are no bids.</p>
                              <p>If you select to extend, you will be given additional options</p>
                              <button @click="closeAuctionSimple">Complete Close Auction</button>
                              <button @click="closeAuctionAdvancedRequested = true">Extend if no bids</button>
                          </div>
                          <validation-observer v-show="closeAuctionAdvancedRequested" v-slot="{ handleSubmit, invalid }">
                            <form class="auction-form" @submit.prevent="handleSubmit(closeAuctionWithOptions)">
                              <validation-provider  class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
                                <label for="minimum-bid-amount">Minimum bid</label>
                                <span class="error">{{ errors[0] }}</span>
                                <input name="minimum-bid-amount" type="text" v-model.trim="newMinimumBid" />
                              </validation-provider>
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
                              <button :disabled="invalid">Close with options</button>
                            </form>
                          </validation-observer>
                      </div>
                    </dd>
                    <dd v-else-if="isOwner">
                      This auction has 0 total bids.
                    </dd>
                  </dl>
              </div>
            </block>
          </column>
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
      closeAuctionRequested: false,
      closeAuctionAdvancedRequested: false,
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
      if(this.auctionInfo.bid_token.token_info?.decimals) {
        const rawBidAmount = new Decimal(this.placeBidForm.bidPrice * this.sellAmountFromFractional);
        return rawBidAmount.toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"");
      } else {
        return 0;
      }
    },
    sellAmountFromFractional: function () {
      return new Decimal(this.auctionInfo.sell_amount / Math.pow(10, this.auctionInfo.sell_token.token_info.decimals)).toFixed(this.auctionInfo.sell_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    winningBidFromFractional: function () {
      return this.auctionInfo.winning_bid / Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)
    },
    minimumBidFromFractional: function () {
      return (this.auctionInfo.minimum_bid / Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)).toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    newMinimumBidToFractional: function () {
      return this.newMinimumBid * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)
    },
    formBidAmountToFractional: function () {
      return this.formBidAmount * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)
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
      const bidAmountToFractional = this.bidAmount * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals);
      const placedBid = await this.$auctions.placeBid(this.auctionInfo.bid_token.contract_address, this.auctionAddress, (new Decimal(bidAmountToFractional).toFixed(0)));
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
    async closeAuctionSimple() {
      const closedAuction = await this.$auctions.closeAuction(this.auctionAddress)
      this.refreshAuction();
    },
    async closeAuctionWithOptions() {
      const endTime = Math.round(this.newEndTime.getTime() / 1000)
      const closedAuction = await this.$auctions.closeAuctionWithOptions(this.auctionAddress,endTime,this.newMinimumBidToFractional)
      this.refreshAuction();
    },
    async refreshAuction() {
      this.auctionAddress = this.$route.params.address;
      const viewingKey = await this.$auctions.getViewingKey(this.$store.state.$keplr.selectedAccount?.address, this.$auctions.factoryAddress);
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
            this.hasBids = (await this.$auctions.getAuctionHasBids(this.auctionAddress, viewingKey)).has_bids.has_bids;
          }
        }
      }
      const auctionInfoResult = await this.$auctions.getAuctionInfo(this.auctionAddress);
      this.auctionInfo = auctionInfoResult.auction_info;
      console.log("[address]/created/auctionInfo"); console.log(this.auctionInfo);
      if(this.auctionInfo) {
        this.codeHash = await this.$scrtjs.getContractHash(this.auctionAddress);
        this.validationRules = "required|min_value:" + this.minimumPrice /*+ "|max_decimals:" + this.auctionInfo.bid_token.token_info.decimals*/;
        this.placeBidForm.bidPrice = this.minimumPrice;
        this.newMinimumBid = this.minimumBidFromFractional;
        if(this.auctionInfo.status == "Closed") {
          this.isClosed = true;
        }
        // if ends_at is in the past
        const ended = new Date(this.auctionInfo.ends_at);
        const now = new Date();
        if(now > ended) {
          this.isEnded = true;
        }
      }
    },
    updateEndTime() {
        this.newEndTime = new Date((new Date()).getTime() + (Number(this.endTimeAmount || 1) * Number(this.endTimeUnit) * 60000));
    }
  }
};
</script>

<style lang="scss" scoped>

.auction-form {
    display: grid;
    grid-template-columns: 70px 1fr 100px;
    column-gap: var(--f-gutter);
    align-items: end;

    select, textarea, input {
        width: 100%;
    }

    input:read-only {
        color: var(--f-default-text-color);
        background-color: var(--color-black);
        border: 1px solid var(--color-black);
        font-weight: 600;
    }

    label {
        margin-bottom: var(--f-gutter-xxs);
    }

    &__account {
        grid-column: 2 / 4;
    }
    &__sell-amount {
        grid-column: 1 / 3;
    }
    &__bid-amount {
        grid-column: 2 / 3;
    }
    &__bid-price {
        grid-column: 1 / 2;
    }
    &__bid-sell, &__bid-denom {
        grid-column: 3 / 4;
    }
    &__info-action, &__end-time, &__description {
        grid-column: 1 / 4;
    }

    .keplr__account {
        font-size: 21px;
    }

    &__label {
        align-self: center;
        &-emoji {
            font-size: 40px;
            text-decoration: none;
        }
        &-change {
            font-size: 13px;
        }
    }

    &__description textarea {
        min-height: 70px;
    }

    &__end-time {
        &__amount {
            display: inline;
            max-width: 4ch;
            margin: 0 1ch;
        }
        select {
            display: inline;
            width: min-content;
        }
    }
}

.allowance-form {
    &__action {
        width: 100%;
    }
}

.auction-creation {
    &__action-list {
        width: 100%;
    }
}

.stage-panel {
    background-color: var(--color-black);
    padding: var(--f-gutter);
    border-radius: 10px;
    margin-bottom: var(--f-gutter);
    //padding-bottom: 0;

    transition: height 1s;

    h3 {
        display: inline-block;
    }

    p, li {
        font-size: 15px;
    }

    .error {
        margin-bottom: var(--f-gutter);
    }

    .number {
        display: inline-grid;
        margin-right: var(--f-gutter-s);
        background-color: var(--color-purple-primary);
        border-radius: 1000px;
        line-height: 1em;
        width:  30px;
        height: 30px;
        justify-items: center;
        align-items: center;
        padding-top: 2px;
    }
    dl {
      dd {
        button {
          &.red-btn {
            background-color: var(--color-red-primary);
          }
          &.orange-btn {
            background-color: var(--color-orange-primary);
          }
        }
      }
    }

}


// All the stage fun comes here...
.new-auction {

    // Info stage
    &__stage-info {
        
        .stage-panel__info {
            border: 1px solid rgba(255,255,255,0.5);
            .number {
                color: black;
                background-color: var(--color-yellow-primary);
                &.valid {
                    background-color: var(--color-positive);
                }
            }
        }
        .stage-panel__allowance, .stage-panel__auction, .stage-panel__congrats {
            opacity: 0.5;
        }
    }

    // Allowance stage
    &__stage-allowance, &__stage-allowance--creating {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info {
            .number {
                background-color: var(--color-positive);
            }
        }
        .stage-panel__allowance {
            border: 1px solid rgba(255,255,255,0.5);
            .number {
                background-color: var(--color-yellow-primary);
                color: black;
            }
        }
        .stage-panel__info, .stage-panel__auction, .stage-panel__congrats {
            opacity: 0.5;
        }
    }

    // Auction stage
    &__stage-auction, &__stage-auction--creating {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__allowance {
            .number {
                background-color: var(--color-positive);
            }
        }
        .stage-panel__auction {
            &.error {
                border: 1px solid var(--color-negative);
            }
            &:not(.error) {
                border: 1px solid rgba(255,255,255,0.5);
            }
            .number {
                background-color: var(--color-yellow-primary);
                color: black;
            }
        }
        .stage-panel__info, .stage-panel__keys, .stage-panel__allowance {
            opacity: 0.5;
        }
    }

    // Congrats stage
    &__stage-congrats {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__auction, .stage-panel__allowance {
            .number {
                background-color: var(--color-positive);
                color: black;
            }
            opacity: 0.5;
        }
        .stage-panel__congrats {
            border: 1px solid var(--color-positive);
        }
    }
}

</style>