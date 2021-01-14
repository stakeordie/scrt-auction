<template>
  <page>
    <column>
      <!-- Auctions header -->
      <div class="auctions-header">
        <h1>Auctions</h1>
        <div class="auctions-header__actions">
          <router-link :to="'/auctions/create'" class="button">Create New Auction</router-link>
          <button @click="createViewingKey()">Create Viewing Key</button>
          <button @click="listUserAuctions()">ListUserAuctions</button>
        </div>
      </div>

      <!-- Auctions toolbar -->
      <section class="auctions-tools">
        <div class="auctions-tools__filter">
          <span class="auctions-tools__filter-title">Filters</span>
          <form class="auctions-tools__filter-filters" @submit.prevent="filter()">
            <label for="bid-token">Sale token</label>
            <select name="bid-token" @change="filterChanged()" v-model="filterOptions.saleToken">
              <option value=""></option>
              <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
                {{ sellToken }}
              </option>
            </select>
            <label for="bid-token">Bid token</label>
            <select name="bid-token" @change="filterChanged()" v-model="filterOptions.bidToken">
              <option value=""></option>
              <option v-for="bidToken in bidDenoms" :key="bidToken" v-bind:value="bidToken">
                {{ bidToken }}
              </option>
            </select>
          </form>
        </div>
        <div class="auctions-tools__view">
          <button class="no-button">Grid</button>
          <button class="no-button">List</button>
        </div>
      </section>

      <!-- Auctions grid -->
      <section class="auctions-grid">
        <auction-item v-for="auction in auctions" :key="auction.address" :auction="auction"></auction-item>
      </section>
    </column>
  </page>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'

export default {
  watch: {
  },
  components: { AuctionItem }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  data() {
    return {
      filterOptions: {
        saleToken: "",
        bidToken: "",
        showActive: true,
        showClosed: true,
      }
    }
  },
  computed: {
    auctions() {
      return this.$store.state.$auctions.auctions; 
    },
    ...mapGetters("$auctions", [
      "sellDenoms", "bidDenoms"
    ])
  },
  async created() {
    this.$auctions.updateAuctions();
  },
  methods: {
    async filterChanged() {
      
    },
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
