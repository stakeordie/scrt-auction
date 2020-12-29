<template>
  <div class="auction">
    <span>{{ auction.pair }}</span>
    <span>{{ auction.sell_amount }}</span>
    <span>{{ auction.minimum_bid }}</span>
    <span>{{ auction.label }}</span>
    <button @click="bidHide = true">BID</button>
    <input type="text" v-show="bidHide" v-model="bidAmount" />
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
  data() {
    return {
      bidAmount: 0,
      bidHide: false,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.auction {
  display: grid;
  border: 1px solid white;
  border-radius: 22px;
}
</style>
