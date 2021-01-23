<template>
  <div class="vkeys-wallet">
    <a href="" @click="modalVisible = !modalVisible"><g-image class="wallet-icon" :class="{ enabled: savedViewingKey != null }" :immediate="true" src="@/assets/key-icon.png"></g-image></a>

    <secret-overlay :show="modalVisible"></secret-overlay>

    <transition 
      enter-active-class="animate__animated animate__flipInX"
      leave-active-class="animate__animated animate__flipOutX">

      <div class="modal wallet-modal" v-show="modalVisible">
        <h3>Viewing keys</h3>
        <dl>
          <dt>Factory address</dt>
          <dd>{{$auctions.factoryAddress | abbrv }}</dd>
        </dl>
        <app-vkey :account="account" :contract="$auctions.factoryAddress"></app-vkey>
        <a class="close" @click="modalVisible = false" href="">Close</a>
      </div>

    </transition>
  </div>
</template>

<script>
import AppVkey from './AppVkey';
import SecretOverlay from './SecretOverlay.vue';

export default {
  components: { AppVkey, SecretOverlay },
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
  width: 400px;
  h3 {
    color: var(--color-blue-primary);
    }

  dt {
    color: var(--color-purple-secondary);
  }
}

</style>