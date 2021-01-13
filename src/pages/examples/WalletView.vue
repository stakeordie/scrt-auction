<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Wallet View</h1>
      <block>

      </block>
    </columns>
  </page>
</template>

<script>

export default {
    data() {
        return {
            localStorage
        }
    },
    async created() {
        this.localStorage = await this.$auctions.getWallet();
        console.log(this.localStorage)
    }
};
</script>

<style></style>
