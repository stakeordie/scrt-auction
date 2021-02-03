<template>
  <div class="auction" :class="['theme-' + auction.color, { closed: auction.closed}]">
    <div class="auction__emoji">
      {{ String.fromCodePoint(auction.emoji) }}
    </div>

    <h3 class="auction__pair">
      <span class="sell-denom">{{ auction.sell.denom }}</span> /
      <span class="bid-denom">{{ auction.bid.denom }}</span>
    </h3>

    <dl class="auction__sell">
      
      <dt>For Sale</dt>
      <dd>
        <token-amount :amount="auction.sell.decimalAmount" :decimals="auction.sell.decimals" :denom="auction.sell.denom"></token-amount>
      </dd>
    </dl>

    <dl class="auction__bid" v-if="!auction.closed">
      <dt>Asking price</dt>
      <dd>
        <token-amount :amount="auction.price" :decimals="auction.bid.decimals" :denom="auction.bid.denom" suffix="per Token"></token-amount>
      </dd>
    </dl>

    <dl class="auction__closing-time">
      <dt>Target Close</dt>
      <dd>{{ targetClose }}</dd>
    </dl>

    
    <dl class="auction__winner" v-if="auction.winning">
      <dt>Winning Bid</dt>
      <dd>
        <token-amount :amount="auction.winning.decimalAmount" :decimals="auction.bid.decimals" :denom="auction.bid.decimalAmount"></token-amount>
      </dd>
    </dl>

    <router-link class="auction__bid-action button" v-if="!auction.closed" :to="'/auctions/' + auction.address"
      :class="'theme-' + auction.color2">Bid</router-link>
  </div>
</template>

<script>
import TokenAmount from "./TokenAmount.vue"

import moment from 'moment'

export default {
  components: { TokenAmount },
  props: ["auction"],
  computed: {
    targetClose() {
      return moment(this.auction.endsAt).format("YYYY-MM-DD HH:mm:ss");
    }
  }
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

  h2, h3 {
    margin-bottom: 0;
    line-height: 1em;
  }

  small {
    display: inline-block;
    font-size: 0.9em;
    margin-bottom: 0;
  }
  
  &:not(.closed) {
    border: 1px solid transparent;

    &:hover {
      border: 1px solid var(--theme-washed-color);
      background-color: black;

      .auction {
        &__bid-action, &__bid, &__closing-time {
          opacity: 1;
          transition: opacity 0.5s, background-color 0.5s;
        }
      }
    }
  }

  &__emoji {
    font-size: 40px;
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

    .sell-denom {
      font-size: 115%;
    }

    .bid-denom {
      font-size: 85%;
    }
  
    .sell-denom, .bid-denom {
      color: var(--theme-washed-color);
    }
  }

  &__closing-time {
    opacity: 0.3;
  }

  &__sell {
    font-size: 22px;
  }

  // Layout specific

  &.grid {
    display: grid;
    gap: var(--f-gutter);

    .auction__emoji {
      position: absolute;
      top: var(--f-gutter-l);
      right: var(--f-gutter-l);
    }

    .auction__bid-action {
      opacity: 0.1;
      position: absolute;
      bottom: var(--f-gutter);
      right: var(--f-gutter);
    }
  }

  &.list {
    display: grid;
    gap: var(--f-gutter);
    grid-template-columns: 50px repeat(4, 1fr) 100px;
    align-items: center;

    dd {
      margin-bottom: 0;
    }

    .auction {
      &__bid-action {
        opacity: 0.3;
      }
    }
  }
}
</style>