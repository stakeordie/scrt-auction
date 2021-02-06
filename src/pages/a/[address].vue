<template>
  <page>
    <column class="auction__header">
      <block>
        <auction-item :auction="auction" class="list selected">
          <div class="auction__status">ACTIVE</div>
        </auction-item>
      </block>
    </column>
    <column class="auction__body" number="2" weight-l="left" number-s="1">
      <block>
        <div class="auction__info">
          <dl>
            <dt>Address</dt>
            <dd>secret123123123123123</dd>
          </dl>
        </div>
        <div class="auction__description">
          <p>This is the description with markdown and emoji support!!!</p>
        </div>
      </block>
      <block>
        <div class="auction__actions">
          <button>Test</button>
          <button>Test</button>
          <button>Test</button>
        </div>
      </block>
    </column>
  </page>
</template>

<script>
import AuctionItem from "../../components/AuctionItem.vue";
export default {
  watch: {},
  components: { AuctionItem },
  computed: {
    auction() {
      return this.$auctions.getAuction(this.$route.params.address);
    },
  },
  async mounted() {
    await this.$auctions.updateAuction(this.$route.params.address);
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
  }

  &__info, &__description {
    padding: 0 var(--f-gutter);
  }

  &__actions {
    button {
      width: 100%;
    }
  }
}
</style>
