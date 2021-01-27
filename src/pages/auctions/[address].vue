<template>
  <page>
    <columns>
      <div class="page-title">
          <h1>Auction Detail</h1>
          <h3>{{ auctionInfo.auction_address }}</h3>
          <h4 v-if="auctionInfo.description">{{ auctionInfo.description }}</h4>
      </div>
      <keplr-account v-model="keplrAccount" :abbreviation="16" :hidden="true"></keplr-account>
      <block>
        <div class="stage-panel">
            <h3>Details</h3>
            <h4 v-if="isClosed">Auction Status: Closed</h4>
            <h4 v-else>Auction Status: Open</h4>
            <div class="flex">
              <dl>
                <dt>Sale Token</dt>
                <dd>
                  {{ auctionInfo.sell_token.token_info.symbol }}
                </dd>
              </dl>
              <dl>
                <dt>Bid Token</dt>
                <dd>
                  {{ auctionInfo.bid_token.token_info.symbol }}
                </dd>
              </dl>
            </div>
            <div class="flex">
            <!-- <h3 class="auction__pair">
              <span class="sell-denom">{{ auctionInfo.sell_token.token_info.name }} ({{ auctionInfo.sell_token.token_info.symbol }})</span> -> 
              <span class="bid-denom">{{ auctionInfo.bid_token.token_info.name }} ({{ auctionInfo.bid_token.token_info.symbol }})</span>
            </h3> -->
              <dl>
                <dt>Selling</dt>
                <dd>
                  {{ sellAmountFromFractional }} {{ auctionInfo.sell_token.token_info.symbol }}
                </dd>
              </dl>
              <dl>
                <dt>Asking Price</dt>
                <dd>
                  {{ askingPrice }} {{ auctionInfo.bid_token.token_info.symbol }} <span style="font-size: 13px" v-if="sellAmountFromFractional != 1">({{ this.minimumBidFromFractional }} {{ auctionInfo.bid_token.token_info.symbol }})</span>
                </dd>
              </dl>
              <dl v-if="!isClosed">
                <dt style="cursor: context-menu;" @hover="endsAtModal">Ends At <sup>*</sup></dt>
                <dd>
                  {{ endTimeString }}
                </dd>
              </dl>
              <dl v-if="isClosed">
                <dt>Winning Bid Price</dt>
                <dd v-if="auctionInfo.winning_bid">
                  {{ winningBidPrice }} {{ auctionInfo.bid_token.token_info.symbol }} <span style="font-size: 13px" v-if="winningBidFromFractional != 1">({{ this.winningBidFromFractional }} {{ auctionInfo.bid_token.token_info.symbol }})</span>
                </dd>
                <dd v-else>
                    Closed without a winner
                </dd>
              </dl>
            </div>
        </div>
      </block>
    </columns>
    <column :number="(isOwner || isEnded) && !isClosed ? '2' : '1'" number-m="1" number-s="1">
      <block>
        <div class="stage-panel" v-if="(isOwner || isEnded) && !isClosed">
          <h3>Manage Auction</h3>
          <!-- <h3 class="auction__pair">
            <span class="sell-denom">{{ auctionInfo.sell_token.token_info.name }} ({{ auctionInfo.sell_token.token_info.symbol }})</span> -> 
            <span class="bid-denom">{{ auctionInfo.bid_token.token_info.name }} ({{ auctionInfo.bid_token.token_info.symbol }})</span>
          </h3> -->
                  <!-- Change Minimum Bid -->
          <dl v-if="isOwner && !isEnded">
            <dd>
              <button v-show="!changeMinimumBidRequested" @click="changeMinimumBidRequested = !changeMinimumBidRequested">Update Asking Price</button><br/>
              <validation-observer v-show="changeMinimumBidRequested" v-slot="{ handleSubmit, invalid }">
                <form @submit.prevent="handleSubmit(updateAskingPrice)">
                  <validation-provider class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
                    <label for="asking-price-form">New Asking Price</label>
                    <span class="error">{{ errors[0] }}</span>
                    <input name="asking-price-form" type="text" v-model.trim="updateAskingPriceForm.askingPrice" />
                    <div class="bid-price-conversion">New Minimum Bid = {{ changeAskingPriceFormMinimumBid }} {{auctionInfo.bid_token.token_info.symbol}}</div>
                  </validation-provider>
                  <div style="display: flex; justify-content: flex-end;">
                    <button :disabled="invalid">Enter</button>
                  </div>
                </form>
              </validation-observer>
            </dd>
          </dl>
          <!-- Bid Status -->
          <dl v-if="isOwner">
            <dt>Bid Status</dt>
            <dd v-if="hasBids">
              1 or more bids;
            </dd>
            <dd v-else>
              No Bids.
            </dd>
          </dl>
          <!-- Close Auction for non owners -->
          <dl v-if="!isOwner && isEnded">
            <dt>The auction can now be closed by anyone</dt>
            <loading-icon v-if="closingAuctionSimpleNonOwner">
              <p>Closing Auction</p>
            </loading-icon>
            <div v-if="closeAuctionSimpleNonOwnerNotification">{{closedAuctionSimpleNonOwnerResponse}}</div>
            <dd><button v-show="!isOwner && isEnded" @click="closeAuctionSimple">Close Auction</button></dd>
          </dl>
          <!-- -->
          <dl v-if="isOwner">
            <dd>
              <button v-show="isOwner && !closeAuctionRequested" @click="closeAuctionRequested = !closeAuctionRequested" class="orange-btn">Close Auction</button>
              <div v-show="closeAuctionRequested" class="stage-panel stage-panel__info">
                  <h3>Close Auction</h3>
                  <div class="details">
                      <p>As the owner of this auction you have ways to close.</p>
                      <p>You can close as is, or you can choose to extend the auction if there are no bids.</p>
                      <p>If you select to extend, you will be given additional options</p>
                      <div class="flex">
                      <button @click="closeAuctionSimple">Complete Close Auction</button>
                      <button @click="closeAuctionAdvancedRequested = true">Extend if no bids</button>
                      </div>
                  </div>
                  <validation-observer v-show="closeAuctionAdvancedRequested" v-slot="{ handleSubmit, invalid }">
                    <form @submit.prevent="handleSubmit(closeAuctionWithOptions)">
                      <validation-provider class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
                    <label for="asking-price-form">New Asking Price</label>
                    <span class="error">{{ errors[0] }}</span>
                    <input name="asking-price-form" type="text" v-model.trim="closeAuctionForm.askingPrice" />
                    <div class="bid-price-conversion">New Minimum Bid = {{ closeAuctionFormMinimumBid }} {{auctionInfo.bid_token.token_info.symbol}}</div>
                  </validation-provider>
                      <validation-provider class="auction-form__end-time" rules="required" v-slot="{ errors }">
                          <label for="auction-end-time">End time</label>
                          <span class="error">{{ errors[0] }}</span>
                          <input class="auction-form__end-time__time" readonly name="auction-end-time" type="text" v-model="closedAuctionFromEndTimeString" />
                          <p>Can be closed after 
                              <input class="auction-form__end-time__amount" type="number" min="1" max="60" @change="updateEndTime()" v-model="closeAuctionForm.endTimeAmount">
                              <select class="auction-form__end-time__unit" @change="updateEndTime()" v-model="closeAuctionForm.endTimeUnit">
                                  <option value="1">minute<span v-if="closeAuctionForm.endTimeAmount > 1">s</span></option>
                                  <option value="60">hour<span v-if="closeAuctionForm.endTimeAmount > 1">s</span></option>
                                  <option value="1440">day<span v-if="closeAuctionForm.endTimeAmount > 1">s</span></option>
                                  <option value="10080">week<span v-if="closeAuctionForm.endTimeAmount > 1">s</span></option>
                              </select>
                          </p>
                      </validation-provider>
                      <button :disabled="invalid">Close with options</button>
                    </form>
                  </validation-observer>
              </div>
            </dd>
          </dl>
        </div>
      </block>
      <block v-show="!isClosed">
        <h2>Place a Bid</h2>
        <div class="stage-panel" v-if="bidInfo.amount_bid > 0">
          <div>
            <h5>Current Bid</h5>
            <dl>
              <dd>
                {{ bidInfoPrice }} {{ auctionInfo.bid_token.token_info.symbol }} <span style="font-size: 13px" v-if="sellAmountFromFractional != 1">({{ bidInfoAmountFromFractional }} {{ auctionInfo.bid_token.token_info.symbol }})</span>
              </dd>
            </dl>
            <dl>
              <dd class="no-margin">
                <button @click="retractBid()" class="red-btn no-margin">Retract</button>
              </dd>
            </dl>
          </div>
        </div>
        <loading-icon v-if="placingBidInProgress">
          <p>Placing Bid</p>
        </loading-icon>
        <div v-if="placeBidNotification">{{placedBidResponse}}</div>
        <validation-observer v-slot="{ handleSubmit, invalid }">
          <form class="form" @submit.prevent="handleSubmit(placeBid)">
            <ul>
              <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
            </ul>
            <div class="form__frame">
              <validation-provider :rules="validationRules" v-slot="{ errors }">
                <label for="payment-amount">Bid Price</label>
                <span class="error">{{ errors[0] }}</span>
                <input name="payment-amount" type="text" v-model.trim="placeBidForm.bidPrice" />
              </validation-provider>
              <div class="bid-price-conversion">Bid Amount = {{ bidAmount }} {{auctionInfo.bid_token.token_info.symbol}}</div>
              <button :disabled="invalid">Place Bid</button>
            </div>
          </form>
        </validation-observer>
      </block>
    </column>
  </page>
