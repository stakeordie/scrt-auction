<template>
<list-layout>
    <!-- Auctions grid -->
  <auction-item :to="'/auctions/' + auction.address" v-for="auction in activeAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
    
    <!-- Auctions empty -->
    <!-- Use v-show because currently flare doesn't deal well with conditional (v-if) autorenderred elements in the blocks -->
    <!-- <div class="auctions-empty" v-show="filteredAuctions.length == 0">
      <h2 v-if="auctionsFilter.sellToken || auctionsFilter.bidToken">
          No auctions were found <span v-if="auctionsFilter.sellToken"> selling <span class="sell-token">{{auctionsFilter.sellToken}}</span></span><span> looking for <span class="bid-token">{{auctionsFilter.bidToken}}</span> bidders</span>.
      </h2>
      <p><router-link :to="'/new'" class="button">Be the first one</router-link> or <a href="" @click="clearFilters()">clear your filters</a>.</p>
    </div> -->
</list-layout>
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

// <style lang="scss" scoped>
//   .auctions-empty {
//     .sell-token {
//       color: var(--color-green-secondary);
//     }
//     .bid-token {
//       color: var(--color-orange-secondary);
//     }
//   }
// </style>
