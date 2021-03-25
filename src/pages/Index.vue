<template>
<landing-layout>
<columns class="intro" mode="normal" mode-m="full" number="2" number-m="1" number-s="1">
  <block>
    <h1 class="mega">Bid and sell at the best prices on the market</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <button @click="$router.push('/auctions')" class="white">Enter App</button>
  </block>
  <block>
    <img src="@/assets/illustration-landing.svg" alt="">
  </block>
</columns>
</landing-layout>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue';

import ListLayout from '../layouts/ListLayout.vue';

export default {
  components: { AuctionItem, ListLayout }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  computed: {
    auctionsFilter() {
      return this.$store.state.$auctions.auctionsFilter;
    },
    ...mapGetters("$auctions", [
      "activeAuctions",
    ])
  },
  mounted() {
    this.$auctions.updateActiveAuctions();
  },
  // methods: {
  //   clearFilters() {
  //     this.auctionsFilter.sellToken = "";
  //     this.auctionsFilter.bidToken = "";
  //   },
  // }
}
</script>

<style lang="scss">

@import "@lkmx/flare/src/functions/respond-to";

.intro {
  align-items: center;
  @include respond-to("<=m") {
      align-items: center;
  }
  @include respond-to("<=s") {
      padding-top: var(--f-gutter);
      align-items: start;
    }
  .--flare-block {
    .content {
      @include respond-to(">=xxxl") {
        width: 1000px;
      }
    }
  }
  h1 {
    &.mega {
      font-size: 56px;
      @include respond-to(">=xxxl") {
        font-size: var(--f-gutter-xxxl);
        margin-bottom: var(--f-gutter-xl);
      }
    }
  }
  p {
    @include respond-to(">=xxxl") {
      font-size: var(--f-gutter-xl);
      margin-bottom: var(--f-gutter-xl);
     }
  }
  button {
    @include respond-to(">=xxxl") {
      padding: var(--f-gutter-xl);
      font-size: var(--f-gutter-xl);
     }
  }
  button {
    &.white {
      background-color:white;
      color:black;
      cursor: pointer;
      &:hover {
        background-color:lightgray;
      }
    }
  }
  img {
    @include respond-to(">=xxxl") {
      height: 600px;
      width: auto;
    }
    @include respond-to("<=m") {
      display: none;
    }
  }
}
</style>
