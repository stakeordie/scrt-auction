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
  computed: {
    randomMnemonic() {
      return this.$scrtjs.getRandomMnemonic(); 
    }
  },
};
</script>
