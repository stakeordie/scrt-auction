<template>
  <div class="layout">
    <div class="layout-sidemenu">
      <g-link to="/" class="header__logo">
        <img src="@/assets/secret_auctions_logo.svg">
      </g-link>

      <ul class="app-menu" :style="{ display: menuMobileVisible ? 'block' : 'none'}">
        <li><g-link to="/">Current Auctions</g-link>
        <li><g-link to="/past">Past Auctions</g-link></li>
        <li><g-link to="/user">My Auctions</g-link></li>
        <li><g-link to="/new">Create an Auction</g-link></li>
      </ul>

      <div class="mobile-menu">
        <a href="" @click="menuMobileVisible = !menuMobileVisible"><img src="@/assets/mobile-nav.svg" alt=""></a>
      </div>
    </div>
    

    <div class="layout-content">

      <div class="layout-header">
        <simple-header mode="full">
          <nav class="auctions-nav"></nav>
          <div class="actions">
            <a class="button" href="/new">Create auction</a>
            <vkeys-wallet v-model="viewingKey" :account="userAddress" :contract="$auctions.factoryAddress"></vkeys-wallet>
            <keplr-user v-model="userAddress"></keplr-user>
          </div>
        </simple-header>
      </div>

      <slot></slot>

      <div class="layout-footer">
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
      </div>

    </div>

  </div>
</template>

<script>
import KeplrUser from '../components/KeplrUser.vue'
import VkeysWallet from '../components/VkeysWallet.vue'

export default {
  components: { KeplrUser, VkeysWallet },
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
    grid-template-columns: var(--sidemenu-width) 1fr;
  }

  &-sidemenu {
    background-color: #0D1017;
    padding: var(--f-gutter);

    .header__logo img {
      padding-left: 10px;
    }
  }

  &-content {
    height: 100vh;
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
  display: flex;
  align-content: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }

  @include respond-to("<=s") {
    position: absolute;
    top: var(--f-gutter);
    right: var(--f-gutter);
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
    img {
      height: 48px;
    }
  }
}

.actions {
  display: flex;
  flex-flow: row nowrap;
  gap: var(--f-gutter);
  position: relative;
  top: 6px;
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
</style>
