<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': userAddress != null }"></div>
      <a href="" @click="clicked()">
        <img class="keplr__icon" src="@/assets/keplr-icon.svg">
      </a>
      <transition name="fade">
        <div v-if="userAddress" v-show="showDetails" class="keplr__account">
          <span class="account account__chain">{{ chainId }}</span>
          <span class="account account__address">{{userAddress }}</span>
        </div>
      </transition>
  </div>
</template>

<script>
const REFRESH_RATE = 1000;

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
    async clicked() {
      if(this.userAddress) {
        this.showDetails = !this.showDetails;
      } else {
        await this.$keplr.enable();
        this.updateAddress();
        this.showDetails = true;
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