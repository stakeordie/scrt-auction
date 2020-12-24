<template>
  <default-layout>
      <page>
          <columns number="2" number-s="1" weight="right">
            <h1>Create account</h1>
          
            <block>
              <p>Random mnemonic: {{randomMnemonic}}</p>
            </block>
          </columns>
      </page>
  </default-layout>
</template>

<script>
import DefaultLayout from '../../layouts/DefaultLayout.vue'
export default {
  components: { DefaultLayout },
  data () {
    return {
        randomMnemonic: "",
        account: null,
    }
  },
  async mounted () {
      this.randomMnemonic = this.$scrtjs.getRandomMnemonic();
      this.account = await this.$scrtjs.createAccount(this.randomMnemonic);
      console.log(this.account);
  },

}
</script>