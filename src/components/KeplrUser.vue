<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': userAddress != null }"></div>
      <a href="" @click="clicked()">
        <img class="keplr__icon" src="@/assets/keplr-icon.svg" :class="{ 'keplr--off': keplrIsOff }">
      </a>
        <transition 
          enter-active-class="animate__animated animate__flipInX"
          leave-active-class="animate__animated animate__fadeOutUp">
        <div v-if="userAddress" v-show="showDetails" class="keplr__account">
          <span class="account account__chain">{{ chainId }}</span>
          <span class="account account__address">{{userAddress }}</span>
        </div>
      </transition>
  </div>
</template>

<script>
const REFRESH_RATE = 1000;
const AUTOCLOSE_DETAILS = 3000;


export default {

  data () {
    return {
        userAddress: null,
        checkInterval: null,
        showDetails: false,

        keplrIsOff: false,
    }
  },
  computed: {
    chainId() {
      return this.$keplr.chainId; 
    },
  },
  methods: {
    async clicked() {
      await this.$keplr.enable();
      this.toggleDetails(true);
    },
    toggleDetails(value) {
      // If no value is passed then it just toggles
      if(value === undefined) {
        this.showDetails = !this.showDetails;
      } else {
        this.showDetails = value;
      }
       
      // Sets the autoclosing of the wallet details
      if(this.showDetails) {
        setTimeout(() => {
          this.showDetails = false;
        }, AUTOCLOSE_DETAILS);
      }
    },
    async updateAddress() {
      try {
        this.userAddress = await this.$keplr.getSelectedAddress();
      } catch(err) {
        this.keplrIsOff = true;
      }
    }
  },
  async mounted () {
    this.checkInterval = setInterval(() => {
        this.updateAddress();
      }, REFRESH_RATE);
    this.updateAddress();
  },
  beforeDestroy () {
    clearInterval(this.checkInterval);
  },
}
</script>

<style lang="scss" scoped>
.keplr {
  position: relative;

  &__icon {
    width: 32px;
  }

  &__account {
    position: absolute;
    right: 0;
    background-color: var(--default-background-color);
    padding: var(--gutter);
    z-index: 11000;

    box-shadow: 0px 0px 16px -6px rgba(0,0,0,1);
  }

  &--off {
    opacity: 0.5;
  }

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: #FF3100;

    &--online {
      background-color: #0AD32C;
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