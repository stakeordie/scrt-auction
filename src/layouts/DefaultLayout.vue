<template>
  <simple-layout>
    <template #header>
      <simple-header>
        <g-link to="/" class="header__logo">
          <img src="@/assets/secret-logo--white.svg">
        </g-link>
        <nav>
          <g-link to="/auctions">Auctions</g-link>
          <g-link to="/faqs">FAQs</g-link>
        </nav>
        <div class="actions">
          <div class="user-info">
            <vkeys-wallet :account="keplrAccount" :contract="$auctions.factoryAddress"></vkeys-wallet>
            <keplr-user v-model="keplrAccount"></keplr-user>
          </div>
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
import ViewingKey from '../components/ViewingKey.vue'
import VkeysWallet from '../components/VkeysWallet.vue'

export default {
  components: { KeplrUser, ViewingKey, VkeysWallet },
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
  .user-info {
    display: flex;
    flex-flow: row nowrap;
  }
}
</style>
