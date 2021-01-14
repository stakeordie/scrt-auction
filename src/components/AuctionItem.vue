<template>
  <div class="auction" :class="['theme-' + auction.sell.color, { closed: auction.closed}]">
    <h3>
      <span class="sell-denom">{{ auction.sell.denom }}</span> -> 
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>
    <router-link v-if="!auction.closed" :to="'/auctions/' + auction.address" class="button auction__bid">Bid</router-link>
    <dl>
      <dt>Sell</dt>
      <dd>{{ auction.sell.humanAmount }} {{ auction.sell.denom }}</dd>
    </dl>

    <dl v-if="!auction.closed">
      <dt>Minimum bid</dt>
      <dd>{{ auction.bid.humanMinimum }} {{ auction.bid.denom }}</dd>
    </dl>
    
    <dl v-if="auction.winning">
      <dt>Winning Bid</dt>
      <dd>{{ auction.winning.humanAmount }}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: ["auction"]
};
</script>

<style lang="scss" scoped>
.auction {
  background-color: black;
  display: grid;
  padding: var(--f-gutter);
  border-radius: 10px;
  position: relative;
  transition: background-color 1s;

  &:not(.closed) {
    border: 0.5px solid rgba(255,255,255,0.41);
  }

  &:hover {
    .auction__bid {
      color: var(--theme-anti-color);
      background-color: var(--theme-color);
    }
  }

  h3 {
    margin: 0;
    margin-bottom: var(--f-gutter);
  
    .sell-denom {
      color: var(--theme-washed-color);
    }
    .bid-denom {
      color: var(--theme-washed-color);
    }
  }

  &__bid {
    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;

    cursor: pointer;
  }
}
</style>