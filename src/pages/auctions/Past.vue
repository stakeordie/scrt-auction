<template>
<list-layout>
    <!-- Auctions grid -->
  <auction-item :to="'/auctions/' + auction.address" v-for="auction in closedAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
</list-layout>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../../components/AuctionItem.vue'
import ListLayout from '../../layouts/ListLayout.vue';

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
      "closedAuctions",
    ])
  },
  mounted() {
    this.$auctions.updateClosedAuctions();
  },
}
</script>

<style>

</style>