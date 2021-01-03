<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Random mnemonic &amp; Query account</h1>
      <block>
        <form>
          <label>Random mnemonic</label>
          <textarea readonly v-model="randomMnemonic"></textarea>
        </form>
      </block>
    </columns>
  </page>
</template>

<script>
export default {
  data() {
    return {
      randomMnemonic: "",
      account: null,
    };
  },
  async mounted() {
    this.randomMnemonic = this.$scrtjs.getRandomMnemonic();
    this.account = await this.$scrtjs.queryAccountFromMnemonic(
      this.randomMnemonic
    );

    // The account will be undefined unless is previously funded
    console.log(this.account);
  },
};
</script>
