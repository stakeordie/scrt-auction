<template>
  <div class="layout">
    <div class="layout-header">
      <simple-header mode="full">
        <div class="mobile-menu">
          <a href="" @click="menuMobileVisible = !menuMobileVisible"><img src="@/assets/mobile-nav.svg" alt=""></a>
        </div>
        <g-link to="/" class="header__logo">
          <img src="@/assets/secret_auctions_logo.svg">
        </g-link>
        <nav class="auctions-nav"></nav>
        <div class="actions">
          <site-clock></site-clock>
          <a class="button create_auction" href="/new">Create auction</a>
          <div class="keys-keplr">
            <vkeys-wallet v-model="viewingKey" :account="userAddress" :contract="$auctions.factoryAddress">
            </vkeys-wallet>
            <keplr-user v-model="userAddress"></keplr-user>
          </div>
        </div>
      </simple-header>
    </div>


    <div class="layout-content">

      <!-- <div class="layout-sidemenu" :class="{'mobile-hidden': !menuMobileVisible }">

        <ul class="app-menu">
          <li><g-link to="/">Current Auctions</g-link>
          <li><g-link to="/past">Past Auctions</g-link></li>
          <li><g-link to="/user">My Auctions</g-link></li>
          <li><g-link to="/new">Create an Auction</g-link></li>
        </ul>
      </div> -->

      <slot></slot>
      <div class="layout-footer ">
        <simple-footer class="stats">
          <span class="scrt">SCRT = $3.095472</span>
          <span>Pairs = 22</span>
          <span>Total Fees = 117,375,041</span>
          <span>Liquidity = 4.54b</span>
          <span>Total Volume = 39.13b</span>
        </simple-footer>
      </div>
    </div>

  </div>
</template>

<script>
  import KeplrUser from '../components/KeplrUser.vue'
  import VkeysWallet from '../components/VkeysWallet.vue'
  import SiteClock from '../components/SiteClock.vue'

  export default {
    components: {
      KeplrUser,
      VkeysWallet,
      SiteClock
    },
    data() {
      return {
        userAddress: null,
        viewingKey: null,
        chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,

        menuMobileVisible: false,
      }
    },
    watch: {
      // Only the viewing key is watched because if 
      // the account changes the vk will change too
      viewingKey(newValue, oldValue) {
        this.$auctions.updateAuctionsViewer({
          userAddress: this.userAddress,
          viewingKey: this.viewingKey,
        });
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
  @import "@lkmx/flare/src/functions/respond-to";

  .layout {
    --sidemenu-width: 250px;
    height: 100vh;
    display: grid;

    @include respond-to("<=s") {
      grid-template-rows: min-content 1fr;
    }

    @include respond-to(">=m") {
      grid-template-rows: min-content 1fr;
    }

    &-sidemenu {

      // @include respond-to("<=s") {
      //   display: none;
      // }

      &.mobile-hidden {
        @include respond-to("<=s") {
          display: none;
        }
      }

      @include respond-to(">=m") {
        grid-row: 1 / 3;
      }

      background-color: #0D1017;
      padding: var(--f-gutter);

      .header__logo img {
        padding-left: 10px;
      }
    }

    &-content {

      display: grid;
      height: 100vh;
      grid-template-columns: 1fr;

      @include respond-to("<=s") {
        grid-template-columns: 1fr;
      }

      background-image: url(../assets/illustration-bg.jpg);
      background-size: 100% auto;
      background-position: center top;
      background-repeat: no-repeat;

      .--flare-columns {
        --f-columns-normal-width-m: calc(var(--f-breakpoint-m) - var(--sidemenu-width));
        --f-columns-normal-width-l: calc(var(--f-breakpoint-l) - var(--sidemenu-width));
        --f-columns-normal-width-xl: calc(var(--f-breakpoint-xl) - var(--sidemenu-width));
        --f-columns-normal-width-xxl: calc(var(--f-breakpoint-xl) - var(--sidemenu-width));
        --f-columns-normal-width-xxxl: calc(var(--f-breakpoint-xxl) - var(--sidemenu-width));
      }
    }

    &-footer {
      grid-column: auto;

      @include respond-to("<=s") {
        padding: var(--f-gutter);
      }
    }
  }

  .app-menu {
    @include respond-to("<=s") {
      padding: var(--f-gutter) var(--f-gutter);

    }

    @include respond-to(">=m") {
      padding: var(--f-gutter-xl) var(--f-gutter);
    }

    margin-bottom: 0;

    li {
      font-weight: bold;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .mobile-menu {
    width: 32px;
    height: 32px;
    align-content: center;
    justify-content: center;
    display: flex;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
    }

    @include respond-to("<=s") {
      // position: absolute;
      // top: var(--f-gutter);
      // right: var(--f-gutter);
    }

    @include respond-to(">=m") {
      display: none;
    }
  }

  .sub-menu {
    padding: 0;

    li {
      padding-left: var(--f-gutter);
      margin-bottom: var(--f-gutter-xs);
    }

    a {
      font-size: 15px;
    }
  }

  .app-menu,
  .sub-menu {

    li,
    a {
      color: var(--color-light-gray);
      text-decoration: none;

      &.active--exact {
        font-weight: bold;
        color: var(--color-purple-secondary);
        font-size: 18px;
      }
    }
  }


  .header {
    &__logo {
      @include respond-to("<=s") {
        padding-left: var(--f-gutter-xs);
      }

      img {
        height: 48px;
      }
    }
  }

  .actions {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--f-gutter-s);
    position: relative;
    padding-left: var(--f-gutter);
    align-items: center;

    .create_auction {
      margin-bottom: 0;
    }

    .keys-keplr {
      display: flex;
      gap: var(--f-gutter);

      @include respond-to("<=s") {
        flex-direction: column;
        gap: 0;
      }
    }
  }

  .simple-footer {
    &.stats {
      background-color: black;
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      width: 100%;

      .--flare-frame {
        width: 100%;

        .--flare-block {
          .content {
            .box {
              gap: 16px;
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  .toasted-container {
    .toasted.outline.override {
      /* alert/success */


      /* Auto Layout */

      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 16px;

      width: 330px;
      height: 80px;

      /* secret/green */

      background: #5AA361;
      border-radius: 4px;

      color: #FFFFFF;
      font-family: Montserrat;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;

      .classAction {
        color: #FFFFFF;
      }
    }

  }
</style>