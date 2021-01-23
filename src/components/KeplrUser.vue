<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': address }"></div>
      <a href="" @click="clicked()">
        <img class="keplr__icon" src="@/assets/keplr-icon.svg" :class="{ 'keplr--off': keplrIsOff }">
      </a>

      <secret-overlay :show="showDetails"></secret-overlay>

      <transition 
        enter-active-class="animate__animated animate__flipInX"
        leave-active-class="animate__animated animate__flipOutX">

        <div v-show="showDetails" class="modal user-modal">
          <h3>Keplr account</h3>
          <div v-show="address" class="keplr__account">
            <!-- this.$keplr.chainId is not reactive but there's no need, it's left here as an example -->
            <dl>
              <dt>{{ $keplr.chainId }}</dt>
              <dd>{{ address | bech32 }}</dd>
            </dl>
            <a class="close" @click="showDetails = false" href="">Close</a>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
const AUTO_CLOSE_TIME = 3000;

import SecretOverlay from './SecretOverlay.vue';

export default {
  components: { SecretOverlay },
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
        showDetails: false,
        keplrIsOff: false,
    }
  },
  computed: {
    address() {
      this.$emit("input", this.$store.state.$keplr.selectedAccount?.address);
      return this.$store.state.$keplr.selectedAccount?.address;
    },
  },
  methods: {
    async clicked() {
      if(!this.address) {
        this.$keplr.enable();
        this.toggleDetails(true);
      } else {
        this.toggleDetails();
      }
    },

    toggleDetails(value) {
      this.showDetails = value || !this.showDetails;
    },
  },
}
</script>

<style lang="scss" scoped>
.keplr {
  position: relative;

  &__icon {
    width: 32px;
  }

  &__error {
    display: block;
    min-width: max-content;
    color: var(--default-error-color);
  }

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: var(--default-error-color);

    &--online {
      background-color: var(--default-success-color, green);
    }

  }
  
  .user-modal {
    width: 400px;
    h3 {
      color: var(--color-purple-secondary);
    }

    dt {
      color: var(--color-blue-primary);
    }
  }

  .account {
    display: block;
    &__chain {
      text-transform: uppercase;
      font-size: 0.75em;
    }
    &__address {
      font-weight: bold;
    }
  }
}
</style>