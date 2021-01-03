<template>
  <section class="tx-send">
      <h2>Send</h2>
      <validation-observer v-slot="{ handleSubmit, invalid }">
      <form class="form" @submit.prevent="handleSubmit(send)">
        <ul>
          <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
        </ul>

        <div class="form__frame">

          <validation-provider rules="required" v-slot="{ errors }">
            <label for="payment-recipient">Recipient</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="payment-recipient" type="text" v-model.trim="payment.recipient" />
          </validation-provider>

          <validation-provider rules="required|integer" v-slot="{ errors }">
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
import { required, integer } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("integer", {
  ...integer,
  message: "This field must be an integer",
});

export default {
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      // Payment object inspired in Keplr's "send" UI 
      payment: {
        recipient: "",
        amount: 0,
        memo: "",
        fee: {
          amount: [
            {
              amount: "50000",
              denom: "uscrt",
            },
          ],
          gas: "100000",
        }
      },
      block: null,
      errors: [],
    };
  },
  methods: {
    send() {
      console.log(this.payment);
    }
  },
}
</script>

<style>

</style>