<template>
  <default-layout>
      <page>
      <!--
        ------
          -Title
          -Create Auction Button
        ------
          -Filter
            - "filter by"
            - Sale Token
            - dropdown
            - "Bid Token"
            - dropdown
          - list type
            - grid icon
            - list icon
        ------
          -hr
        ------
      -->
      <section class="auction-grid-section">
        <auctions-grid></auctions-grid>
      </section>
    </page>
  </default-layout>
</template>

<script>

import AuctionsGrid from '../components/AuctionsGrid.vue'

export default {
  components: { AuctionsGrid }, 
  metaInfo: {
    title: 'Secret Auctions'
  }
}
</script>
