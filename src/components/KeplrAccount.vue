<template>
  <input class="keplr__account" readonly :value="address">
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  computed: {
    address() {
      this.$emit("input", this.$store.state.$keplr.selectedAccount?.address);
      return this.$store.state.$keplr.selectedAccount?.address;
    },
  },
};
</script>

<style lang="scss">
  .keplr__account {
    background-image: url("../assets/keplr-icon.svg");
    background-size: auto calc(100% - 10px);
    background-repeat: no-repeat;
    background-position: 4px center;
    padding-left: 30px;
  }
</style>
