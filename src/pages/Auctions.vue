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
        <column>
        <h1>Secret Auctions</h1>
        <section class="auctions-grid">
          <auction-item v-for="auction in auctions" :key="auction.address" :auction="auction"></auction-item>
        </section>
        </column>
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
    console.log(this.auctions);
  }
}
</script>

<style lang="scss" scoped>
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
