<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Connect to node</h1>

      <block>
        <p>Chain ID: {{ chainId }}</p>
        <p>Height: {{ height }}</p>
      </block>
    </columns>
  </page>
</template>

<script>
export default {
  data() {
    return {
      chainId: "",
      height: "",
    };
  },
  async mounted() {
    this.chainId = await this.$scrtjs.getChainId();
    this.height = await this.$scrtjs.getHeight();
  },
};
</script>
