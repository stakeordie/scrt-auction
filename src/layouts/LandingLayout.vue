<template>
  <div class="landing-layout">
    <div class="layout-header">
      <simple-header mode="full">
        <div class="mobile-menu">
          <a href="" @click="menuMobileVisible = !menuMobileVisible"><img src="@/assets/mobile-nav.svg" alt=""></a>
        </div>
        <g-link to="/" class="header__logo">
          <img src="@/assets/secret_auctions_logo.svg">
        </g-link>
        <nav class="auctions-nav"></nav>
        <!-- Sandy Added -->
        <div class="actions">
          <site-clock></site-clock>
          <button @click="$router.push('/auctions')" class="white">Enter App</button>
        </div>
        <!-- Sandy Added -->
      </simple-header>
    </div>


    <div class="landing-layout-content">

      <!-- <div class="layout-sidemenu" :class="{'mobile-hidden': !menuMobileVisible }">

        <ul class="app-menu">
          <li><g-link to="/">Current Auctions</g-link>
          <li><g-link to="/past">Past Auctions</g-link></li>
          <li><g-link to="/user">My Auctions</g-link></li>
          <li><g-link to="/new">Create an Auction</g-link></li>
        </ul>
      </div> -->

      <slot></slot>
      <!-- TODO: #75 replace content with "built by stake or die" regular footer content @walter-lkmx
        -->
      <div class="landing-layout-footer ">
        <simple-footer class="stats">
          <!-- <span class="scrt">SCRT = $3.095472</span>
          <span>Pairs = 22</span>
          <span>Total Fees = 117,375,041</span>
          <span>Liquidity = 4.54b</span>
          <span>Total Volume = 39.13b</span> -->
          <p>Built with <span class="emoji" title="stakeordie.js">&#x1F6F9;.js</span>, 
            <span class="emoji" title="Mr. Roboto's Secret Rust">&#x1F916;&#x1F980;</span>, and lots of <span class="emoji" title="TLC">♥️</span> by 
            <g-link to="https://secretnodes.com/secret/chains/secret-2/validators/73D9DDC9EBB5BDB44ADA9FF2051610B75CB31A8D">Mr. Roboto <span class="emoji">&#x1F916;</span>'s Secret</g-link>
            and 
            <g-link to="https://secretnodes.com/secret/chains/secret-2/validators/18B444E801687196D48A075D3622BE1AEE070C11">
              <span class="emoji">&#x1F6F9;</span> Stake or Die! <span class="emoji">&#x1F41D;</span><span class="emoji">&#x1F41D;</span><span class="emoji">&#x1F41D;</span>
            </g-link>
          </p>
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

  // TODO: #68 update header to includ enter app and clock
  .white {
    background-color:white;
    color:black;
    cursor: pointer;
    &:hover {
      background-color:lightgray;
    }
  }

  .landing-layout {
    --sidemenu-width: 250px;
    height: 100vh;
    display: grid;

    @include respond-to("<=s") {
      grid-template-rows: min-content 1fr;
    }

    @include respond-to(">=m") {
      grid-template-rows: min-content 1fr;
    }

    .intro {
      height: calc(100vh - 68px - 80px);
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
      height: calc(100vh - 80px);
      grid-template-columns: 1fr;

      @include respond-to("<=s") {
        grid-template-columns: 1fr;
      }

      background-image: url(../assets/illustration-bg.jpg);
      background-size: cover;
      background-position: center center;
      @include respond-to("<=s") {
        background-position: left top;
      }
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
    // gap: var(--f-gutter-s);
    position: relative;
    padding-left: var(--f-gutter);
    align-items: center;

    button {
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
      background-color: rgba(black, 0.9);
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      width: 100%;
      padding: var(--f-gutter-xxs);

      .--flare-frame {
        width: 100%;

            .box {
              display: grid;
              // grid-template-columns: repeat(5, 1fr);
              gap: var(--f-gutter-xxs);
              @include respond-to("<=s") {
                gap: var(--f-gutter);
                // grid-template-columns: 1fr 1fr;
              }
              justify-content: center;
              span {
                text-align: center;
                @include respond-to("<=s") {
                  text-align: left;
                }
                &.scrt {
                font-weight: 700;
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