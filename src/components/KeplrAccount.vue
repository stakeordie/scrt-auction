<template>
  <div class="keplr__account">
    <p>{{ address }} 0 SCRT</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.$emit("input", this.value);
  },
  computed: {
    address() {
      return this.$store.getters["$keplr/selectedAccount"]?.address;
    },
  },
};
</script>

<style></style>
