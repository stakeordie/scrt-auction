<template>
  <default-layout>
    <page>
      <column class="auction__header">
        <block>
          <div class="page-title">
              <h1>Auction Detail</h1>
              <keplr-account v-model="keplrAccount" :abbreviation="16" :hidden="true"></keplr-account>
          </div>
        </block>
        <block>
          <auction-item v-if="auction" :auction="auction" class="list selected"></auction-item>
        </block>
      </column>
      <column>
        <block>
          <div class="forms-wrapper">
            <div class="stage-panel" v-if="auction && auction.viewerIsSeller && !isClosed">
              <h3>Owner: Manage Auction</h3>
              <dl v-if="!isPastEndTime">
                <dd>
                  <button v-show="manageAuctionFormState != 'updateAsking'" @click="manageAuctionFormState = 'updateAsking'">Update Asking Price</button><br/>
                  <validation-observer v-show="manageAuctionFormState == 'updateAsking'" v-slot="{ handleSubmit, invalid }">
                    <form @submit.prevent="handleSubmit(updateAskingPrice)">
                      <validation-provider class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
                        <label for="asking-price-form">New Asking Price</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="asking-price-form" type="text" v-model.trim="updateAskingPriceForm.askingPrice" />
                        <div class="bid-price-conversion">New Minimum Bid = {{ updateAskingPriceFormMinimumBid }} {{auction.bid.denom}}</div>
                      </validation-provider>
                      <loading-icon v-if="changeAskingPriceSubmit.inProgress">
                        <p>Updating Asking Price</p>
                      </loading-icon>
                      <div class="result-failed" v-if="changeAskingPriceSubmit.result == 'error'">
                        <p>{{ changeAskingPriceSubmit.response.error }}</p>
                      </div>
                      <div style="display: flex; justify-content: flex-end;">
                        <button :disabled="invalid">Enter</button>
                      </div>
                    </form>
                  </validation-observer>
                </dd>
              </dl>
              <!-- Bid Status -->
              <dl>
                <dt>Bid Status</dt>
                <dd v-if="auction.hasBids">
                  At Least 1 Bid
                </dd>
                <dd v-else>
                  0 Bids
                </dd>
              </dl>
              
              <!-- -->
              <dl>
                <dd>
                  <button v-show="manageAuctionFormState != 'closeAuction' && manageAuctionFormState != 'closeAuctionWithOptions'" @click="manageAuctionFormState = 'closeAuction'" class="orange-btn">Close Auction</button>
                  <div v-show="manageAuctionFormState == 'closeAuction' || manageAuctionFormState == 'closeAuctionWithOptions'" class="stage-panel full-width">
                    <h3>Close Auction</h3>
                    <div class="details">
                        <p>As the owner of this auction you have two ways to close an Auction.</p>
                        <p>You can close the auction as is, or you can choose to extend the auction if there are no bids.</p>
                        <p>If you select to extend, you will be be able to choose the new expiration and change the asking price.</p>
                        <loading-icon v-if="closeAuctionSimpleSubmit.inProgress">
                          <p>Closing Auction</p>
                        </loading-icon>
                        <div class="result-failed" v-if="closeAuctionSimpleSubmit.result == 'error'">
                          <p>{{ closeAuctionSimpleSubmit.response.error }}</p>
                        </div>
                        <div class="flex close-auction-buttons">
                          <button @click="manageAuctionFormState = 'closeAuctionWithOptions'">Extend Auction if No Bids</button>
                          <button @click="closeAuctionSimple">Close Auction No Matter What</button>
                        </div>
                    </div>
                    <validation-observer v-show="manageAuctionFormState == 'closeAuctionWithOptions'" v-slot="{ handleSubmit, invalid }">
                      <form @submit.prevent="handleSubmit(closeAuctionWithOptions)">
                        <validation-provider class="auction-form__bid-amount" :rules="`required`" v-slot="{ errors }">
                          <label for="asking-price-form">New Asking Price</label>
                          <span class="error">{{ errors[0] }}</span>
                          <input name="asking-price-form" type="text" v-model.trim="closeAuctionForm.askingPrice" />
                          <div class="bid-price-conversion">New Asking Bid = {{ closeAuctionFormMinimumBid }} {{auction.bid.denom}}</div>
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
                        <loading-icon v-if="closeAuctionWithOptionsSubmit.inProgress">
                          <p>Closing Auction</p>
                        </loading-icon>
                        <div class="result-failed" v-if="closeAuctionWithOptionsSubmit.result == 'error'">
                          <p>{{ closeAuctionWithOptionsSubmit.response.error }}</p>
                        </div>
                        <button :disabled="invalid">Close with options</button>
                      </form>
                    </validation-observer>
                  </div>
                </dd>
              </dl>
            </div>     
            <div class="stage-panel" v-if="!isClosed">
              <h2>Bid</h2>
              <div v-if="auction.viewerIsBidder">
                <h5>Current Bid</h5>
                <dl>
                  <dd>
                    {{ currentBidPrice }} {{ auction.bid.denom }} <span style="font-size: 13px" v-if="auction.sell.decimalAmount != 1">({{ auction.currentBid.decimalAmount }} {{ auction.bid.denom }})</span>
                  </dd>
                </dl>
                <loading-icon v-if="retractBidSubmit.inProgress">
                  <p>Retracting Bid</p>
                </loading-icon>
                <div class="result-failed" v-if="retractBidSubmit.result == 'error'">
                  <p>{{ retractBidSubmit.response.error }}</p>
                </div>
                <dl>
                  <dd class="no-margin">
                    <button @click="retractBid()" class="red-btn no-margin">Retract</button>
                  </dd>
                </dl>
              </div>
            
              <validation-observer v-slot="{ handleSubmit, invalid }">
                <form class="form" @submit.prevent="handleSubmit(placeBid)">
                  <ul>
                    <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
                  </ul>
                  <div class="form__frame">
                    <validation-provider :rules="`required|min_value:${auction.price}`" v-slot="{ errors }">
                      <label for="payment-amount">Bid Price Per Token</label>
                      <span class="error">{{ errors[0] }}</span>
                      <input name="payment-amount" type="text" v-model.trim="placeBidForm.bidPrice" />
                    </validation-provider>
                    <div class="bid-price-conversion">Total Bid Amount = {{ bidAmount }} {{auction.bid.denom}}</div>
                    <loading-icon v-if="placeBidSubmit.inProgress">
                      <p>Placing Bid</p>
                    </loading-icon>
                    <div class="result-failed" v-if="placeBidSubmit.result == 'error'">
                      <p>{{ placeBidSubmit.response.error }}</p>
                    </div>
                    <button :disabled="invalid">Place Bid</button>
                  </div>
                </form>
              </validation-observer>
            </div>

            <div class="stage-panel" v-if="auction && !auction.viewerIsSeller && isPastEndTime && !isClosed">
              <h3>Close</h3>
              <p>The auction is past it's "Target Close" datetime and can be closed by anyone. As long as it hasn't been closed, bids will still be accepted</p>
              <!-- Close Auction for non owners -->
              <dl>
                <loading-icon v-if="closeAuctionSimpleNOSubmit.inProgress">
                  <p>Closing Auction</p>
                </loading-icon>
                <div class="result-failed" v-if="closeAuctionSimpleNOSubmit.result == 'error'">
                  <p>{{ closeAuctionSimpleNOSubmit.response.error }}</p>
                </div>
                <dd><button @click="closeAuctionSimpleNO">Close This Auction</button></dd>
              </dl>
            </div>
          </div>
        </block>
      </column>
      <column>
        <block>
          <div v-show="!vkViewingKey" class="stage-panel full-width">
            <h3>Viewing Key Missing</h3>
            <vkeys-address v-model="vkViewingKey" :account="keplrAccount" :contract="$auctions.factoryAddress">
              <template v-slot:description>
                <small>You will need a viewing key in order to view non-public auction details.</small>
              </template>
            </vkeys-address>
          </div>
        </block>
      </column>
    </page>
  </default-layout>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value/*, max_decimals */} from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

