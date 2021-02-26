<template>
    <!-- Auctions toolbar -->
    <form class="auctions-tools" @submit.prevent="filterChanged()">

    <div class="auctions-tools__filters">
        <!-- Filtering by sell -->
        <div class="auctions-tools__filter">
        <label class="auctions-tools__label" for="sell-token">I want to buy</label>
        <select class="auctions-tools__select" name="sell-token" v-model="auctionsFilter.sellToken" @change="filterChanged()">
            <option value=""></option>
            <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
            {{ sellToken }}
            </option>
        </select>
        <!--button class="auctions-tools__sort no-button"
            :class="[auctionsFilter.sort.fields.sell, { active: auctionsFilter.sort.priority == 'sell'}]" @click="toggleSort('sell')"></button-->
        </div>

        <!-- Filtering by bid -->
        <div class="auctions-tools__filter">
        <label class="auctions-tools__label" for="bid-token">paying in</label>
        <select class="auctions-tools__select" name="bid-token" v-model="auctionsFilter.bidToken" @change="filterChanged()">
            <option value=""></option>
            <option v-for="bidToken in bidDenoms" :key="bidToken" v-bind:value="bidToken">
            {{ bidToken }}
            </option>
        </select>
        </div>

        <div class="auctions-tools__filter">
        <button class="auctions-tools__sort no-button"
            :class="[auctionsFilter.sort.fields.price, { active: auctionsFilter.sort.priority == 'price'}]" @click="toggleSort('price')"></button>
        <label class="auctions-tools__label" for="bid-token">sorting by <strong>asking  price</strong></label>
        </div>
    </div>

    <!-- Filtering by status -->
    <div class="auctions-tools__toggles">
        <!--button class="auctions-tools__toggle show-active" :class="{ on: auctionsFilter.showActive }" @click="toggleStatus('active')">Active</button-->
        <button class="auctions-tools__toggle show-mine" :class="{ on: auctionsFilter.onlyMine }" @click="toggleStatus('mine')"><span class="emoji">🔑</span> Only mine</button>
        <button class="auctions-tools__toggle show-closed" :class="{ on: auctionsFilter.showClosed }" @click="toggleStatus('closed')">&#x1F512; Showing {{auctionsFilter.showClosed ? "closed" : "active" }}</button>
    </div>


    <div class="auctions-tools__view">
        <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'grid'}" @click="changeViewMode('grid')">Grid</button>
        <button class="auctions-tools__view-toggle no-button" :class="{ on: auctionsFilter.viewMode == 'list'}" @click="changeViewMode('list')">List</button>
    </div>

    </form>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'AuctionsFilter',
    computed: {
        auctionsFilter() {
            return this.$store.state.$auctions.auctionsFilter;
        },
        ...mapGetters("$auctions", [
            "sellDenoms", "bidDenoms"
        ])
    },
    methods: {
        filterChanged() {
            this.$auctions.updateAuctionsFilter(this.auctionsFilter);
        },
        changeViewMode(newViewMode) {
            this.auctionsFilter.viewMode = newViewMode;
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
    },
}
</script>

<style lang="scss" scoped>
  .auctions-tools {
    display: flex;
    column-gap: var(--f-gutter-xl);
    flex-flow: row nowrap;
    justify-content: space-evenly;

    button, select {
      margin-bottom: 0;
    }

    &__filters {
      display: flex;
      flex-flow: row wrap;
      column-gap: var(--f-gutter);
    }


    &__filter {
      label {
            text-shadow: 0px 1px 2px rgba(0, 0, 0, 1);
      }
      select {
        min-width: 120px;
      }
    }

    &__filter, &__toggles {
      display: flex;
      flex-flow: row nowrap;
      align-items: baseline;
    }

    &__sort {
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

    &__label {
      margin-right: var(--f-gutter);
      white-space: nowrap;
    }

    &__toggle {
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
      &.show-closed {
        transition: opacity 0.2s;
        background-color: var(--color-positive);
        color: black;
        cursor: pointer;

        &.on {
          background-color: var(--color-negative);
          color: white;
        }
        
        &:not(.on) {
          &:hover {
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
</style>