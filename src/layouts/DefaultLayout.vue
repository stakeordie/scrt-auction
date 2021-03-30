<template>
  <div class="layout">    
    <div class="layout-header">
        <!-- <simple-header mode="full">
          <div class="mobile-menu">
            <a href="" @click="menuMobileVisible = !menuMobileVisible"><img src="@/assets/mobile-nav.svg" alt=""></a>
          </div>
          <g-link to="/" class="header__logo">
            <img src="@/assets/secret_auctions_logo.svg">
          </g-link>
          <nav class="auctions-nav"></nav>
          <div class="actions">
            <site-clock></site-clock>
            <a class="button create_auction" href="/auctions/new">Create auction</a>
            <div class="keys-keplr">
              <vkeys-wallet v-model="viewingKey" :account="userAddress" :contract="$auctions.factoryAddress"></vkeys-wallet>
              <keplr-user v-model="userAddress"></keplr-user>
            </div>
          </div>
        </simple-header> -->
      </div>
    

    <div class="layout-content">

      <!-- <div class="layout-sidemenu" :class="{'mobile-hidden': !menuMobileVisible }">

        <ul class="app-menu">
          <li><g-link to="/auctions/">Current Auctions</g-link>
          <li><g-link to="/auctions/past">Past Auctions</g-link></li>
          <li><g-link to="/auctions/user">My Auctions</g-link></li>
          <li><g-link to="/auctions/new">Create an Auction</g-link></li>
        </ul>
      </div> -->

      <slot></slot>

      <!-- <div class="layout-footer">
        <simple-footer>
          <p>Built with <span class="emoji" title="stakeordie.js">&#x1F6F9;.js</span>, 
            <span class="emoji" title="Mr. Roboto's Secret Rust">&#x1F916;&#x1F980;</span>, and lots of <span class="emoji" title="TLC">♥️</span> by 
            <g-link to="https://secretnodes.com/secret/chains/secret-2/validators/73D9DDC9EBB5BDB44ADA9FF2051610B75CB31A8D">Mr. Roboto <span class="emoji">&#x1F916;</span>'s Secret</g-link>
            and 
            <g-link to="https://secretnodes.com/secret/chains/secret-2/validators/18B444E801687196D48A075D3622BE1AEE070C11">
              <span class="emoji">&#x1F6F9;</span> Stake or Die! <span class="emoji">&#x1F41D;</span><span class="emoji">&#x1F41D;</span><span class="emoji">&#x1F41D;</span>
            </g-link>
          </p>
        </simple-footer>
      </div> -->

    </div>

  </div>
</template>

<script>
import KeplrUser from '../components/KeplrUser.vue'
import VkeysWallet from '../components/VkeysWallet.vue'
import SiteClock from '../components/SiteClock.vue'

export default {
  components: { KeplrUser, VkeysWallet, SiteClock },
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
        viewingKey:  this.viewingKey,
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
    grid-template-columns: var(--sidemenu-width) 1fr;
    @include respond-to("<=s") {
      grid-template-columns: 1fr;
    }
    background-image: url(../assets/scrt-swirl.svg);
    background-size: 100% auto;
    background-position: center top;
    background-repeat: no-repeat;

    .--flare-columns {
      --f-columns-normal-width-m:    calc(var(--f-breakpoint-m) - var(--sidemenu-width));
      --f-columns-normal-width-l:    calc(var(--f-breakpoint-l) - var(--sidemenu-width));
      --f-columns-normal-width-xl:   calc(var(--f-breakpoint-xl) - var(--sidemenu-width));
      --f-columns-normal-width-xxl:  calc(var(--f-breakpoint-xl) - var(--sidemenu-width));
      --f-columns-normal-width-xxxl: calc(var(--f-breakpoint-xxl) - var(--sidemenu-width));
    }
  }

  &-footer {
      grid-column: 2;
      @include respond-to("<=s") {
        grid-column: auto;
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

.app-menu, .sub-menu {

  li, a {
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
  // flex-flow: row nowrap;
  gap: var(--f-gutter-l);
  position: relative;
  padding-left: var(--f-gutter);
  align-items: center;
  .create_auction {
    margin-bottom: 0;
  }
  .keys-keplr {
    display: flex;
    gap: var(--f-gutter);
    .vkeys-wallet {
      img {
        height: 39px;
        width: auto;
      }
    }
    img {
      display: flex;
      flex: auto;
      height: 32px;
      width: auto;
    }
    @include respond-to("<=s") {
      flex-direction: column;
      gap: 0;
    }
  }
}

.simple-footer {
  text-align: center;

  .box {
    padding: var(--f-gutter-l) 0;
  }
  
  .emoji {
    font-size: 1.3em;
    text-decoration: none;
    cursor: pointer;
  }

  a {
    font-weight: bold;
    color: var(--color-turquoise-secondary);
  }
  
  a:link {
    text-decoration: none;
  }

  a:hover {
    color: var(--color-purple-secondary);
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

    width: 450px;
    height: auto;

    /* secret/green */
    &.success {
      background: #5AA361;
    }
    &.error {
      background: #d53a2c;
    }
    border-radius: 4px;
    

    color: #FFFFFF;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    .closeAction {
      color: #FFFFFF;
    }
  }
  
}
</style>
