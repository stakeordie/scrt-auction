<template>
  <list-layout>
    <!-- Control Area -->
    <div class="control-area">
      <div class="bidderSellerSwitch">
        <div class="showBidderInfo" @click="showBidderInfo = true">BIDDER</div>
        <div class="showSellerInfo" @click="showBidderInfo = false">SELLER</div>
      </div>
    </div>
    <!-- Aggregate Area -->
    <!-- Table Area -->
    <div class="table-area">
      <!-- Bidder -->
      
      <div class="bidderInfo" v-if="showBidderInfo">
        <div class="tableTitle">Active</div>
        <div class="infoTable">
          <auction-item :to="'/auctions/' + auction.address" v-for="auction in openBidderUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
        </div>
        <div class="tableTitle">Complete</div>
        <div class="infoTable">
          <auction-item :to="'/auctions/' + auction.address" v-for="auction in closedBidderUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
        </div>
      </div>
      <!-- Seller -->
      <div class="sellerInfoTable"></div>
      <div class="sellerInfo" v-if="!showBidderInfo">
        <div class="tableTitle">Active</div>
        <div class="infoTable">
          <auction-item :to="'/auctions/' + auction.address" v-for="auction in openSellerUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
        </div>
        <div class="tableTitle">Complete</div>
        <div class="infoTable">
          <auction-item :to="'/auctions/' + auction.address" v-for="auction in closedSellerUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item>
        </div>
      </div>
    </div>
    <!-- Auctions grid -->
    <!-- <simple-table :data="userAuctions" :config="tableConf"></simple-table> -->
    <!-- <simple-table :data="closedUserAuctions" :config="tableConf"></simple-table> -->
    <!-- <auction-item :to="'/auctions/' + auction.address" v-for="auction in allUserAuctions" :key="auction.address" :auction="auction" :class="auctionsFilter.viewMode"></auction-item> -->
  </list-layout>
</template>

<script>

import { mapGetters } from 'vuex'

import AuctionItem from '../components/AuctionItem.vue'
import ListLayout from '../layouts/ListLayout.vue';
import SimpleTable from '../components/SimpleTable.vue'

export default {
  components: { AuctionItem, ListLayout, SimpleTable }, 
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
        columns: [
          {
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
    allUserAuctions() {
      return this.userAuctions.filter( (auction) => {
        if(auction.status == "ACTIVE") {
          return true;
        } else {
          if(auction.bid.winner) {
            return true;
          } else {
            return false;
          }
        }
      })
    },
    openBidderUserAuctions() {
      return this.userAuctions.filter(auction => auction.status == "ACTIVE")
    },
    closedBidderUserAuctions() {
      return this.userAuctions.filter(auction => auction.status == "ACTIVE")
    },
    openSellerUserAuctions() {
      return this.userAuctions.filter(auction => auction.status == "ACTIVE")
    },
    closedSellerUserAuctions() {
      return this.userAuctions.filter(auction => auction.status == "CLOSED")
    },
  },
  mounted() {
    this.$auctions.updateUserAuctions();
    console.log(this.userAuctions);
  },
}
</script>

<style lang="scss" scoped>
  .control-area {
      width: 100%;
      display: flex;
      justify-content: center;
    .bidderSellerSwitch {
      cursor: pointer;
      width: 200px;
      display: flex;
      justify-content: space-between;
    }
  }

  .table-area {
    .infoTable {
      padding: 25px;
    }
  }
</style>