<template>
  <page>
    <column class="auctions-header">
      <keplr-account v-model="keplrAccount" :abbreviation="16" :hidden="true"></keplr-account>
      <!-- Auctions toolbar -->
      <section class="auctions-tools">
        <div class="auctions-tools__filter">
          <form class="auctions-tools__filter-controls" @submit.prevent="filterChanged()">

            <!-- Filtering by status -->
            <div class="auctions-tools__filter-toggles">
              <button class="auctions-tools__filter-toggle show-mine" :class="{ on: auctionsFilter.onlyMine }" @click="toggleStatus('mine')"><span class="emoji">🔑</span> Only mine</button>
            </div>

            <div class="auctions-tools__filter-filters">
              <!-- Filtering by sell -->
              <div class="auctions-tools__filter-filter">
                <label class="auctions-tools__filter-label" for="sell-token">I want to buy</label>
                <select class="auctions-tools__filter-select" name="sell-token" v-model="auctionsFilter.sellToken" @change="filterChanged()">
                  <option value=""></option>
                  <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
                    {{ sellToken }}
                  </option>
                </select>
                <!--button class="auctions-tools__filter-sort no-button"
                    :class="[auctionsFilter.sort.fields.sell, { active: auctionsFilter.sort.priority == 'sell'}]" @click="toggleSort('sell')"></button-->
              </div>
            </div>

            <!-- Filtering by bid -->
            <div class="auctions-tools__filter-filter">
              <label class="auctions-tools__filter-label" for="bid-token">paying in</label>
              <select class="auctions-tools__filter-select" name="bid-token" v-model="auctionsFilter.bidToken" @change="filterChanged()">
                <option value=""></option>
                <option v-for="bidToken in bidDenoms" :key="bidToken" v-bind:value="bidToken">
                  {{ bidToken }}
                </option>
              </select>
            </div>
            <div class="auctions-tools__filter-filter">
              <button class="auctions-tools__filter-sort no-button"
                  :class="[auctionsFilter.sort.fields.price, { active: auctionsFilter.sort.priority == 'price'}]" @click="toggleSort('price')"></button>
              <label class="auctions-tools__filter-label" for="bid-token">sorting by <strong>asking  price</strong></label>
            </div>

            <!-- Filtering by status -->
            <div class="auctions-tools__filter-toggles">
              <!--button class="auctions-tools__filter-toggle show-active" :class="{ on: auctionsFilter.showActive }" @click="toggleStatus('active')">Active</button-->
              <button class="auctions-tools__filter-toggle show-closed" :class="{ on: auctionsFilter.showClosed }" @click="toggleStatus('closed')">&#x1F512; Only closed</button>
            </div>

          </form>
        </div>
        <div class="auctions-tools__view">
          <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'grid'}" @click="changeViewMode('grid')">Grid</button>
          <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'list'}" @click="changeViewMode('list')">List</button>
        </div>
      </section>
    </column>


    <column>
      <!-- Auctions grid -->
      <div class="auctions-set" :class="auctionsFilter.viewMode">
        <auction-item :to="'/a/' + auction.address" v-for="auction in filteredAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
      </div>
      
      <!-- Auctions empty -->
      <!-- Use v-show because currently flare doesn't deal well with conditional (v-if) autorenderred elements in the blocks -->
      <div class="auctions-empty" v-show="filteredAuctions.length == 0">
        <h2 v-if="auctionsFilter.sellToken || auctionsFilter.bidToken">
          No auctions were found <span v-if="auctionsFilter.sellToken"> selling <span class="sell-token">{{auctionsFilter.sellToken}}</span></span><span> looking for <span class="bid-token">{{auctionsFilter.bidToken}}</span> bidders</span>.
        </h2>
        <p><router-link :to="'/new'" class="button">Be the first one</router-link> or <a href="" @click="clearFilters()">clear your filters</a>.</p>
      </div>

    </column>
  </page>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'
import KeplrAccount from '../components/KeplrAccount.vue';

export default {
  components: { AuctionItem, KeplrAccount }, 
  metaInfo: {
    title: 'Secret Auctions',
  },
  data() {
    return {
      keplrAccount: null
    }
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
  async mounted() {
    this.$auctions.updateAuctions();
  },
  methods: {
    clearFilters() {
      this.auctionsFilter.sellToken = "";
      this.auctionsFilter.bidToken = "";
    },
    changeViewMode(newViewMode) {
      this.auctionsFilter.viewMode = newViewMode;
      this.filterChanged();
    },
    toggleSort(field) {
      if(field == this.auctionsFilter.sort.priority) {
        if(field == "sell") {
          this.auctionsFilter.sort.fields.sell = (this.auctionsFilter.sort.fields.sell == "asc") ? "desc" : "asc";
        }
        if(field == "bid") {
          this.auctionsFilter.sort.fields.bid  = (this.auctionsFilter.sort.fields.bid == "asc")  ? "desc" : "asc";
        }
        if(field == "price") {
          this.auctionsFilter.sort.fields.price  = (this.auctionsFilter.sort.fields.price == "asc")  ? "desc" : "asc";
        }
      }
      this.auctionsFilter.sort.priority = field;
    },
    toggleStatus(status) {
      switch(status) {
        case 'mine':
          this.auctionsFilter.onlyMine = !this.auctionsFilter.onlyMine;
          break;
        case 'closed':
          this.auctionsFilter.showClosed = !this.auctionsFilter.showClosed;
          break;
      }
    },
    filterChanged() {
      this.$auctions.updateAuctionsFilter(this.auctionsFilter);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "@lkmx/flare/src/functions/respond-to";

  .auction-new {
    border: 2px solid black;
  }

  .auctions-header {
    background-color: rgba(0,0,0, 0.85);
    position: sticky;
    top: 0;
    z-index: 1000;


    button, select {
      margin-bottom: 0;
    }
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
        label {
              text-shadow: 0px 1px 2px rgba(0, 0, 0, 1);
        }
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
        margin-right: var(--f-gutter-s  );
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
        white-space: nowrap;
      }

      &-toggle {
        padding: var(--f-gutter-xxs) var(--f-gutter-s);
        font-size: 12px;
        margin-right: var(--f-gutter);
        white-space: nowrap;
        
        &.show-mine {
          background-color: black;
          color: white;
          cursor: pointer;
          &.on {
            background-color: var(--color-cream-primary);
            color: black;
            opacity: 1;

          }

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
        }
      }
    }

    &__view {
      display: flex;
      flex-flow: row nowrap;
      .on {
        color: var(--color-turquoise-secondary);
        font-weight: 600;
      }
    }
  }

  .auctions-set {
    display: grid;
    grid-gap: var(--f-gutter);
    margin: var(--f-gutter-xl) 0; 

    &.grid {
      @include respond-to("<=s") {
        grid-template-columns: 1fr;
      }
      @include respond-to("m") {
        grid-template-columns: repeat(2, 1fr);
      }
      @include respond-to(">m") {
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
