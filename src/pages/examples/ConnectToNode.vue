<template>
  <default-layout>
      <page>
          <h1>Connect to node</h1>
          <p>Chain ID: {{chainId}}</p>
          <p>Height: {{height}}</p>
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