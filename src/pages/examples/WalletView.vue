<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Wallet View</h1>
      <block>
          <validation-observer v-slot="{ handleSubmit, invalid }">
            <form class="form" @submit.prevent="handleSubmit(addViewingKey)">
                <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
                </ul>

                <div class="form__frame">

                <div>
                    <label for="payment-sender">My Address</label>
                    <keplr-account v-model="userAddress"></keplr-account>
                </div>

                <validation-provider rules="required" v-slot="{ errors }">
                    <label for="payment-recipient">Contract Address</label>
                    <span class="error">{{ errors[0] }}</span>
                    <input name="payment-recipient" type="text" v-model="contractAddress" />
                </validation-provider>

                <button :disabled="invalid">Create Viewing Key</button>

                </div>
            </form>
        </validation-observer>
      </block>
    </columns>
  </page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

extend("required", {
  ...required,
  message: "This field is required",
});

export default {
    components: {
        ValidationObserver, ValidationProvider, KeplrAccount
    },
    data() {
        return {
            errors: [],
            userAddress: "",
            contractAddress: "",
            viewingKey: ""
        }
    },
    async created() {
        this.localStorage = await this.$auctions.getWallet();
    },
    methods: {
        async addViewingKey() {
            const viewingKey = await this.$auctions.createViewingKey(this.contractAddress);
            console.log("Viewing Key Outside: " + viewingKey)
            await this.$auctions.addUpdateWalletKey(this.contractAddress, viewingKey);
        }
    }
};
</script>

<style></style>
