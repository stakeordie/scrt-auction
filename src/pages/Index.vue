<template>
  <page>
    <column class="auctions-filter">
      <block>
        <auctions-filter></auctions-filter>
      </block>
    </column>


    <column>
      <block>
        <!-- Auctions grid -->
        <div class="auctions-set" :class="auctionsFilter.viewMode">
          <auction-item :to="'/auctions/' + auction.address" v-for="auction in filteredAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
        </div>
        
        <!-- Auctions empty -->
        <!-- Use v-show because currently flare doesn't deal well with conditional (v-if) autorenderred elements in the blocks -->
        <div class="auctions-empty" v-show="filteredAuctions.length == 0">
          <h2 v-if="auctionsFilter.sellToken || auctionsFilter.bidToken">
            No auctions were found <span v-if="auctionsFilter.sellToken"> selling <span class="sell-token">{{auctionsFilter.sellToken}}</span></span><span> looking for <span class="bid-token">{{auctionsFilter.bidToken}}</span> bidders</span>.
          </h2>
          <p><router-link :to="'/new'" class="button">Be the first one</router-link> or <a href="" @click="clearFilters()">clear your filters</a>.</p>
        </div>
      </block>
    </column>
  </page>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'
import AuctionsFilter from '../components/AuctionsFilter.vue';
import KeplrAccount from '../components/KeplrAccount.vue';

export default {
  components: { AuctionItem, KeplrAccount, AuctionsFilter }, 
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
  }
}
</script>

<style lang="scss" scoped>
  @import "@lkmx/flare/src/functions/respond-to";

  .auction-new {
    border: 2px solid black;
  }

  .auctions-set {
    display: grid;
    grid-gap: var(--f-gutter);
    margin: var(--f-gutter-l) 0; 

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

  .auctions-filter {
    background-color: rgba(0,0,0, 0.7);
    position: sticky;
    top: 0;
    z-index: 1000;
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
