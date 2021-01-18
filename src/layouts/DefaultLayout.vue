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
            <keplr-user></keplr-user>
          </div>
        </div>
      </simple-header>
    </template>

    <slot></slot>

    <template #footer>
      <simple-footer>
        <p>Secret Project</p>
      </simple-footer>
    </template>

  </simple-layout>
</template>

<script>
import KeplrUser from '../components/KeplrUser.vue'

export default {
  components: { KeplrUser },  
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
</style>
