<template>
  <div class="keplr__account">
    <input readonly :value="address">
  </div>
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
      this.$emit("input", this.$store.getters["$keplr/selectedAccount"]?.address);
      return this.$store.getters["$keplr/selectedAccount"]?.address;
    },
  },
};
</script>

<style></style>
