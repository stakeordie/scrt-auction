<template>
  <div class="vkeys-wallet">
    <a href="" @click="modalVisible = !modalVisible"><g-image class="wallet-icon" :class="{ enabled: savedViewingKey != null }" :immediate="true" src="@/assets/key-icon.png"></g-image></a>

    <transition 
      enter-active-class="animate__animated animate__flipInX"
      leave-active-class="animate__animated animate__flipOutX">

      <div class="wallet-modal" v-show="modalVisible">
        <h5>Viewing keys</h5>
        <dl>
          <dt>Factory address</dt>
          <dd>{{$auctions.factoryAddress | abbrv }}</dd>
        </dl>
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
    width: 320px;
    position: absolute;
    right: 0;
    background-color: var(--default-background-color);
    z-index: 11000;
    padding: var(--gutter);
    border-radius: var(--gutter);


    background-image: radial-gradient(86% 65%, #232323 86%, #050709 100%);
    padding-bottom: 0;
    box-shadow: 0px 0px 16px -6px rgba(0,0,0,1);

    dt {
      color: var(--color-blue-primary);
    }
}
</style>