<template>
  <page>
    <column class="auction__header" v-if="auction">
      <block>
        <auction-item :auction="auction" class="list selected">
          <div class="auction__status" :class="{'active': auction.status == 'ACTIVE'}">{{auction.status}}</div>
        </auction-item>
      </block>
    </column>
    <column class="auction__body" v-if="auction" number="2" weight-l="left" number-s="1">
      <block>
        <div class="auction__info">
          <dl>
            <dt>Address</dt>
            <dd>{{ $route.params.address | abbrv }}</dd>
          </dl>
        </div>
        <div class="auction__description" v-html="description"></div>
      </block>
      <block>
        <div class="auction__actions">
          <h4>Details</h4>
          <h4>Private</h4>
          <keplr-user v-model="account" :hidden="true"></keplr-user>
          <vkeys-address class="auction__vkeys" v-model="viewingKey" :contract="$auctions.factoryAddress" :account="account">
            <template v-slot:description>
              <small>You will need a viewing key in order to view non-public auction details.</small>
            </template>
          </vkeys-address>
          <button>Test</button>
          <p v-show="auction.viewerIsSeller">You are the seller</p>
          <p v-show="auction.viewerIsBidder">You are a bidder</p>
        </div>
      </block>
      <!-- Place a Bid -->
      <block v-if="auction.status == 'ACTIVE'">
        <h2>Place a Bid</h2>
        <div class="stage-panel" v-if="auction.currentBid">
          <div>
            <h5>Current Bid</h5>
            <dl>
              <dd>
                {{ auction.currentBid.decimalAmount }} {{ auction.bid.denom }} <!-- <span style="font-size: 13px" v-if="sellAmountFromFractional != 1">({{ bidInfoAmountFromFractional }} {{ auctionInfo.bid_token.token_info.symbol }})</span> -->
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
        </div>
        <!-- <validation-observer v-slot="{ handleSubmit, invalid }">
          <form class="form" @submit.prevent="handleSubmit(placeBid)">
            <ul>
              <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
            </ul>
            <div class="form__frame">
              <validation-provider :rules="validationRules" v-slot="{ errors }">
                <label for="payment-amount">Bid Price Per Token</label>
                <span class="error">{{ errors[0] }}</span>
                <input name="payment-amount" type="text" v-model.trim="placeBidForm.bidPrice" />
              </validation-provider>
              <div class="bid-price-conversion">Total Bid Amount = {{ bidAmount }} {{auctionInfo.bid_token.token_info.symbol}}</div>
              <loading-icon v-if="placeBidSubmit.inProgress">
                <p>Placing Bid</p>
              </loading-icon>
              <div class="result-failed" v-if="placeBidSubmit.result == 'error'">
                <p>{{ placeBidSubmit.response.error }}</p>
              </div>
              <button :disabled="invalid">Place Bid</button>
            </div>
          </form>
        </validation-observer> -->
      </block>
    </column>
  </page>
</template>

<script>
import marked from "marked";
import AuctionItem from "../../components/AuctionItem.vue";
import VkeysAddress from '../../components/VkeysAddress.vue';
import KeplrUser from '../../components/KeplrUser.vue';
import LoadingIcon from '../../components/LoadingIcon.vue';
export default {
  metaInfo() {
    return {
      title: this.auction?.pair || 'Loading...',
    }
  },
  data() {
    return {
      account: null,
      viewingKey: null,

      retractBidSubmit: {
        inProgress: false,
        result: null,
        response: {} 
      },
    }
  },
  components: { AuctionItem, VkeysAddress, KeplrUser, LoadingIcon },
  watch: {
    viewingKey(newValue, oldValue) {
      if(newValue) {
        this.$auctions.updateAuctionBidDetails(this.$route.params.address,this.account,newValue.key);
      }
    }
  },
  computed: {
    auction() {
      return this.$auctions.getAuction(this.$route.params.address);
    },
    description() {
      return marked(this.auction.description || "");
    },
  },
  async mounted() {
    await this.$auctions.updateAuction(this.$route.params.address);
    await this.$auctions.updateAuctions();
  },
  methods: {
    async retractBid() {
      this.retractBidSubmit.result = null;
      this.retractBidSubmit.inProgress = true;
      this.retractBidSubmit.response = await this.$auctions.retractBid(this.auction.address);
      this.retractBidSubmit.inProgress = false;
      if(this.retractBidSubmit.response.retractBid?.status == 'Failure' || this.retractBidSubmit.response.error) {
        this.retractBidSubmit.result = "error"
      } else {
        this.retractBidSubmit.result = "success"
        this.$auctions.updateAuctionBidDetails(this.$route.params.address,this.account,this.viewingKey);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

@import "@lkmx/flare/src/functions/respond-to";

.auction {
  &__header {
    --f-columns-normal-width-l: var(--f-breakpoint-l);
    --f-columns-normal-width-xl: var(--f-breakpoint-xl);
    --f-columns-normal-width-xxl: var(--f-columns-normal-width-xl);
    --f-columns-normal-width-xxxl: var(--f-columns-normal-width-xl);
  }

  &__body {
    --f-columns-normal-width-l: var(--f-breakpoint-l);
    --f-columns-normal-width-xl: var(--f-columns-normal-width-l);
    --f-columns-normal-width-xxl: var(--f-columns-normal-width-l);
    --f-columns-normal-width-xxxl: var(--f-columns-normal-width-l);
  }

  &__status {
    font-weight: bold;

    @include respond-to("<=s") {
      justify-self: center;
    }
    @include respond-to(">=m") {
      padding: 0 var(--f-gutter-xl);
    }

    &.active {
      color: var(--color-positive);
    }
  }

  &__description {
    line-height: 1.5em;
  }

  &__vkeys {
    margin-bottom: var(--f-gutter);
  }

  &__actions {
    button {
      width: 100%;
    }
  }
}
</style>
