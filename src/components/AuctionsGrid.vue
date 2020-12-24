<template>
    <section class="grid">
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
        <auctions-grid-card></auctions-grid-card>
    </section>
</template>

<script>
import AuctionsGridCard from '../components/AuctionsGridCard.vue'

export default {
  components: { AuctionsGridCard }, 

}
</script>

<style lang="scss" scoped>
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
</style>
