<template>
<landing-layout>
<columns class="intro" mode="normal" mode-m="full" number="2" number-s="1">
  <block>
    <h1 class="mega">Bid and sell at the best prices on the market</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <button class="white">Explore Secret Auctions</button>
  </block>
  <block>
    <img src="@/assets/illustration-landing.png" alt="">
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

.intro {
  align-items: center;
  h1 {
    &.mega {
      font-size: 56px;
    }
  }
  button {
    &.white {
      background-color:white;
      color:black;
      &:hover {
        background-color:lightgray;
      }
    }
  }
}
</style>