</template>

<script>
import { mapGetters } from 'vuex'

import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value/*, max_decimals */} from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

import { Decimal } from 'decimal.js';
import TokenAmount from '../../components/TokenAmount.vue';
import LoadingIcon from '../../components/LoadingIcon.vue';

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
  components: {ValidationObserver, ValidationProvider, KeplrAccount, TokenAmount, LoadingIcon},
  data() {
    return {
      errors: [],
      auctionAddress: "",
      hasViewingKey: false,
      bidInfo: {
        "message": "",
        "status": "",
        "amount_bid": 0
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
        bidPrice: 1,
      },
      updateAskingPriceForm: {
        askingPrice: 0,
      },
      closeAuctionForm: {
        askingPrice: 0,
        endTime: new Date(),
        endTimeAmount: 1,
        endTimeUnit: "60",
        newEndTime: new Date(),
      },
      
      changeMinimumBidRequested: false,
      closeAuctionRequested: false,
      closeAuctionAdvancedRequested: false,
      
      hasBids: false,

      placingBidInProgress: false,
      placeBidNotification: false,
      placedBidResponse: {},

      closingAuctionSimpleNonOwner: false,
      closeAuctionSimpleNonOwnerNotification: false,
      closedAuctionSimpleNonOwnerResponse: {},

      closingAuctionSimple: false,
      closeAuctionSimpleNotification: false,
      closedAuctionSimpleResponse: {},
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
        // const rawBidAmount = new Decimal(new Decimal(1.1) * new Decimal(3000000000));
        // return rawBidAmount
        const rawBidAmount = new Decimal(this.placeBidForm.bidPrice) * new Decimal(this.sellAmountFromFractional);
        return rawBidAmount.toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"");
      } else {
        return 0;
      }
    },
    changeAskingPriceFormMinimumBid: function () {
      if(this.auctionInfo.bid_token.token_info?.decimals) {
        // const rawBidAmount = new Decimal(new Decimal(1.1) * new Decimal(3000000000));
        // return rawBidAmount
        const rawBidAmount = new Decimal(this.updateAskingPriceForm.askingPrice) * new Decimal(this.sellAmountFromFractional);
        return rawBidAmount.toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"");
      } else {
        return 0;
      }
    },
    closeAuctionFormMinimumBid: function () {
      if(this.auctionInfo.bid_token.token_info?.decimals) {
        // const rawBidAmount = new Decimal(new Decimal(1.1) * new Decimal(3000000000));
        // return rawBidAmount
        const rawBidAmount = new Decimal(this.closeAuctionForm.askingPrice) * new Decimal(this.sellAmountFromFractional);
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
    winningBidPrice: function () {
      return this.winningBidFromFractional / this.sellAmountFromFractional;
    },
    minimumBidFromFractional: function () {
      return (this.auctionInfo.minimum_bid / Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)).toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    // minimumBidAmountToFractional: function () {
    //   return this.auctionInfo.minimum_bid * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)
    // },
    formBidAmountToFractional: function () {
      return this.formBidAmount * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)
    },
    askingPrice: function () {
      return this.minimumBidFromFractional / this.sellAmountFromFractional;
    },
    endTimeString: function () {
      return new Date(this.auctionInfo.ends_at).toLocaleString();
    },
    closedAuctionFromEndTimeString: function() {
      return this.closeAuctionForm.endTime.toLocaleString();
    },
    bidInfoAmountFromFractional: function() {
      return (this.bidInfo.amount_bid / Math.pow(10, this.auctionInfo.bid_token.token_info.decimals)).toFixed(this.auctionInfo.bid_token.token_info.decimals).replace(/\.?0+$/,"")
    },
    bidInfoPrice: function () {
      return this.bidInfoAmountFromFractional / this.sellAmountFromFractional; 
    }
  },
  mounted () {
    this.getAuction()
    this.updateEndTime();
    this.interval = setInterval(this.updateEndTime, 1000);
  },
  destroyed () {
      clearInterval(this.interval);
  },
  methods: {
    async placeBid() {
      this.placingBidInProgress = true;
      const bidAmountToFractional = this.bidAmount * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals);
      this.placedBidResponse = await this.$auctions.placeBid(this.auctionInfo.bid_token.contract_address, this.auctionAddress, (new Decimal(bidAmountToFractional).toFixed(0)));
      this.placingBidInProgress = false;
      this.placeBidNotification = true;
      this.refreshAuction();
    },
    async retractBid() {
      const bidRetracted = await this.$auctions.retractBid(this.auctionAddress);
      this.refreshAuction();
      //console.log(bidRetracted);
    },
    async updateAskingPrice() {
      const newMinimumBidAmount = this.changeAskingPriceFormMinimumBid * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals);
      const updatedBidAmount = await this.$auctions.changeMinimumBid(this.auctionAddress, new Decimal(newMinimumBidAmount).toFixed(0));
      this.refreshAuction();
      //console.log(bidRetracted);
    },
    async changeEndTime() {
      const changedEndTime = await this.$auctions.changeEndTime(this.auctionAddress, this.newEndTime);
      this.refreshAuction();
    },
    async closeAuctionSimple() {
      if(this.isOwner) {
        this.closingAuctionSimple = true;
      } else {
        this.closingAuctionSimpleNonOwner = true
      }
      const closedAuction = await this.$auctions.closeAuction(this.auctionAddress)
      if(this.isOwner) {
        this.closingAuctionSimple = false;
        this.closingAuctionSimpleNotification = true;
      } else {
        this.closingAuctionSimpleNonOwner = false;
        this.closingAuctionSimpleNonOwnerNotification = true;
      }
      this.refreshAuction();
    },
    async closeAuctionWithOptions() {
      const newMinimumBidAmount = this.closeAuctionFormMinimumBid * Math.pow(10, this.auctionInfo.bid_token.token_info.decimals);
      const endTime = Math.round(this.closeAuctionForm.endTime.getTime() / 1000)
      const closedAuction = await this.$auctions.closeAuctionWithOptions(this.auctionAddress,endTime,new Decimal(newMinimumBidAmount).toFixed(0))
      this.refreshAuction();
    },
    async getAuction() {
      this.isClosed = false;
      this.isEnded = false;
      this.auctionAddress = this.$route.params.address;
      this.auctionInfo = (await this.$auctions.getAuctionInfo(this.auctionAddress)).auction_info;
      if(this.auctionInfo) {
        this.codeHash = await this.$scrtjs.getContractHash(this.auctionAddress);
        this.validationRules = "required|min_value:" + this.askingPrice /*+ "|max_decimals:" + this.auctionInfo.bid_token.token_info.decimals*/;
        this.placeBidForm.bidPrice = this.askingPrice;
        this.updateAskingPriceForm.askingPrice = this.placeBidForm.bidPrice;
        this.closeAuctionForm.askingPrice = this.placeBidForm.bidPrice;
        this.updateAskingPriceForm.minimumBidAmount = this.minimumBidFromFractional;
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
    async refreshAuction() {
      this.getAuction();
      //reset bidder / owner
      this.bidInfo = {
        "message": "",
        "status": "",
        "amount_bid": 0
      }
      this.isBidder = false;
      this.isOwner = false;
      this.hasBids = false;
      this.hasViewingKey = false;

      this.auctionAddress = this.$route.params.address;
      const viewingKey = await this.$auctions.getViewingKey(this.$store.state.$keplr.selectedAccount?.address, this.$auctions.factoryAddress);
      if(viewingKey) {
        this.hasViewingKey = true;
        const bidInfoResponse = await this.$auctions.getAuctionBidInfo(this.auctionAddress, viewingKey);
        if(!bidInfoResponse.viewing_key_error) {
          if(bidInfoResponse?.bid?.status != "Failure") {
            this.bidInfo = bidInfoResponse.bid;
            this.isBidder = true;
          }
          const userAuctions = await this.$auctions.listUserAuctions();
          if(userAuctions?.list_my_auctions?.active?.as_seller) {
            const is_owner = userAuctions.list_my_auctions.active.as_seller.filter(auction => auction.address == this.auctionAddress)
            if(is_owner.length > 0) {
              this.isOwner = true;
              this.hasBids = (await this.$auctions.getAuctionHasBids(this.auctionAddress, viewingKey)).has_bids.has_bids;
            }
          }
        }
      }
    },
    updateEndTime() {
        this.closeAuctionForm.endTime = new Date((new Date()).getTime() + (Number(this.closeAuctionForm.endTimeAmount || 1) * Number(this.closeAuctionForm.endTimeUnit) * 60000));
    },
    endsAtModal() {

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
  .flex {
    display: flex;

    dl {
      margin-right: 100px;
    }
  }
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
        &.no-margin {
          margin: 0;
        }
        button {
          &.red-btn {
            background-color: var(--color-red-primary);
          }
          &.orange-btn {
            background-color: var(--color-orange-primary);
          }
          &.no-margin {
            margin: 0;
          }
        }
      }
    }

}

// Sandy vvvv

.bid-price-conversion {
  padding-bottom: 22px;
  font-size: 13px;
  margin-top: -4px;
  text-align: right;
}

.whatsthis {
  font-size: 10px;
}

// Sandy ^^^^^^

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