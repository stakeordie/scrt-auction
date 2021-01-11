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
      <h1>Buttons</h1>
      <router-link :to="'/auctions/create'" class="button">Create New Auction</router-link>
      <button @click="createViewingKey()">Create Viewing Key</button>
      <button @click="listUserAuctions()">ListUserAuctions</button>
    </column>
    <column>
      <h1>Auctions</h1>
      <section>
        <h2>Active Auctions</h2>
      </section>
      <section class="auctions-grid">
        <auction-item v-for="activeAuction in activeAuctions" :key="activeAuction.address" :auction="activeAuction" :closed="false"></auction-item>
      </section>
      <section>
        <h2>Closed Auctions</h2>
      </section>
      <section class="auctions-grid">
        <auction-item v-for="closedAuction in closedAuctions" :key="closedAuction.address" :auction="closedAuction" :closed="true"></auction-item>
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
      activeAuctions: null,
      closedAuctions: null
    }
  },
  async created() {
    this.activeAuctions = await this.$auctions.listAuctions("active");
    this.closedAuctions = await this.$auctions.listAuctions("closed");
  },
  methods: {
    async createViewingKey() {
      const viewingKey = await this.$auctions.createViewingKey(process.env.GRIDSOME_AUCTIONS_FACTORY);
      await this.$auctions.addUpdateWalletKey(process.env.GRIDSOME_AUCTIONS_FACTORY,viewingKey, "211");
    },
    async listUserAuctions() {
      const userAuctions = await this.$auctions.listUserAuctions();
      console.log(userAuctions);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@lkmx/flare/src/functions/respond-to";

  .auctions-grid {
    display: grid;
    grid-gap: var(--f-gutter);

    @include respond-to("<=s") {
      grid-template-columns: 1fr;
    }
    @include respond-to(">m") {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
