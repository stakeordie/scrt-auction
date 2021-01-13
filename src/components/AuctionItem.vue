<template>
  <div class="auction" :class="{ closed: auction.closed }">
    <h3>{{ auction.pair }}</h3>
    <span>{{ auction.sell.humanAmount }}</span>

    <dl v-if="!auction.closed">
      <dt>Minimum bid</dt>
      <dd>{{ auction.bid.humanAmount }}</dd>
    </dl>
    
    <dl v-if="auction.winning">
      <dt>Winning Bid</dt>
      <dd>{{ auction.winning.humanAmount }}</dd>
    </dl>
    <span>{{ auction.label }}</span>
    <router-link v-if="!auction.closed" :to="'/auctions/' + auction.address" class="button auction__bid">Bid</router-link>
  </div>
</template>

<script>
export default {
  props: ["auction"]
};
</script>

<style lang="scss" scoped>
.auction {
  display: grid;
  background-color: black;
  padding: var(--f-gutter);
  border: 0.5px solid rgba(255,255,255,0.41);
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