import { Decimal } from 'decimal.js';
import moment from 'moment';

import AuctionItem from "../../components/AuctionItem.vue";
import TokenAmount from '../../components/TokenAmount.vue';
import LoadingIcon from '../../components/LoadingIcon.vue';
import VkeysAddress from '../../components/VkeysAddress.vue';

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
  components: {ValidationObserver, ValidationProvider, KeplrAccount, TokenAmount, LoadingIcon, VkeysAddress, AuctionItem},
  data() {
    return {
      logCount: 0,
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
      vkViewingKey: null,

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

      manageAuctionFormState: null,

      placeBidSubmit: {
        inProgress: false,
        result: null,
        response: {} 
      },

      retractBidSubmit: {
        inProgress: false,
        result: null,
        response: {} 
      },

      closeAuctionSimpleNOSubmit: {
        inProgress: false,
        result: null,
        response: {} 
      },

      closeAuctionSimpleSubmit: {
        inProgress: false,
        result: null,
        response: {}
      },

      closeAuctionWithOptionsSubmit: {
        inProgress: false,
        result: null,
        response: {}
      },

      changeAskingPriceSubmit: {
        inProgress: false,
        result: null,
        response: {}
      },
    };
  },
  watch: {
    async vkViewingKey(newValue, oldValue) {
      if(newValue) {
        this.$auctions.updateAuctionBidDetails(this.$route.params.address,this.keplrAccount,this.vkViewingKey.key);
      }
    }
  },
  async mounted () {
    await this.$auctions.updateAuction(this.$route.params.address);
    await this.$auctions.updateAllAuctions();
    this.getAuction()
    this.updateEndTime();
    this.interval = setInterval(this.updateEndTime, 1000);
  },
  destroyed () {
      clearInterval(this.interval);
  },
  computed: {
    auction: function() {
      return this.$auctions.getAuction(this.$route.params.address);
    },
    bidAmount: function() {
      return new Decimal(this.placeBidForm.bidPrice).times(this.auction.sell.decimalAmount).toFixed(this.auction.bid.decimals).replace(/\.?0+$/,"");
    },
    updateAskingPriceFormMinimumBid: function () {
      return new Decimal(this.updateAskingPriceForm.askingPrice).times(this.auction.sell.decimalAmount).toFixed(this.auction.bid.decimals).replace(/\.?0+$/,"");
    },
    closeAuctionFormMinimumBid: function () {
      return new Decimal(this.closeAuctionForm.askingPrice).times(this.auction.sell.decimalAmount).toFixed(this.auction.bid.decimals).replace(/\.?0+$/,"");
    },
    winningBidPrice: function () {
      return this.auction.bid.decimalWinner / this.auction.sell.decimalAmount;
    },
    formBidAmountToFractional: function () {
      return new Decimal(this.formBidAmount).times(Decimal.pow(10, this.auction.bid.decimals))
    },
    closedAuctionFromEndTimeString: function() {
      return moment(this.closeAuctionForm.endTime).format("YYYY-MM-DD HH:mm:ss");
    },
    bidInfoAmountFromFractional: function() {
      return new Decimal(this.auction.currentBid?.amount).dividedBy(Decimal.pow(10, this.auction.bid.decimals)).toFixed(this.auction.bid.decimals).replace(/\.?0+$/,"")
    },
    currentBidPrice: function () {
      return this.auction.currentBid?.decimalAmount / this.auction.sell.decimalAmount; 
    },
    endTimeString: function () {
      return moment(new Date(this.auction.endsAt)).format("YYYY-MM-DD HH:mm:ss");
    },
    isPastEndTime: function () {
      return moment(new Date(this.auction.endsAt)).isBefore()
    },
    isClosed: function () {
      return this.auction?.status != 'ACTIVE';
    }
  },
  methods: {
    async placeBid() {
      this.manageAuctionFormState = null;
      this.placeBidSubmit.result = null;
      this.placeBidSubmit.inProgress = true;
      const bidAmountToFractional = new Decimal(this.bidAmount).times(Decimal.pow(10, this.auction.bid.decimals));
      this.placeBidSubmit.response = await this.$auctions.placeBid(this.auction.bid.contract, this.auction.address, (new Decimal(bidAmountToFractional).toFixed(0)));
      this.placeBidSubmit.inProgress = false;
      //console.log("placeBid", this.placeBidSubmit.response)
      if(this.placeBidSubmit.response.bid?.status == 'Failure' || this.placeBidSubmit.response.error) {
        this.placeBidSubmit.result = "error"
      } else {
        this.placeBidSubmit.result = "success"
      }
      //this.$auctions.updateAuctionBidDetails(this.$route.params.address,this.keplrAccount,this.vkViewingKey.key); // can I remove this? reactivity issue?
    },
    async retractBid() {
      this.manageAuctionFormState = null;
      this.retractBidSubmit.result = null;
      this.retractBidSubmit.inProgress = true;
      this.retractBidSubmit.response = await this.$auctions.retractBid(this.auction.address);
      this.retractBidSubmit.inProgress = false;
      if(this.retractBidSubmit.response.retractBid?.status == 'Failure' || this.retractBidSubmit.response.error) {
        this.retractBidSubmit.result = "error"
      } else {
        this.retractBidSubmit.result = "success"
      }
      //this.$auctions.updateAuctionBidDetails(this.$route.params.address,this.keplrAccount,this.vkViewingKey.key);
    },
    async updateAskingPrice() {
      const newMinimumBidAmount = new Decimal(this.updateAskingPriceFormMinimumBid).times(Decimal.pow(10, this.auction.bid.decimals));
      this.changeAskingPriceSubmit.result = null;
      this.changeAskingPriceSubmit.inProgress = true;
      this.changeAskingPriceSubmit.response = await this.$auctions.changeMinimumBid(this.auction.address, newMinimumBidAmount);
      this.changeAskingPriceSubmit.inProgress = false;
      if(this.changeAskingPriceSubmit.response.retractBid?.status == 'Failure' || this.changeAskingPriceSubmit.response.error) {
        this.changeAskingPriceSubmit.result = "error"
      } else {
        this.changeAskingPriceSubmit.result = "success"
        this.manageAuctionFormState = null;
      }
    },
    async closeAuctionSimpleNO() {
      this.closeAuctionSimpleNOSubmit.result = null;
      this.closeAuctionSimpleNOSubmit.inProgress = true;
      this.closeAuctionSimpleNOSubmit.response = await this.$auctions.closeAuction(this.auction.address)
      this.closeAuctionSimpleNOSubmit.inProgress = false;
      if(this.closeAuctionSimpleNOSubmit.response.close_auction?.status == 'Failure' || this.closeAuctionSimpleNOSubmit.response.error) {
        this.closeAuctionSimpleNOSubmit.result = "error"
      } else {
        this.closeAuctionSimpleNOSubmit.result = "success"
        this.manageAuctionFormState = null;
      }
    },
    async closeAuctionSimple() {
      this.manageAuctionFormState = 'closeAuction'
      this.closeAuctionSimpleSubmit.result = null;
      this.closeAuctionSimpleSubmit.inProgress = true;
      this.closeAuctionSimpleSubmit.response = await this.$auctions.closeAuction(this.auction.address)
      this.closeAuctionSimpleSubmit.inProgress = false;
      if(this.closeAuctionSimpleSubmit.response.error) {
        this.closeAuctionSimpleSubmit.result = "error"
      } else {
        this.closeAuctionSimpleSubmit.result = "success"
        this.manageAuctionFormState = null;
      }
    },
    async closeAuctionWithOptions() {
      this.closeAuctionWithOptionsSubmit.result = null;
      this.closeAuctionWithOptionsSubmit.inProgress = true;
      const newMinimumBidAmount = this.closeAuctionFormMinimumBid * Math.pow(10, this.auction.bid.decimals);
      const endTime = Math.round(this.closeAuctionForm.endTime.getTime() / 1000)
      this.closeAuctionWithOptionsSubmit.response = await this.$auctions.closeAuctionWithOptions(this.auction.address, endTime, new Decimal(newMinimumBidAmount).toFixed(0))
      this.closeAuctionWithOptionsSubmit.inProgress = false;
      if(this.closeAuctionWithOptionsSubmit.response.error) {
        this.closeAuctionWithOptionsSubmit.result = "error"
      } else {
        this.closeAuctionWithOptionsSubmit.result = "success"
        this.manageAuctionFormState = null;
      }
    },
    async getAuction() {
      this.placeBidForm.bidPrice = this.auction.price;
      this.updateAskingPriceForm.askingPrice = this.auction.price;
      this.closeAuctionForm.askingPrice = this.auction.price;
      this.updateAskingPriceForm.minimumBidAmount = this.auction.bid.decimalMinimum;
    },
    updateEndTime() {
        this.closeAuctionForm.endTime = new Date((new Date()).getTime() + (Number(this.closeAuctionForm.endTimeAmount || 1) * Number(this.closeAuctionForm.endTimeUnit) * 60000));
    }
  }
};
</script>

<style lang="scss" scoped>

.forms-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

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
  width: 48%;
    border: 1px solid #2E323C;
    background-color: #0D1017;

  &.full-width {
    width: 100%
  }
    .flex {
      display: flex;

      &.close-auction-buttons {
        justify-content: space-between;
        button {
          margin-right: 25px;
        }
      }

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

    .closed-return {
      float: right;
      margin-top: -34px;
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

.result-failed {
  p {
  color: red;
  }
}


</style>