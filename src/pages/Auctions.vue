<template>
  <page>
    <column>
      <!-- Auctions header -->
      <div class="auctions-header">
        <h1>Auctions</h1>
        <router-link :to="'/auctions/new'" class="button">Create a new auction</router-link>
          <!--button @click="createViewingKey()">Create Viewing Key</button-->
          <!--button @click="listUserAuctions()">ListUserAuctions</button-->
      </div>
      <!-- Auctions toolbar -->
      <section class="auctions-tools">
        <div class="auctions-tools__filter">
          <form class="auctions-tools__filter-controls" @submit.prevent="filterChanged()">

            <div class="auctions-tools__filter-filters">
              <!-- Filtering by sell -->
              <div class="auctions-tools__filter-filter">
                <label class="auctions-tools__filter-label" for="sell-token">Sell</label>
                <select class="auctions-tools__filter-select" name="sell-token" v-model="auctionsFilter.sellToken" @change="filterChanged()">
                  <option value=""></option>
                  <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
                    {{ sellToken }}
                  </option>
                </select>
                <button class="auctions-tools__filter-sort no-button"
                    :class="[auctionsFilter.sort.fields.sell, { active: auctionsFilter.sort.priority == 'sell'}]" @click="toggleSort('sell')"></button>
              </div>

              <!-- Filtering by bid -->
              <div class="auctions-tools__filter-filter">
                <label class="auctions-tools__filter-label" for="bid-token">Bid</label>
                <select class="auctions-tools__filter-select" name="bid-token" v-model="auctionsFilter.bidToken" @change="filterChanged()">
                  <option value=""></option>
                  <option v-for="bidToken in bidDenoms" :key="bidToken" v-bind:value="bidToken">
                    {{ bidToken }}
                  </option>
                </select>
                <button class="auctions-tools__filter-sort no-button"
                    :class="[auctionsFilter.sort.fields.bid, { active: auctionsFilter.sort.priority == 'bid'}]" @click="toggleSort('bid')"></button>
              </div>
            </div>

            <!-- Filtering by status -->
            <div class="auctions-tools__filter-toggles">
              <button class="auctions-tools__filter-toggle show-active" :class="{ on: auctionsFilter.showActive }" @click="toggleStatus('active')">Active</button>
              <button class="auctions-tools__filter-toggle show-closed" :class="{ on: auctionsFilter.showClosed }" @click="toggleStatus('closed')">Closed</button>
              <button class="auctions-tools__filter-toggle show-mine" :class="{ on: auctionsFilter.showMine }" @click="toggleStatus('mine')">🔑 Only mine</button>
            </div>

          </form>
        </div>
        <div class="auctions-tools__view">
          <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'grid'}" @click="auctionsFilter.viewMode = 'grid'">Grid</button>
          <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'list'}" @click="auctionsFilter.viewMode = 'list'">List</button>
        </div>
      </section>

      <!-- Auctions grid -->
      <div class="auctions-set" :class="auctionsFilter.viewMode">
        <auction-item v-for="auction in filteredAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
      </div>

      <!-- Auctions empty -->
      <!-- Use v-show because currently flare doesn't deal well with conditional (v-if) autorenderred elements in the blocks -->
      <div class="auctions-empty" v-show="filteredAuctions.length == 0">
        <h2 v-if="auctionsFilter.sellToken || auctionsFilter.bidToken">
          No auctions were found <span v-if="auctionsFilter.sellToken"> selling <span class="sell-token">{{auctionsFilter.sellToken}}</span></span><span> looking for <span class="bid-token">{{auctionsFilter.bidToken}}</span> bidders</span>.
        </h2>
        <p><router-link :to="'/auctions/new'" class="button">Be the first one</router-link> or <a href="" @click="clearFilters()">clear your filters</a>.</p>
      </div>

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
    clearFilters() {
      this.auctionsFilter.sellToken = "";
      this.auctionsFilter.bidToken = "";
      this.auctionsFilter.showActive = true;
      this.auctionsFilter.showClosed = false;
    },
    toggleSort(field) {
      if(field == this.auctionsFilter.sort.priority) {
        if(field == "sell") {
          this.auctionsFilter.sort.fields.sell = (this.auctionsFilter.sort.fields.sell == "asc") ? "desc" : "asc";
        }
        if(field == "bid") {
          this.auctionsFilter.sort.fields.bid  = (this.auctionsFilter.sort.fields.bid == "asc")  ? "desc" : "asc";
        }
      }
      this.auctionsFilter.sort.priority = field;
    },
    toggleStatus(status) {
      switch(status) {
        case 'active':
          this.auctionsFilter.showActive = !this.auctionsFilter.showActive;
          if(!this.auctionsFilter.showActive  == !this.auctionsFilter.showClosed) {
            this.auctionsFilter.showClosed = true;
          }
          break;
        case 'closed':
          this.auctionsFilter.showClosed = !this.auctionsFilter.showClosed;
          if(!this.auctionsFilter.showClosed  == !this.auctionsFilter.showActive) {
            this.auctionsFilter.showActive = true;
          }
          break;
        case 'mine':
          this.auctionsFilter.showMine = !this.auctionsFilter.showMine;
          break;
      }
    },
    filterChanged() {
      this.$auctions.updateAuctionsFilter(this.auctionsFilter);
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
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .auctions-tools {
    // The layout with the filter and the view controls
    display: flex;
    justify-content: space-between;
    @include respond-to("<=m") {
      flex-flow: column;
    }
    @include respond-to(">m") {
      flex-flow: row nowrap;
    }

    &__filter {
      &-filters {
        display: flex;
        flex-flow: row nowrap;
        column-gap: var(--f-gutter);
      }

      &-controls {
        display: flex;
        column-gap: var(--f-gutter-xl);
        flex-flow: row wrap;
        justify-content: space-evenly;
      }

      &-filter {
        select {
          min-width: 120px;
        }
      }

      &-filter, &-toggles {
        display: flex;
        flex-flow: row nowrap;
        align-items: baseline;
      }

      &-sort {
        width: 30px;
        height: 30px;
        background: center / 15px 15px no-repeat;

        &.desc {
          background-image: url(~@/assets/desc.svg);
        }
        &.asc {
          background-image: url(~@/assets/asc.svg);
        }

        &:not(.active) {
          opacity: 0.3;
        }
      }

      &-label {
        margin-right: var(--f-gutter);
      }

      &-toggle {
        padding: var(--f-gutter-xxs) var(--f-gutter-s);
        font-size: 12px;
        margin-right: var(--f-gutter);
        white-space: nowrap;
        
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
          transition: opacity 0.2s;
          color: black;
          
          &:not(.on) {
            opacity: 0.3;
            &:hover {
              opacity: 0.5;
            }
          }
          &.on {
            opacity: 1;
            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }

    &__view {
      display: flex;
      flex-flow: row nowrap;
      .on {
        color: var(--color-turquoise-secondary);
      }
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
      @include respond-to(">s") {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .auctions-empty {
    .sell-token {
      color: var(--color-green-secondary);
    }
    .bid-token {
      color: var(--color-orange-secondary);
    }
  }
</style>
