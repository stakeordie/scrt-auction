<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': address }"></div>
      <a href="" @click="clicked()">
        <img class="keplr__icon" src="@/assets/keplr-icon.svg" :class="{ 'keplr--off': keplrIsOff }">
      </a>
      <transition 
        enter-active-class="animate__animated animate__flipInX"
        leave-active-class="animate__animated animate__fadeOutUp">

        <div v-show="showDetails" class="keplr__details">
          <div v-show="address" class="keplr__account">
            <!-- this.$keplr.chainId is not reactive but there's no need, it's left here as an example -->
            <span class="account account__chain">{{ $keplr.chainId }}</span>
            <span class="account account__address">{{ address }}</span>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
const AUTO_CLOSE_TIME = 3000;

export default {
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
      if(this.showDetails) {
        setTimeout(() => { this.showDetails = false}, AUTO_CLOSE_TIME);
      }
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

  &__details {
    position: absolute;
    right: 0;
    background-color: var(--default-background-color);
    padding: var(--gutter);
    z-index: 10000;

    box-shadow: 0px 0px 16px -6px rgba(0,0,0,1);
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