<template>
  <div class="vkeys-wallet">
    <div class="wallet-icon">
      {{savedViewingKey.key}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: String,
      default: null
    },
    contract: {
      type: String,
      default: null
    },
  },
  computed: {
      savedViewingKey() {
          return this.$vkeys.get(this.account, this.contract);
      }
  },
}
</script>

<style>

</style>