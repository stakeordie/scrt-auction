<template>
  <page>
    <column>
      <!-- Auctions header -->
      <div class="auctions-header">
        <h1>Auctions</h1>
        <div class="auctions-header__actions">
          <router-link :to="'/auctions/create'" class="button">Create New Auction</router-link>
          <!--button @click="createViewingKey()">Create Viewing Key</button-->
          <!--button @click="listUserAuctions()">ListUserAuctions</button-->
        </div>
      </div>

      <!-- Auctions toolbar -->
      <section class="auctions-tools">
        <div class="auctions-tools__filter">
          <form class="auctions-tools__filter-filters" @submit.prevent="filterChanged()">
            <span class="auctions-tools__filter-title">Filters</span>

            <!-- Filtering by sell -->
            <label class="auctions-tools__filter-label" for="sell-token">Sell</label>
            <select class="auctions-tools__filter-select" name="sell-token" v-model="auctionsFilter.sellToken" @change="filterChanged()">
              <option value="">*</option>
              <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
                {{ sellToken }}
              </option>
            </select>

            <!-- Filtering by bid -->
            <label class="auctions-tools__filter-label" for="bid-token">Bid</label>
            <select class="auctions-tools__filter-select" name="bid-token" v-model="auctionsFilter.bidToken" @change="filterChanged()">
              <option value="">*</option>
              <option v-for="bidToken in bidDenoms" :key="bidToken" v-bind:value="bidToken">
                {{ bidToken }}
              </option>
            </select>

            <span class="auctions-tools__filter-title">|</span>

            <!-- Filtering by status -->
            <button class="auctions-tools__filter-toggle show-active" :class="{ on: auctionsFilter.showActive }" @click="auctionsFilter.showActive = !auctionsFilter.showActive">Active</button>
            <button class="auctions-tools__filter-toggle show-closed" :class="{ on: auctionsFilter.showClosed }" @click="auctionsFilter.showClosed = !auctionsFilter.showClosed">Closed</button>
            <button class="auctions-tools__filter-toggle show-mine" :class="{ on: auctionsFilter.showMine }" @click="auctionsFilter.showMine = !auctionsFilter.showMine">Mine</button>

          </form>
        </div>
        <div class="auctions-tools__view">
          <button class="auctions-tools__filter-view no-button" :class="{ on: auctionsFilter.viewMode == 'grid'}" @click="auctionsFilter.viewMode = 'grid'">Grid</button>
          <button class="auctions-tools__filter-view no-button" :class="{ on: auctionsFilter.viewMode == 'list'}" @click="auctionsFilter.viewMode = 'list'">List</button>
        </div>
      </section>

      <!-- Auctions grid -->
      <section class="auctions-set" :class="auctionsFilter.viewMode">
        <auction-item v-for="auction in filteredAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
      </section>
    </column>
  </page>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'

export default {
  components: { AuctionItem }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  computed: {
    auctionsFilter() {
      return this.$store.state.$auctions.auctionsFilter;
    },
    ...mapGetters("$auctions", [
      "filteredAuctions",
      "sellDenoms", "bidDenoms"
    ])
  },
  async created() {
    this.$auctions.updateAuctions();
  },
  methods: {
    filterChanged() {
      this.$store.commit("$auctions/updateAuctionsFilter", this.auctionsFilter);
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

    &__filter {
      display: flex;
      flex-flow: row nowrap;
      align-items: baseline;
    }

    &__filter-title, &__filter-label, &__filter-control {
      display: inline-block;
      margin-bottom: var(--f-gutter);
    }

    &__filter-title {
      font-weight: bold;
      display: inline-block;
      margin-right: var(--f-gutter-l);
      margin-bottom: var(--f-gutter);

      &:not(:first-child) {
        margin-left: var(--f-gutter-l);
      }
    }

    &__filter-label {
      margin-left: var(--f-gutter-xl);
      margin-right: var(--f-gutter);
    }

    &__filter-toggle {
      margin-right: var(--f-gutter);
    }

    &__filter-toggle {
      padding: var(--f-gutter-xxs) var(--f-gutter-s);
      font-size: 11px;
      transition: opacity 0.5s;
      
      &.show-active {
        background-color: var(--color-positive);
      }
      &.show-closed {
        background-color: var(--color-negative);
      }
      &.show-mine {
        background-color: var(--color-purple-primary);
        opacity: 0.3;
      }
      &.show-active, &.show-closed {
        color: black;
        &:hover, &:not(.on) {
          opacity: 0.3;
        }
      }
    }

    &__filter-view.on {
      color: var(--color-yellow-primary);
    }
  }

  .auctions-set {
    display: grid;
    grid-gap: var(--f-gutter);
    margin-bottom: var(--f-gutter); 

    &.grid {
      @include respond-to("<=s") {
        grid-template-columns: 1fr;
      }
      @include respond-to(">=m") {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
</style>
