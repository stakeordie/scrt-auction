<template>
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
    <button @click="createViewingKey()">Create Viewing Key</button>
    <button @click="listUserAuctions()">ListUserAuctions</button>
    <section class="auctions-grid">
      <auction-item v-for="auction in auctions" :key="auction.address" :auction="auction"></auction-item>
    </section>
    </column>
  </page>
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
    this.auctions = await this.$auctions.listActive();
    console.log(this.auctions);
  },
  methods: {
    async createViewingKey() {
      const viewingKey = await this.$auctions.createViewingKey();
      await this.$auctions.addViewingKey(viewingKey);
    },
    async listUserAuctions() {
      const userAuctions = await this.$auctions.listUserAuctions();
      console.log(userAuctions);
    }
  }
}
</script>

<style lang="scss" scoped>
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
