<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': userAddress != null }"></div>
      <a href="" @click="clicked()">
        <img class="keplr__icon" src="@/assets/keplr-icon.svg">
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
const TIME_TO_CLOSE = 3000;


export default {

  data () {
    return {
        userAddress: null,
        checkInterval: null,
        showDetails: false,
    }
  },
  computed: {
    chainId() {
      return this.$keplr.chainId; 
    }
  },
  methods: {
    toggleDetails(value) {
      if(value === undefined) {
        this.showDetails = !this.showDetails;
      } else {
        this.showDetails = value;
      }
       
      if(this.showDetails) {
        setTimeout(() => {
          this.showDetails = false;
        }, TIME_TO_CLOSE);
      }
    },
    async clicked() {
      if(this.userAddress) {
        this.toggleDetails();
      } else {
        await this.$keplr.enable();
        this.updateAddress();
        this.toggleDetails(true);
      }
    },
    async updateAddress() {
      this.userAddress = await this.$keplr.getSelectedAddress();
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

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    position: absolute;
    top: -4px;
    right: -4px;

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