<template>
  <g-link :to="to" class="auction" v-if="auction" :class="['theme-' + auction.color, 'status-' + auction.status.toLowerCase()]">
    <div class="auction__emoji">
      <g-image :immediate="true" :src="require(`!!assets-loader!@/assets/token-icons/${auction.sell.iconImg}`)"></g-image>
      <!-- {{ String.fromCodePoint(auction.emoji) }} -->
    </div>

    <h3 class="auction__pair">
      <span class="sell-denom">{{ auction.sell.denom }}</span>
      <span v-if="auction.bid">
        /
        <span class="bid-denom">{{ auction.bid.denom }}</span>
      </span>
    </h3>

    <dl class="auction__sell">
      <dt>For Sale</dt>
      <dd>
        <token-amount :amount="auction.sell.decimalAmount" :decimals="auction.sell.decimals" :denom="auction.sell.denom"></token-amount>
      </dd>
    </dl>

    <div class="auction__bid-price">
      <dl class="auction__bid" v-if="auction.bid && auction.price">
        <dt>Asking price</dt>
        <dd class="auction__asking-price">
          <token-amount :amount="auction.price" :decimals="auction.bid.decimals" :denom="auction.bid.denom"></token-amount>
          <span v-if="auction.sell.decimalAmount != 1"> per token </span><br><span v-if="auction.sell.decimalAmount != 1"><small>({{ auction.bid.decimalMinimum}} {{auction.bid.denom}})</small></span>
        </dd>
      </dl>
      <dl v-if="auction.bid && auction.bid.winner">
        <dt>Winning bid</dt>
        <dd class="auction__winner">
          <token-amount :amount="auction.bid.decimalWinner" :decimals="auction.bid.decimals" :denom="auction.bid.denom"></token-amount>
        </dd>
      </dl>
    </div>

    <dl v-if="auction.endsAt && !auction.closedAt">
      <dt>Target close</dt>
      <dd :class="isEnded ? 'ended': ''">{{ endsAt }}</dd>
    </dl>

    <div v-if="auction.closedAt">
      <dl>
        <dt>Closed at</dt>
        <dd>{{ closedAt }}</dd>
      </dl>
    </div>

    <div class="auction__status">
      <div class="auction__status--status" :class="['auction__status--' + auction.status.toLowerCase()]">{{ auction.status }}</div>
      <div class="auction__status--user-status auction__status--user-seller" v-if="auction.viewerIsSeller">You are the auction owner</div>
      <div class="auction__status--user-status auction__status--user-bid" v-if="auction.viewerIsBidder && auction.viewerIsSeller">and you've placed a bid.</div>
      <div class="auction__status--user-status auction__status--user-bid" v-else-if="auction.viewerIsBidder">You've placed a bid.</div>
      <div class="auction__status--user-status auction__status--user-sold" v-if="auction.viewerWasSeller">You were the auction owner</div>
      <div class="auction__status--user-status auction__status--user-won" v-if="auction.viewerIsWinner && auction.viewerWasSeller">and you won it.</div>     
      <div class="auction__status--user-status auction__status--user-won" v-else-if="auction.viewerIsWinner">You won the auction</div>
    </div>

  </g-link>
</template>

<script>
import TokenAmount from "./TokenAmount.vue"

import moment from 'moment'

export default {
  components: { TokenAmount },
  props: ["auction", "to"],
  computed: {
    endsAt() {
      return moment(this.auction.endsAt).format("YYYY-MM-DD HH:mm:ss");
    },
    closedAt() {
      return moment(this.auction.closedAt).format("YYYY-MM-DD HH:mm:ss");
    },
    isEnded() {
      return moment(this.auction.endsAt).isBefore();
    }
  }
};
</script>

<style lang="scss" scoped>

@import "@lkmx/flare/src/functions/respond-to";

.auction {
  background-color: var(--color-black);

  &:hover {

    &:not(.status-closed) {
      border-color: var(--theme-washed-color);
    }

  }

  &:not(.status-closed) {
    border: 1px solid #2E323C;
    background-color: #0D1017;
  }

  text-decoration: none;
  padding: var(--f-gutter);
  border-radius: 10px;
  position: relative;
  transition: background-color 0.7s;

  h2, h3 {
    color: white;
    margin-bottom: 0;
    line-height: 1em;
  }

  small {
    display: inline-block;
    font-size: 0.9em;
    margin-bottom: 0;
  }
  

  &__emoji {
    font-size: 40px;
  }

  &__asking-price {
    font-size: 0.9em;
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
    
    .ended {
      color: var(--color-negative);
    }

  &__sell {
    font-size: 22px;
  }

  &__status {
    &--status {
      font-weight: bold;
    }
    &--user-status {
      color: var(--color-user-status);
      font-size: 0.9em;
    }
    &--active {
      color: var(--color-positive);
    }
    &--closed {
      color: var(--color-negative);
    }
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
  }

  &.list {
    display: grid;
    gap: var(--f-gutter);
    align-items: center;

    @include respond-to("<=s") {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond-to(">=m") {
      grid-template-columns: 40px repeat(5, 1fr);
    }

    dd {
      margin-bottom: 0;
    }

    .auction {
      &__bid-action {
        opacity: 0.3;
      }

      &__status {
        text-align: right;
      }
    }
  }

}
</style>