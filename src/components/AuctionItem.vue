<template>
  <div class="auction" :class="['theme-' + auction.color, { closed: auction.closed}]">
    <router-link v-if="!auction.closed" :to="'/auctions/' + auction.address" class="button auction__bid">Bid</router-link>
    <h3>
      <span class="sell-denom">{{ auction.sell.denom }}</span> -> 
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>

    <dl>
      <dt>Sell</dt>
      <dd>{{ auction.sell.humanAmount }} <span class="denom">{{ auction.sell.denom }}</span></dd>
    </dl>

    <dl v-if="!auction.closed">
      <dt>Minimum bid</dt>
      <dd>{{ auction.bid.humanMinimum }} <span class="denom">{{ auction.sell.denom }}</span></dd>
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

@import "@lkmx/flare/src/functions/respond-to";

.auction {
  background-color: var(--color-black);
  padding: var(--f-gutter);
  padding-bottom: 0;
  border-radius: 10px;
  position: relative;
  transition: background-color 0.7s;
  
  &:not(.closed) {
    border: 1px solid rgba(255,255,255,0.41);

    &:hover {
      border-color: var(--theme-washed-color);
      background-color: black;

      .auction__bid {
        color: var(--theme-anti-color);
        background-color: var(--theme-color);
        transition: opacity 0.5s;

        opacity: 1;
      }
    }
  }


  display: grid;
  &.grid {
    .auction__bid {
      opacity: 0;
    }
  }
  &.list {
    align-items: center;

    @include respond-to("<=s") {
      grid-auto-flow: row;
      grid-template-columns: 1fr;
    }
    @include respond-to(">=m") {
      grid-auto-flow: column;
      grid-template-columns: 200px 200px 1fr;
    }

    grid-template-columns: 200px 200px 1fr;

    .auction__bid {
      opacity: 0.3;
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

  .denom {
    font-size: 10px;
    font-weight: bold;
  }

  &__bid {
    cursor: pointer;

    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;
    padding-left: var(--f-gutter-l);
    padding-right: var(--f-gutter-l);
    background-color: var(--theme-color);

    transition: opacity 2s;
  }
}
</style>