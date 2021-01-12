<template>
  <div class="auction">
    <h3>{{ auction.pair }}</h3>
    <span>{{ (auction.sell_amount / Math.pow(10, auction.sell_decimals)).toFixed(7) }}</span>
    <dl v-if="!closed">
      <dt>Minimum bid</dt>
      <dd>{{ auction.minimum_bid / Math.pow(10, auction.bid_decimals) }}</dd>
    </dl>
    <dl v-if="closed">
      <dt>Winning Bid</dt>
      <dd>{{ auction.winning_bid / Math.pow(10, auction.bid_decimals) }}</dd>
    </dl>
    <span>{{ auction.label }}</span>
    <router-link :to="'/auctions/' + auction.address" class="button auction__bid">Bid</router-link>
    <!--
      ------
        - Auction Header
          - Pair (dynamic)
          - Amount (dynamic)
        - Bid Button
      ------
        - Auction Footer
          - "Min Bid"
          - minimum bid (dynamic)
    -->
  </div>
</template>

<script>
export default {
  props: ["auction", "closed"]
};
</script>

<style lang="scss" scoped>
.auction {
  display: grid;
  background-color: black;
  padding: var(--f-gutter);
  border: 1px solid white;
  border-radius: 10px;
  position: relative;

  h3 {
    margin: 0;
  }

  &__bid {
    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;
  }
}
</style>
