<template>
  <div class="keplr-user">
      <a v-if="!kplrKey" href="" class="keplr-user__login" @click="getKey()">Log in</a>
      <div v-if="kplrKey">
          {{ kplrKey | bech32 }}
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        kplrKey: null,
    }
  },
  methods: {
      async getKey() {
          this.kplrKey = await this.$keplr.getKey();
      },
  },

}
</script>

<style lang="scss" scoped>

</style>