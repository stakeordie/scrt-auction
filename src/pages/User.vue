<template>
  <list-layout only="list">
    <column>
      <block>
        <!-- Control Area -->
        <div class="control-area">
          <div class="bidderSellerSwitch">
            <h6 class="switch" :class="showBidderInfo ? 'selected' : ''" @click="showBidderInfo = true">Bidder</h6>
            <h6 class="switch" :class="!showBidderInfo ? 'selected' : ''" @click="showBidderInfo = false">Seller</h6>
          </div>
        </div>
      </block>
    </column>
    <!-- Aggregate Area -->
    <!-- Table Area -->
    <column v-if="showBidderInfo">
    <section class="stats">
        <div class="stat">
          <p class="title">Total Auction Bids</p>
          <h3 class="value">329</h3>
        </div>
        <div class="stat">
          <p class="title">Total Amount Bid</p>
          <h3 class="value">8,567.2837 SCRT<span>USD</span></h3>
        </div>
        <div class="stat">
          <p class="title">Total Auctions Won</p>
          <h3 class="value">64</h3>
        </div>
        <div class="stat">
          <p class="title">Total Amount Won</p>
          <h3 class="value">1,272.291124 SCRT<span>USD</span></h3>
        </div>
      </section>
      <div class="table-area">
        <!-- Bidder -->
        <div class="bidderInfo" v-if="showBidderInfo">
          <h4 class="tableTitle">Active Auctions</h4>
          <div class="auctions-header">
            <h6>Trading pair</h6>
            <h6>Asking price</h6>
            <h6>My bid</h6>
            <h6>Target Close</h6>
            <h6 class="actions">Actions</h6>
          </div>

          <div class="infoTable">
            <auction-item-my-auctions :to="'/auctions/' + auction.address" v-for="auction in openBidderUserAuctions"
              :key="auction.address" :auction="auction" class="list"></auction-item-my-auctions>
          </div>
          <h4 class="tableTitle">Past Auctions</h4>
          <div class="auctions-header">
            <h6>Trading pair</h6>
            <h6>Asking price</h6>
            <h6>My bid</h6>
            <h6>Target Close</h6>
            <h6 class="actions">Actions</h6>
          </div>
          <div class="infoTable">
            <auction-item-my-auctions :to="'/auctions/' + auction.address" v-for="auction in closedBidderUserAuctions"
              :key="auction.address" :auction="auction" class="list"></auction-item-my-auctions>
          </div>
        </div>
      </div>
    </column>
    <column v-if="!showBidderInfo">
    <section class="stats">
        <div class="stat">
          <p class="title">Auctions Created</p>
          <h3 class="value">563</h3>
        </div>
        <div class="stat">
          <p class="title">Amount Sold</p>
          <h3 class="value">99,827.837 SCRT<span>USD</span></h3>
        </div>
        <div class="stat">
          <p class="title">Successful Auctions</p>
          <h3 class="value">378</h3>
        </div>
        <div class="stat">
          <p class="title">Value of Aquired Assets</p>
          <h3 class="value">279,927.834673 SCRT<span>USD</span></h3>
        </div>
      </section>
      <div class="table-area" v-if="!showBidderInfo">
        <!-- Seller -->
        <div class="sellerInfoTable"></div>
        <div class="sellerInfo" v-if="!showBidderInfo">
          <h4 class="tableTitle">Active</h4>
          <div class="auctions-header">
            <h6>Trading pair</h6>
            <h6>Asking price</h6>
            <h6>My bid</h6>
            <h6>Target Close</h6>
            <h6 class="actions">Actions</h6>
          </div>
          <div class="infoTable">
            <auction-item-my-auctions :to="'/auctions/' + auction.address" v-for="auction in openSellerUserAuctions"
              :key="auction.address" :auction="auction" class="list"></auction-item-my-auctions>
          </div>
          <h4 class="tableTitle">Complete</h4>
          <div class="auctions-header">
            <h6>Trading pair</h6>
            <h6>Asking price</h6>
            <h6>My bid</h6>
            <h6>Target Close</h6>
            <h6 class="actions">Actions</h6>
          </div>
          <div class="infoTable">
            <auction-item-my-auctions :to="'/auctions/' + auction.address" v-for="auction in closedSellerUserAuctions"
              :key="auction.address" :auction="auction" class="list"></auction-item-my-auctions>
          </div>
        </div>
      </div>
      <!-- Auctions grid -->
      <!-- <simple-table :data="userAuctions" :config="tableConf"></simple-table> -->
      <!-- <simple-table :data="closedUserAuctions" :config="tableConf"></simple-table> -->
      <!-- <auction-item :to="'/auctions/' + auction.address" v-for="auction in allUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item> -->
    </column>
  </list-layout>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  import AuctionItem from '../components/AuctionItem.vue';
  import AuctionItemMyAuctions from '../components/AuctionItemMyAuctions.vue';
  import ListLayout from '../layouts/ListLayout.vue';
  import SimpleTable from '../components/SimpleTable.vue';

  export default {
    components: {
      AuctionItem,
      AuctionItemMyAuctions,
      ListLayout,
      SimpleTable
    },
    metaInfo: {
      title: 'Secret Auctions',
    },
    data() {
      return {
        showBidderInfo: true,
        tableConf: {
          pagination: {
            enabled: true,
            perPage: 10
          },
          columns: [{
              name: "address",
              header: "Auction Address",
              position: 1
            },
            {
              name: "bid.decimalWinner",
              suffix: "bid.denom",
              header: "Winning Bid",
              postion: 2
            }
          ]
        }
      }
    },
    computed: {
      auctionsFilter() {
        return this.$store.state.$auctions.auctionsFilter;
      },
      ...mapGetters("$auctions", [
        "userAuctions"
      ]),
      openBidderUserAuctions() {
        return this.userAuctions.filter((auction) => {
          if (auction.status == "ACTIVE" && auction.viewerIsBidder) {
            return true;
          } else {
            return false;
          }
        })
      },
      closedBidderUserAuctions() {
        return this.userAuctions.filter((auction) => {
          if (auction.status == "CLOSED" && auction.viewerIsWinner) {
            return true;
          } else {
            return false;
          }
        })
      },
      openSellerUserAuctions() {
        return this.userAuctions.filter((auction) => {
          if (auction.status == "ACTIVE" && auction.viewerIsSeller) {
            return true;
          } else {
            return false;
          }
        })
      },
      closedSellerUserAuctions() {
        return this.userAuctions.filter((auction) => {
          if (auction.status == "CLOSED" && auction.viewerWasSeller && auction.bid.winner) {
            return true;
          } else {
            return false;
          }
        })
      },
    },
    mounted() {
      this.$auctions.updateUserAuctions();
      console.log(this.userAuctions);
    },
  }
