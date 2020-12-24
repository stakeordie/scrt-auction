<template>
  <default-layout>
      <page>
          
          <columns number="2" weight="right">
            <h1>Connect to node</h1>
          
            <block>
                <p>Chain ID: {{chainId}}</p>
                <p>Height: {{height}}</p>
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
        chainId: "",
        height: "",
    }
  },
  async mounted () {
      this.chainId = await this.$scrtjs.getChainId();
      this.height = await this.$scrtjs.getHeight();
  },

}
</script>

<style>

</style>