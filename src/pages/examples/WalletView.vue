<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Wallet Info</h1>
      <block>
          <h2>Add to wallet</h2>
          <validation-observer v-slot="{handleSubmit, invalid}">
            <form class="form" @submit.prevent="handleSubmit(addViewingKey)">
                <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
                </ul>
                <div class="form__frame">
                <div>
                    <label for="payment-sender">My Address</label>
                    <keplr-account v-model="userAddress"></keplr-account>
                </div>

                <label class="auctions-tools__filter-label" for="sell-token">SNIP-20s</label><br/>
                <select class="auctions-tools__filter-select" name="sell-token" v-model="contractAddress">
                    <option value="">*</option>
                    <option v-for="sellToken in sellDenoms" :key="sellToken" v-bind:value="sellToken">
                        {{ sellToken }}
                    </option>
                </select><br/>

                <!-- <validation-provider v-slot="{ errors }">
                    <label for="payment-recipient">Contract Address</label>
                    <span class="error">{{ errors[0] }}</span>
                    <input name="payment-recipient" type="text" v-model="contractAddress" />
                </validation-provider> -->

                <button :disabled="invalid">Create Viewing Key</button>

                </div>
            </form>
        </validation-observer>
        <br/>
        <hr/>
        <h2>Wallet View</h2>
        <br>
        <div v-for="(entry, index) in wallet" :key="entry.address" style="width: 100%">
            <div>Address: {{entry.address}}</div>
            <br>
            <table style="width: 100%">
                <tr>
                    <th>
                        Contract Address
                    </th>
                    <th>
                        Balance
                    </th>
                </tr>
                <tr v-for="(key, index2) in wallet[index].keys" :key="key.contractAddress">
                    <th>{{key.contractAddress}}</th>
                    <th>{{wallet[index].keys[index2].balance}}</th>
                </tr>
            </table>
            <br>
            <br>
        </div>
        <button @click="refreshWallet">Refresh</button>
        <br>
      </block>
      <block>
        
      </block>
    </columns>
  </page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';
import { mapGetters } from 'vuex'

extend("required", {
  ...required,
  message: "This field is required",
});

export default {
    components: {
        ValidationObserver,
        ValidationProvider,
        KeplrAccount
    },
    data() {
        return {
            errors: [],
            userAddress: "",
            contractAddress: "",
            viewingKey: "",
            wallet: [],
            tokens: {
                "SODTA": "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga",
                "SODTB": "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy",
                "SODTC": "secret1rdz9e9hln0lv0y33se380fczmmst72ffzlqg9a",
                "SODTD": "secret1yt94lse0rl89a9kdylhr80jffpuekv0tzpx2k0",
                "SODTE": "secret18u0m2um6vv08ftzxls897gytd4tzcc2w6vlem6"
            }
        }
    },
    created() {
        this.refreshWallet();
        this.$auctions.updateAuctions();
    },
    computed: {
        auctionsFilter() {
            return this.$store.state.$auctions.auctionsFilter;
        },
        ...mapGetters("$auctions", [
            "filteredAuctions",
            "sellDenoms", "bidDenoms"
        ])
    },
    methods: {
        async addViewingKey() {
            console.log(this.tokens[this.contractAddress])
            const viewingKey = await this.$auctions.createViewingKey(this.tokens[this.contractAddress]);
            await this.$auctions.addUpdateWalletKey(this.tokens[this.contractAddress], viewingKey);
            this.refreshWallet();
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
                    } else {
                        aWallet[i].keys[j].balance = "Not a SNIP-20"
                    }
                }
            }
            this.wallet = aWallet
        }
    }
};
</script>

<style></style>
