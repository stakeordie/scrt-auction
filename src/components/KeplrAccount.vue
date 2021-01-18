<template>
  <input class="keplr__account" readonly :value="address">
</template>

<script>
const shorten = (str) => {
  if(str == undefined) {
    return undefined;
  }
  return str.substring(0, 8) + "..." + str.substring(str.length - 8, str.length);
}

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
      return shorten(this.$store.state.$keplr.selectedAccount?.address) || "No account available";
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
