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
      <block>
        <button @click="refreshWallet">refresh</button>
        <ul v-for="(entry, index) in wallet" :key="entry.address">
            <li>For Address {{entry.address}}</li>
            <li v-for="(key, index2) in wallet[index].keys" :key="key.contractAddress">
                <span>Contract: {{key.contractAddress}}</span>
                <span>Balance: {{wallet[index].keys[index2].balance}}</span>
            </li>
        </ul>    
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
            viewingKey: "",
            wallet: []
        }
    },
    mounted() {
        this.refreshWallet();
    },
    methods: {
        async addViewingKey() {
            const viewingKey = await this.$auctions.createViewingKey(this.contractAddress);
            console.log("Viewing Key Outside: " + viewingKey)
            await this.$auctions.addUpdateWalletKey(this.contractAddress, viewingKey);
        },
        async refreshWallet() {
            let aWallet = await this.$auctions.getWallet();
            let entryAddress = "";
            let info = {};
            let msg = {};
            for(let i=0;i<aWallet.length;i++) {
                entryAddress = aWallet[i].address;
                for(let j=0; j<aWallet[i].keys.length; j++) {
                    msg = { "balance": { "address": entryAddress, "key": aWallet[i].keys[j].viewingKey}};
                    //console.log(entryAddress + ": " + aWallet[i].keys[j].contractAddress + " | " +aWallet[i].keys[j].viewingKey);
                    info = await this.$scrtjs.queryContract(aWallet[i].keys[j].contractAddress, msg);
                    if(info.balance?.amount) {
                        aWallet[i].keys[j].balance = info.balance.amount;
                    }
                }
            }
            this.wallet = aWallet
        }
    }
};
</script>

<style></style>
