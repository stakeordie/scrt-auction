<template>
  <page>
    <column>
      <div class="auctions-header">
        <h1>Available Auctions</h1>
        <div class="auctions-header__actions">
          <router-link :to="'/auctions/create'" class="button">Create New Auction</router-link>
          <button @click="createViewingKey()">Create Viewing Key</button>
          <button @click="listUserAuctions()">ListUserAuctions</button>
        </div>
      </div>
      <section class="auctions-tools">
        <div class="auctions-tools__filter">
          <span class="auctions-tools__filter-title">Filter by</span>
          <form class="auctions-tools__filter-filters" @submit.prevent="filter()">
            <label for="bid-token">Sale token</label>
            <select name="bid-token" v-model="filterOptions.saleToken">
              <option value=""></option>
              <option v-for="token in sellTokens" :key="token" v-bind:value="token">
                {{ token }}
              </option>
            </select>
            <label for="bid-token">Bid token</label>
            <select name="bid-token" v-model="filterOptions.bidToken">
              <option value=""></option>
              <option v-for="token in sellTokens" :key="token" v-bind:value="token">
                {{ token }}
              </option>
            </select>

          </form>

        </div>
        <div class="auctions-tools__view">
          <button class="no-button">Grid</button>
          <button class="no-button">List</button>
        </div>
      </section>
      <section class="auctions-grid">
        <auction-item v-for="activeAuction in activeAuctions" :key="activeAuction.address" :auction="activeAuction" :closed="false"></auction-item>
      </section>
      <h1>Closed Auctions</h1>
      <section class="auctions-grid">
        <auction-item v-for="closedAuction in closedAuctions" :key="closedAuction.address" :auction="closedAuction" :closed="true"></auction-item>
      </section>

      <details>
        <summary>Titulo</summary>
        Esto es el contenido
      </details>
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
      closedAuctions: null,
      sellTokens: [ 'EXAM', 'PLE' ],

      filterOptions: {
        saleToken: "",
        bidToken: ""
      }
    }
  },
  async created() {
    this.activeAuctions = await this.$auctions.listAuctions("active");
    this.closedAuctions = await this.$auctions.listAuctions("closed");
    console.log(this.activeAuctions, this.closedAuctions);
  },
  methods: {
    async createViewingKey() {
      const viewingKey = await this.$auctions.createViewingKey(process.env.GRIDSOME_AUCTIONS_FACTORY);
      await this.$auctions.addUpdateWalletKey(process.env.GRIDSOME_AUCTIONS_FACTORY, viewingKey, "211");
    },
    async listUserAuctions() {
      const userAuctions = await this.$auctions.listUserAuctions();
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@lkmx/flare/src/functions/respond-to";

  .auctions-header {
    display: flex;

    @include respond-to("<=s") {
      flex-flow: column;
    }
    @include respond-to(">m") {
      flex-flow: row nowrap;
      justify-content: space-between;
    }

    &__actions {
      display: grid;

      
      @include respond-to("<=s") {
        grid-auto-flow: row;
      }
      @include respond-to(">=m") {
        grid-auto-flow: column;
        grid-gap: var(--f-gutter);
      }
    }
  }

  .auctions-tools {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    border-bottom: 1px solid var(--f-default-text-color);
    margin-bottom: var(--f-gutter);

    &__filter {
      display: flex;
      flex-flow: row nowrap;
      align-items: baseline;
    }

    &__filter-title, label {
      display: inline-block;
      margin-bottom: var(--f-gutter);
      margin-right: var(--f-gutter);
    }

    label {
      margin-left: var(--f-gutter-xl);
    }

  }

  .auctions-grid {
    display: grid;
    grid-gap: var(--f-gutter);
    margin-bottom: var(--f-gutter);

    @include respond-to("<=s") {
      grid-template-columns: 1fr;
    }
    @include respond-to(">=m") {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
