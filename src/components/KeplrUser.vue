<template>
  <div class="keplr-user">
      <a href="" class="keplr-user__login" @click="connect()">Connect to "{{ chainId }}"</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
        account: null,
    }
  },
  computed: {
    chainId() {
      return this.$keplr.chainId; 
    }
  },
  methods: {
    async connect() {
      this.$keplr.enable();
    },
  },
  async created () {
    console.log(await this.$keplr.getKey());
  },

}
</script>

<style lang="scss" scoped>

</style>