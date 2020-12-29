<template>
    <section class="grid">
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
    this.auctions = (await this.$scrtjs.queryContract("secret1q5dadwv9dtvqde7l8tvkm0zlgn0hqr9vkla5pn", {"list_active_auctions":{}})).list_active_auctions.active
    console.log(this.auctions)
  }
}
</script>

<style lang="scss" scoped>
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
</style>
