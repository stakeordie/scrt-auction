<template>
  <span class="token-amount">
      <span class="amount">{{amountHuman}}</span>
      <span class="denom" v-if="denom">{{denom}}</span>
  </span>
</template>

<script>
export default {
    props: {
        functional: true,
        name: 'TokenAmount',
        amount: {
            type: Number,
            default: 0,
        },
        decimals: {
            type: Number,
            default: 0,
        },
        denom: {
            type: String,
            required: false,
        }
    },
    computed: {
        amountHuman() {
            return this.amount.toFixed(this.decimals).replace(/\.?0+$/,""); 
        },
    },
}
</script>

<style lang="scss" scoped>
  .token-amount {
      .amount {
        display: inline-block;
        text-align: right;
        margin-right: 1ch;
      }
      .denom {
        display: inline-block;
        min-width: 4ch;
        font-size: 0.7em;
      }
  }
</style>