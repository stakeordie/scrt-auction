<template>
  <list-layout>
            <!-- <simple-table :data="userAuctions" :config="tableConf"></simple-table> -->

    <!-- Auctions grid -->
    
            <auction-item :to="'/auctions/' + auction.address" v-for="auction in userAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
  </list-layout>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'
import ListLayout from '../layouts/ListLayout.vue';
import SimpleTable from '../components/SimpleTable.vue'

export default {
  components: { AuctionItem, ListLayout, SimpleTable }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  data() {
    return {
      tableConf: {
        pagination: {
          enabled: true,
          perPage: 10
        },
        columns: [
          {
            name: "address",
            header: "Auction Address",
            position: 1
          },
          {
            name: "color",
            header: "Color",
            postion: 2
          }
        ]
      }
    }
  },
  computed: {
    auctionsFilter() {
      return this.$store.state.$auctions.auctionsFilter;
    },
    ...mapGetters("$auctions", [
      "userAuctions"
    ])
  },
  mounted() {
    this.$auctions.updateUserAuctions();
    // console.log(this.userAuctions);
  },
}
</script>

<style>

</style>