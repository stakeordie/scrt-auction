<template>
  <span class="token-amount">
      <span class="amount" :class="amountSize">{{amountHuman}}</span>
      <span class="denom" v-if="denom">{{denom}}</span>
      <span class="suffix" v-if="suffix">{{suffix}}</span>
  </span>
</template>

<script>
import { Decimal } from 'decimal.js';

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
        },
        suffix: {
            type: String,
            required: false,
        }
    },
    computed: {
        amountHuman() {
            return new Decimal(this.amount).toString();
        },
        amountSize() {
            return this.amountHuman.length < 12 ? 'small' : this.amountHuman.length < 18 ? 'medium' : 'large';
        }
    },
}
</script>

<style lang="scss" scoped>
  .token-amount {
      .amount {
        display: inline-block;
        text-align: right;
        margin-right: 0.5ch;

        &.medium {
            font-size: 0.9em;
        }

        &.large {
            font-size: 0.7em;
        }
      }
      .denom {
        display: inline-block;
        min-width: 4ch;
        font-size: 0.7em;
      }
      .suffix {
        display: inline-block;
        min-width: 4ch;
        font-size: 0.7em;
        margin-left: 0.5ch;
      }
  }
</style>