</script>

<style lang="scss" scoped>
  @import "@lkmx/flare/src/functions/respond-to";

  .control-area {
    width: 100%;
    display: flex;
    justify-content: center;

    .bidderSellerSwitch {
      cursor: pointer;
      display: flex;
      justify-content: space-between;

      .switch {
        text-align: center;
        padding: var(--f-gutter-s) var(--f-gutter-l);
        margin-bottom: 0;
        border-bottom: var(--f-gutter-xxs) solid rgba(white, 0.2);
        color: rgba(white, 0.2);

        &.selected {
          color: white;
          border-bottom: var(--f-gutter-xxs) solid white;
        }
      }
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--f-gutter);
    margin-bottom: var(--f-gutter-xl);
    .stat {
      background-color: #0D1017;
      border: 1px solid #2E323C;
      padding: var(--f-gutter);
      text-align: center;
      border-radius: 10px;
      .value {
        margin-bottom: 0;
        span {
          padding-left: var(--f-gutter-s);
          font-size: 75%;
        }
      }
    }
  }

  .table-area {
    .auctions-header {
      background-color: #0D1017;
      border: 1px solid #2E323C;
      display: grid;
      gap: var(--f-gutter);
      align-items: center;
      grid-template-columns: repeat(5, 1fr);
      border-radius: 10px 10px 0 0;
      padding: var(--f-gutter);

      @include respond-to('s and down') {
        display: none;
      }

      h6 {
        margin-bottom: 0;

        &.actions {
          justify-self: end;
          top: 0;
        }
      }
    }

    .infoTable {
      margin-bottom: var(--f-gutter-xl);

      .auction {
        &:first-child {
          @include respond-to('s and down') {
            border-radius: 10px 10px 0 0;
          }
        }

        &:last-child {
          border-radius: 0 0 10px 10px;
        }
      }
    }
  }
</style>