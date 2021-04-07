<template>
<!-- TODO: #81 Notify user if viewing key exists, but it isn't working (another one has been created elsewhere) @the-dusky -->
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
          <dd>{{contract | abbrv }}</dd>
        </dl>
        <vkeys-address :account="account" :contract="contract">
          <template #description>
            <small>Creating a viewing key for the factory contract will allow you to see the auctions you have participated in as a buyer and seller.</small>
          </template>
        </vkeys-address>
        <a class="close" @click="modalVisible = false" href="">Close</a>
      </div>

    </transition>
  </div>
</template>

<script>
import SecretOverlay from './SecretOverlay.vue';
import VkeysAddress from './VkeysAddress.vue';

export default {
  components: { VkeysAddress, SecretOverlay },
  props: {
    value: {
      type: String,
      default: null,
    },
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
          const savedViewingKey = this.$vkeys.get(this.account, this.contract);
          this.$emit("input", savedViewingKey?.key);
          return savedViewingKey;
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