<template>
  <div class="auction" :class="['theme-' + auction.sell.color, { closed: auction.closed}]">
    <router-link v-if="!auction.closed" :to="'/auctions/' + auction.address" class="button auction__bid">Bid</router-link>
    <h3>
      <span class="sell-denom">{{ auction.sell.denom }}</span> -> 
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>

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
  background-color: var(--color-black);
  padding: var(--f-gutter);
  padding-bottom: 0;
  border-radius: 10px;
  position: relative;
  transition: background-color 0.7s;

  display: grid;
  &.grid {
    .auction__bid {
      opacity: 0;
    }
  }
  &.list {
    grid-auto-flow: column;
    grid-template-columns: 200px 200px 1fr;
    align-items: center;
    .auction__bid {
      opacity: 0.2;
    }
  }

  &:not(.closed) {
    border: 0.5px solid rgba(255,255,255,0.41);
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
    cursor: pointer;

    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;
    padding-left: var(--f-gutter-l);
    padding-right: var(--f-gutter-l);
    background-color: var(--theme-color);

    transition: opacity 3s;
  }

  &:hover {
    background-color: black;

    .auction__bid {
      color: var(--theme-anti-color);
      background-color: var(--theme-color);
      transition: opacity 0.5s;

      opacity: 1;
    }
  }
}
</style>