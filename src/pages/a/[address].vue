<template>
  <page>
    <column class="auction__header" v-if="auction">
      <block>
        <auction-item :auction="auction" class="list selected"></auction-item>
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
          <div v-if="auction.status == 'ACTIVE' && auction.currentBid">
            <h5>Current Bid</h5>
            <dl>
              <dd>
                {{ auction.currentBid.decimalAmount }} {{ auction.bid.denom }} <!-- <span style="font-size: 13px" v-if="sellAmountFromFractional != 1">({{ bidInfoAmountFromFractional }} {{ auctionInfo.bid_token.token_info.symbol }})</span> -->
              </dd>
            </dl>
          </div>

          <auction-place-bid @place="placedBid" :auction="auction"></auction-place-bid>

          <auction-retract-bid @retract="retractedBid" :auction="auction"></auction-retract-bid>

          <h4>Private</h4>
          <keplr-user v-model="account" :hidden="true"></keplr-user>
          <vkeys-address class="auction__vkeys" v-model="viewingKey" :contract="$auctions.factoryAddress" :account="account">
            <template v-slot:description>
              <small>You will need a viewing key in order to view non-public auction details.</small>
            </template>
          </vkeys-address>

        </div>
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
import AuctionPlaceBid from '../../components/AuctionPlaceBid.vue';
import AuctionRetractBid from '../../components/AuctionRetractBid.vue';
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
  components: { AuctionItem, VkeysAddress, KeplrUser, LoadingIcon, AuctionRetractBid, AuctionPlaceBid },
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
    await this.$auctions.updateAllAuctions();
  },
  methods: {
    placedBid(auction) {
      // Totally optional
    },
    retractedBid(auction) {
      // Totally optional
    },
  },
};
</script>

<style lang="scss">

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
