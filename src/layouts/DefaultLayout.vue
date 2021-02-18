<template>
  <simple-layout>
    <template #header>
      <simple-header>
        <g-link to="/" class="header__logo">
          <img src="@/assets/secretnetwork-logo-primary-white.svg">
        </g-link>
        <nav class="auctions-nav">
          <g-link to="/">Auctions list</g-link>
          <g-link to="/new">Create an auction</g-link>
        </nav>
        <div class="actions">
          <vkeys-wallet v-model="viewingKey" :account="userAddress" :contract="$auctions.factoryAddress"></vkeys-wallet>
          <keplr-user v-model="userAddress"></keplr-user>
        </div>
      </simple-header>
    </template>

    <slot></slot>

    <template #footer>
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
      userAddress: null,
      viewingKey: null,
      chainId: process.env.GRIDSOME_SECRET_CHAIN_ID
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
.header {
  &__logo {
    img {
      height: 50px;
    }
    //padding: var(--f-gutter-s) 0; // var(--f-gutter);
  }
}

nav {
  a {
    text-decoration: none;
    font-weight: bold;

    &.active--exact {
      color: var(--color-purple-secondary);
    }
  }
}

.actions {
  display: flex;
  flex-flow: row nowrap;
  gap: var(--f-gutter);
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
