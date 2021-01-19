<template>
  <div class="auction" :class="['theme-' + auction.color, { closed: auction.closed}]">

    <dl class="auction__label">
      <dd>{{ auction.label }}</dd>
    </dl>

    <dl class="auction__closing-time">
      <dd>{{ auction.label }}</dd>
    </dl>

    <h3 class="auction__pair">
      <span class="sell-denom">{{ auction.sell.denom }}</span> -> 
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>

    <h2 class="auction__sell"><token-amount :amount="auction.sell.decimalAmount" :decimals="auction.sell.decimals" :denom="auction.sell.denom"></token-amount></h2>

    <dl class="auction__bid" v-if="!auction.closed">
      <dt>Minimum bid</dt>
      <dd>
        <token-amount :amount="auction.bid.decimalMinimum" :decimals="auction.bid.decimals" :denom="auction.bid.denom"></token-amount>
      </dd>
    </dl>

    <router-link class="auction__bid-action button" v-if="!auction.closed" :to="'/auctions/' + auction.address"
      :class="'theme-' + auction.color2">Bid</router-link>
    
    <dl class="auction__winner" v-if="auction.winning">
      <dt>Winning Bid</dt>
      <dd>
        <token-amount :amount="auction.winning.decimalAmount" :decimals="auction.bid.decimals" :denom="auction.bid.decimalAmount"></token-amount>
        </dd>
    </dl>
  </div>
</template>

<script>
import TokenAmount from "./TokenAmount.vue"

export default {
  components: { TokenAmount },
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

  h2, h3, dd {
    margin-bottom: 0;
    line-height: 1em;
  }
  
  &:not(.closed) {
    border: 1px solid rgba(255,255,255,0.5);

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

    padding-left: var(--f-gutter-l);
    padding-right: var(--f-gutter-l);

    transition: opacity 2s;

    margin-bottom: 0;
  }

  &__pair {
    margin: 0;
    margin-bottom: var(--f-gutter);
  
    .sell-denom, .bid-denom {
      color: var(--theme-washed-color);
    }
  }

  // Layout specific

  &.grid {
    display: grid;
    gap: var(--f-gutter);

    .auction__bid-action {
      opacity: 0.1;
    }
  }

  &.list {
    display: grid;
    gap: var(--f-gutter);
    grid-template-columns: repeat(3, 1fr) 100px;
    align-items: center;

    .auction {
      &__bid-action {
        opacity: 0.3;
      }
  
      &__label {
        grid-column: 1 / span 3;
        grid-row: 2 / 3;
      }
    }
  }
}
</style>