<template>
  <default-layout>
      <page>
      <!--
        ------
          -Title
          -Create Auction Button
        ------
          -Filter
            - "filter by"
            - Sale Token
            - dropdown
            - "Bid Token"
            - dropdown
          - list type
            - grid icon
            - list icon
        ------
          -hr
        ------
      -->
        <h1>Secret Auctions</h1>
        <section class="auctions-grid">
          <auction-item v-for="(auction, index) in auctions" :key="index" :auction="auction"></auction-item>
        </section>
    </page>
  </default-layout>
</template>

<script>

import AuctionItem from '../components/AuctionItem.vue'

export default {
  components: { AuctionItem }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  data() {
    return {
      auctions: null
    }
  },
  async mounted() {
    this.auctions = (await this.$auctions.listActive());
  }
}
</script>

<style lang="scss" scoped>
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
