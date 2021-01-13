<template>
  <section class="tx-send">
      <h2>Send</h2>
      <validation-observer v-slot="{ handleSubmit, invalid }">
      <form class="form" @submit.prevent="handleSubmit(send)">
        <ul>
          <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
        </ul>

        <div class="form__frame">

          <div>
            <label for="payment-sender">Sender</label>
            <keplr-account v-model="payment.sender"></keplr-account>
          </div>

          <validation-provider rules="required" v-slot="{ errors }">
            <label for="payment-recipient">Recipient</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="payment-recipient" type="text" v-model.trim="payment.recipient" />
          </validation-provider>

          <validation-provider rules="required" v-slot="{ errors }">
            <label for="token-contract-address">Token</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="token-contract-address" type="text" v-model="payment.tokenAddress" />
          </validation-provider>

          <validation-provider rules="required|min_value:1" v-slot="{ errors }">
            <label for="payment-amount">Amount</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="payment-amount" type="text" v-model.trim="payment.amount" />
          </validation-provider>

          <validation-provider v-slot="{ errors }">
            <label for="payment-memo">Memo</label>
            <span class="error">{{ errors[0] }}</span>
            <textarea name="payment-memo" v-model.trim="payment.memo"></textarea>
          </validation-provider>

          <button :disabled="invalid">Send</button>

        </div>
      </form>
    </validation-observer>

  </section>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value } from "vee-validate/dist/rules";
import KeplrAccount from '../../../components/KeplrAccount.vue';

extend("required", {
  ...required,
  message: "This field is required",
});

extend("min_value", {
  ...min_value,
  message: "Please enter a value greater than 1",
});

export default {
  components: { ValidationObserver, ValidationProvider, KeplrAccount },
  data() {
    return {
      payment: {
        recipient: "",
        amount: 1,
        memo: "",
        tokenAddress: ""
      },
      block: null,
      errors: [],
    };
  },
  methods: {
    send() {
      this.$scrtjs.transferSnip20Tokens(this.payment);
    },
  },
}
</script>

<style>

.form__frame {
  max-width: 500px;
}

</style>