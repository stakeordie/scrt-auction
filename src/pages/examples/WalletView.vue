<template>
  <page>
      <h1>Wallet Info</h1>
    <columns number="2" number-s="1" weight="right">
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
                    <select class="auctions-tools__filter-select" name="sell-token" v-model="tokenAddress">
                        <option v-for="token in tokenData" :key="token.address" v-bind:value="token.address">
                            {{ token.symbol }}
                        </option>
                    </select>
                    <br />
                    <!-- <validation-provider v-slot="{ errors }">
                        <label for="payment-recipient">Contract Address</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="payment-recipient" type="text" v-model="contractAddress" />
                    </validation-provider> -->

                    <button :disabled="invalid">Create Viewing Key</button>

                </div>
            </form>
        </validation-observer>
      </block>
      <block>
        <h2>Wallet View</h2>
        <div v-for="(entry, index) in wallet" :key="entry.address" style="width: 100%">
            <table style="width: 100%; border: 1px solid white;">
                <tr style="border-bottom: 1px solid white;">
                    <th colspan="3" style="text-align: left; padding-left: 10px;">
                        {{entry.address}}
                    </th>
                </tr>
                <tr style="">
                    <th style="width: 5%;">&nbsp;</th>
                    <th style="text-align: left; border-bottom: 1px solid white;">
                        Contract Address
                    </th>
                    <th style="text-align: left; border-bottom: 1px solid white;">
                        Balance
                    </th>
                </tr>
                <tr v-for="(key, index2) in wallet[index].keys" :key="key.contractAddress">
                    <td></td>
                    <!--td v-if="key.contractCodeId == 1">{{tokenData.find(token => token.address === key.contractAddress).name + " (" + tokenData.find(token => token.address === key.contractAddress).symbol + ")"}}</td-->
                    <td >{{ wallet[index].keys[index2].token.name }} ({{wallet[index].keys[index2].token.symbol}})</td>
                    <td v-if="key.contractCodeId == 1">{{ wallet[index].keys[index2].balance /  Math.pow(10, wallet[index].keys[index2].token.decimals) }}</td>
                    <td v-else>Test</td>
                </tr>
            </table>
        </div>
        <button @click="refreshWallet">Refresh</button>
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
            tokenAddress: "",
            viewingKey: "",
            wallet: []
        }
    },
    created() {
        this.refreshWallet();
        this.$auctions.updateAllAuctions();
    },
    computed: {
        auctionsFilter() {
            return this.$store.state.$auctions.auctionsFilter;
        },
        ...mapGetters("$auctions", [
            "filteredAuctions",
            "sellDenoms", "bidDenoms", "tokenData"
        ])
    },
    methods: {
        async addViewingKey() {
            await this.$keplr.suggestToken(this.tokenAddress);
            const viewingKey = await this.$keplr.getSecret20ViewingKey(this.tokenAddress);
            // const viewingKey = await this.$auctions.createViewingKey(this.tokenAddress);
            await this.$auctions.addUpdateWalletKey(this.tokenAddress, viewingKey);
            this.refreshWallet();
        },
        async refreshWallet() {
            let aWallet = this.$vkeys.list(this.userAddress);
            /*let entryAddress = "";
            let info = {};
            let msg = {};
            let token = {};
            for(let i=0;i<aWallet.length;i++) {
                entryAddress = aWallet[i].address;
                for(let j=0; j<aWallet[i].keys.length; j++) {
                    switch(aWallet[i].keys[j].contractCodeId) {
                        case 1:
                        case 10:
                        case 1084:
                            msg = { "balance": { "address": entryAddress, "key": aWallet[i].keys[j].viewingKey}};
                            break;
                        default: 
                            aWallet.splice(i)
                            continue;
                    }
                    info = await this.$scrtjs.queryContract(aWallet[i].keys[j].contractAddress, msg);
                    if(info.balance?.amount) {
                        aWallet[i].keys[j].balance = info.balance.amount;
                    } else {
                        aWallet[i].keys[j].balance = "Not a SNIP-20"
                    }
                    aWallet[i].keys[j].token = this.tokenData.find(token => token.address === aWallet[i].keys[j].contractAddress);
                }
            }
            this.wallet = aWallet*/
        }
    }
};
</script>

<style></style>
