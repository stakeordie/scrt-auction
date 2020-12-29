<template>
    <section class="auctions-grid">
        <auctions-grid-card v-for="(auction, index) in auctions" :key="index" :auction="auction"></auctions-grid-card>
    </section>
</template>

<script>
import AuctionsGridCard from '../components/AuctionsGridCard.vue'

export default {
  components: { AuctionsGridCard }, 
  data() {
    return {
      auctions: null
    }
  },
  async mounted() {
    this.auctions = (await this.$auctions.listActiveAuctions());
  }
}
</script>

<style lang="scss" scoped>
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
