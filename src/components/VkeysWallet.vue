<template>
  <div class="vkeys-wallet">
    <a href="" @click="modalVisible = !modalVisible"><g-image class="wallet-icon" :class="{ enabled: savedViewingKey != null }" :immediate="true" src="@/assets/key-icon.png"></g-image></a>

    <transition 
      enter-active-class="animate__animated animate__flipInX"
      leave-active-class="animate__animated animate__fadeOutUp">

      <div class="wallet-modal" v-show="modalVisible">
        <app-vkey :account="account" :contract="$auctions.factoryAddress"></app-vkey>
      </div>

    </transition>
  </div>
</template>

<script>
import AppVkey from './AppVkey';

export default {
  components: { AppVkey },
  props: {
    account: {
      type: String,
      default: null
    },
    contract: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      modalVisible: false
    }
  },
  computed: {
      savedViewingKey() {
          return this.$vkeys.get(this.account, this.contract);
      }
  },
}
</script>

<style lang="scss">
.vkeys-wallet {
  position: relative;
}

.wallet-icon {
  width: 32px;
  height: auto;

  &:not(.enabled) {
    opacity: 0.5;
  }
}

.wallet-modal {
    width: 300px;
    position: absolute;
    right: 0;
    background-color: var(--default-background-color);
    padding: var(--gutter);
    z-index: 11000;

    padding-bottom: 0;

    box-shadow: 0px 0px 16px -6px rgba(0,0,0,1);
}
</style>