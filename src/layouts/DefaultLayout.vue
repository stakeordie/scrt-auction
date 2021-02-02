<template>
  <simple-layout>
    <template #header>
      <simple-header>
        <g-link to="/" class="header__logo">
          <img src="@/assets/secretnetwork-logo-primary-white.svg">
        </g-link>
        <nav>
          <g-link to="/auctions">Auctions</g-link>
          <g-link to="/faqs">FAQs</g-link>
        </nav>
        <div class="actions">
          <vkeys-wallet :account="keplrAccount" :contract="$auctions.factoryAddress"></vkeys-wallet>
          <keplr-user v-model="keplrAccount"></keplr-user>
        </div>
      </simple-header>
    </template>

    <slot></slot>

    <template #footer>
      <simple-footer>
        <p>Create an issue on <g-link to="https://github.com/stakeordie/scrt-auction">Github</g-link> if you have thoughts, notice any issues, or want to see any specific features.</p>
      </simple-footer>
    </template>

  </simple-layout>
</template>

<script>
import KeplrUser from '../components/KeplrUser.vue'
import VkeysWallet from '../components/VkeysWallet.vue'

export default {
  components: { KeplrUser, VkeysWallet },
  data() {
    return {
      keplrAccount: null
    }
  },
}
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style lang="scss">
.header {
  &__logo {
    img {
      height: 50px;
    }
    //padding: var(--f-gutter-s) 0; // var(--f-gutter);
  }
}
.actions {
  display: flex;
  flex-flow: row nowrap;
  gap: var(--f-gutter);
}
</style>
