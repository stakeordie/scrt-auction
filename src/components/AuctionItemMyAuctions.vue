<template>
  <g-link :to="to" class="auction" v-if="auction"
    :class="['theme-' + auction.color, 'status-' + auction.status.toLowerCase()]">
    <p class="auction__pair">
      <span class="sell-denom">{{ auction.sell.denom }}</span>
      <span v-if="auction.bid">
        /
        <span class="bid-denom">{{ auction.bid.denom }}</span>
      </span>
    </p>

    <dl class="auction__sell">
      <dd>
        <token-amount :amount="auction.sell.decimalAmount" :decimals="auction.sell.decimals"
          :denom="auction.sell.denom"></token-amount>
      </dd>
    </dl>

    <div class="auction__bid-price">
      <dl class="auction__bid" v-if="table == 'active'">
        <dd class="auction__asking-price">
          <token-amount :amount="auction.bid.decimalAskingPrice" :decimals="auction.bid.decimals" :denom="auction.bid.denom">
          </token-amount>
          <span v-if="auction.sell.decimalAmount != 1"></span><br><span
            v-if="auction.sell.decimalAmount != 1"><span>({{ auction.bid.decimalMinimumBid}} Total)</span></span>
        </dd>
      </dl>
      <dl v-if="table == 'closed'">
        <dd class="auction__winner">
          <token-amount :amount="auction.bid.decimalWinningBidPrice" :decimals="auction.bid.decimals" :denom="auction.bid.denom">
          </token-amount>
          <span v-if="auction.sell.decimalAmount != 1"></span><br><span
            v-if="auction.sell.decimalAmount != 1"><span>({{ auction.bid.decimalWinner}} Total)</span></span>
        </dd>
      </dl>
    </div>

    <dl v-if="table == 'active'">
      <dd :class="isEnded ? 'ended': ''">{{ endsAt }}</dd>
    </dl>

    <div v-if="table == 'closed'">
      <dl>
        <dd>{{ closedAt }}</dd>
      </dl>
    </div>

    <div class="auction__actions">
      <g-image src="@/assets/icon-actions.svg"></g-image>
    </div>

    <!-- <div class="auction__status">
      <div class="auction__status--status" :class="['auction__status--' + auction.status.toLowerCase()]">{{ auction.status }}</div>
      <div class="auction__status--user-status auction__status--user-seller" v-if="auction.viewerIsSeller">You are the auction owner</div>
      <div class="auction__status--user-status auction__status--user-bid" v-if="auction.viewerIsBidder && auction.viewerIsSeller">and you've placed a bid.</div>
      <div class="auction__status--user-status auction__status--user-bid" v-else-if="auction.viewerIsBidder">You've placed a bid.</div>
      <div class="auction__status--user-status auction__status--user-sold" v-if="auction.viewerWasSeller">You were the auction owner</div>
      <div class="auction__status--user-status auction__status--user-won" v-if="auction.viewerIsWinner && auction.viewerWasSeller">and you won it.</div>     
      <div class="auction__status--user-status auction__status--user-won" v-else-if="auction.viewerIsWinner">You won the auction</div>
    </div> -->

  </g-link>
</template>

<script>
  import TokenAmount from "./TokenAmount.vue"

  import moment from 'moment'

  export default {
    components: {
      TokenAmount
    },
    props: ["auction", "to", "tab", "table"],
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

    * {
      font-size: 14px;
      line-height: 20px;
    }

    &:hover {


      border-color: var(--theme-washed-color);


    }


    border: 1px solid #2E323C;
    background-color: #0D1017;


    text-decoration: none;
    padding: var(--f-gutter);
    border-radius: 0px;
    position: relative;
    transition: background-color 0.7s;

    &:not(.grid):not(.list) {
      display: none;
    }

    // Layout specific
    &.grid {
      display: grid;
      gap: var(--f-gutter);
      background: red;
    }

    &.list {
      display: grid;
      gap: var(--f-gutter);
      align-items: center;

      @include respond-to("<=s") {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-to(">=m") {
        grid-template-columns: repeat(5, 1fr);
      }

      dd {
        margin-bottom: 0;
        font-weight: normal;
      }

      .auction {
        &__pair {
          margin-bottom: 0;
        }

        &__bid-action {
          opacity: 0.3;
        }

        &__status {
          text-align: right;
        }

        &__actions {
          justify-self: end;
          padding-right: var(--f-gutter);
        }
      }
    }

  }
</style>