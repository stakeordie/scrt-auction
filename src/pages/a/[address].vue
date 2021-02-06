<template>
  <page>
      <column mode-l="slim" number="2" number-m="1" number-s="1">
          <block>
              <div class="auction-info" v-if="auction">
                <auction-item :auction="auction" class="grid"></auction-item>
              </div>
          </block>
      </column>
  </page>
</template>

<script>
import AuctionItem from '../../components/AuctionItem.vue'
export default {
  watch: {
  },
  components: { AuctionItem },
  computed: {
    auction() {
      return this.$auctions.getAuction(this.$route.params.address);
    }
  },
  async mounted() {
    await this.$auctions.updateAuction(this.$route.params.address);
  }
}
</script>

<style lang="scss" scoped>

.--flare-columns {
  --f-columns-normal-width-l:    var(--f-breakpoint-xxl);
  --f-columns-normal-width-xl:   var(--f-breakpoint-xxl);
  --f-columns-normal-width-xxl:  var(--f-breakpoint-xxl);
  --f-columns-normal-width-xxxl: var(--f-breakpoint-xxl);
}

</style>