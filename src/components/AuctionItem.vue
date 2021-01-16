<template>
  <div class="auction" :class="['theme-' + auction.color, { closed: auction.closed}]">

    <router-link class="auction__bid-action button" v-if="!auction.closed" :to="'/auctions/' + auction.address"
      :class="'theme-' + auction.color2">Bid</router-link>

    <h3 class="auction__pair">
      <span class="sell-denom">{{ auction.sell.denom }}</span> -> 
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>

    <dl class="auction__sell">
      <dt>Sell</dt>
      <dd><span class="amount">{{ auction.sell.humanAmount }}</span> <span class="denom">{{ auction.sell.denom }}</span></dd>
    </dl>

    <dl class="auction__bid" v-if="!auction.closed">
      <dt>Minimum bid</dt>

      <dd><span class="amount">{{ auction.bid.humanMinimum }}</span> <span class="denom">{{ auction.sell.denom }}</span></dd>
    </dl>
    
    <dl class="auction__winner" v-if="auction.winning">
      <dt>Winning Bid</dt>
      <dd>{{ auction.winning.humanAmount }}</dd>
    </dl>

    <dl class="auction__label">
      <dt>Label</dt>
      <dd>{{ auction.label }}</dd>
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
  border-radius: 10px;
  position: relative;
  transition: background-color 0.7s;

  h3, dd {
    margin-bottom: 0;
    line-height: 1em;
  }
  
  &:not(.closed) {
    border: 1px solid rgba(255,255,255,0.41);

    &:hover {
      border-color: var(--theme-washed-color);
      background-color: black;

      .auction__bid-action {
        opacity: 1;
        transition: opacity 0.5s, background-color 0.5s;
      }
    }
  }

  &__bid-action {
    cursor: pointer;

    color: var(--theme-anti-color);
    background-color: var(--theme-color);

    top: var(--f-gutter-s);
    right: var(--f-gutter-s);
    position: absolute;
    padding-left: var(--f-gutter-l);
    padding-right: var(--f-gutter-l);

    transition: opacity 2s;
  }

  &__pair {
    margin: 0;
    margin-bottom: var(--f-gutter);
  
    .sell-denom, .bid-denom {
      color: var(--theme-washed-color);
    }
  }

  &.grid {
    display: grid;

    .auction__bid-action {
      opacity: 0;
    }
  }

  &.list {
    display: grid;

    .auction__bid-action {
      opacity: 0.3;
    }

    @include respond-to("<=s") {
      grid-auto-flow: row;
      grid-template-columns: 1fr;
    }
    @include respond-to(">=m") {
      grid-auto-flow: column;
      grid-template-columns: 320px 200px 1fr;
    }
    
  }
}
</style>