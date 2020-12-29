<template>
  <div class="auction">
    <span>{{ auction.pair }}</span>
    <span>{{ auction.sell_amount }}</span>
    <dl>
      <dt>Minimum bid</dt>
      <dd>{{ auction.minimum_bid }}</dd>
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
  props: ["auction"],
};
</script>

<style lang="scss" scoped>
.auction {
  display: grid;
  padding: var(--f-gutter-s);
  border: 1px solid white;
  border-radius: 22px;
  position: relative;

  &__bid {
    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;
  }
}
</style>
