<template>
  <div class="keplr-user">
      <button class="keplr-user__login" @click="login()">Log in</button>
  </div>
</template>

<script>
export default {
  methods: {
      login() {
          this.$keplr.login();
      },
  },

}
</script>

<style lang="scss" scoped>

</style>