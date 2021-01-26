<template>
  <input class="keplr__account" readonly :value="address" :type="hidden ? `hidden` : `text`">
</template>

<script>
const shorten = (str, length) => {
  if(str == undefined) {
    return undefined;
  }
  if(typeof length == "number") {
    const half = Math.round(length / 2);
    return str.substring(0, half) + "..." + str.substring(str.length - half, str.length);
  } else {
    return str;
  }
}

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    abbreviation: {
      type: Number,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    address() {
      this.$emit("input", this.$store.state.$keplr.selectedAccount?.address);
      return shorten(this.$store.state.$keplr.selectedAccount?.address, this.abbreviation) || "No account available";
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
    padding-left: 2em;
  }
</style>
