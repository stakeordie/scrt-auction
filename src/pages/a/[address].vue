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
          <keplr-user v-model="account" :hidden="true"></keplr-user>
          <vkeys-address class="auction__vkeys" :contract="$auctions.factoryAddress" :account="account">
            <template v-slot:description>
              <small>You will need a viewing key in order to view non-public auction details.</small>
            </template>
          </vkeys-address>
          <button>Test</button>
          <button>Test</button>
          <button>Test</button>
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
export default {
  data() {
    return {
      account: null
    }
  },
  components: { AuctionItem, VkeysAddress, KeplrUser },
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
    await this.$auctions.updateActiveAuctions();
  },
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

  &__info, &__description {
    padding: 0 var(--f-gutter);
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
