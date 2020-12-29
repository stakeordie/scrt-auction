<template>
  <div class="card">
    <p>
        {{ auction.pair }}
    </p>
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
  props: ["auction"]
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
