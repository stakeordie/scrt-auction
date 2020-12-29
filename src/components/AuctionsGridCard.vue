<template>
  <div class="card">
    <p>
        {{ auction.pair }}
    </p>
    <p>
        {{ auction.sell_amount }}
    </p>
    <p>
        {{ auction.minimum_bid }}
    </p>
    <p>
        {{ auction.label }}
    </p>
    <button @click="bidHide = true">BID</button>
    <input type="text" v-show="bidHide" v-model="bidAmount" />
    <!--
      ------
        - Auction Header
          - Pair (dynamic)
          - Amount (dynamic)
        - Bid Button
      ------
        - Auction Footer
          - "Min Bid"
          - minimum bid (dynamic)
    -->
  </div>
</template>

<script>
export default {
  props: ["auction"],
  data () {
    return {
      bidAmount: 0,
      bidHide: false
    }
  },
  methods: {
  
  }
}
</script>

<style lang="scss" scoped>
    .card {
        display: grid;
        border: 1px solid white;
        border-radius: 22px;
        p {
            text-align: center;
        }
    }
</style>
