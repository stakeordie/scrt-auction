<template>
    <page>
        <columns>
        <h1>Create Auction</h1>
        <block>
            <validation-observer v-slot="{ handleSubmit, invalid }">
            <form class="form" @submit.prevent="handleSubmit(createAuction)">
                <ul>
                <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
                </ul>

                <div class="form__frame">
                    <validation-provider rules="required" v-slot="{ errors }">
                        <label for="auction-title">Auction Title</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="auction-title" type="text" v-model="formTitle"/>
                    </validation-provider>
                    <validation-provider rules="required" v-slot="{ errors }">
                        <label for="sell-token">Sell Token</label>
                        <span class="error">{{ errors[0] }}</span>
                        <v-select name="sell-token" label="tokenName" :options="tokenOptions" v-model="formSellToken"></v-select>
                    </validation-provider>
                    <validation-provider rules="required" v-slot="{ errors }">
                        <label for="bid-token">Bid Token</label>
                        <span class="error">{{ errors[0] }}</span>
                        <v-select name="bid-token" label="tokenName" :options="tokenOptions" v-model="formBidToken"></v-select>
                    </validation-provider>
                    <validation-provider rules="required|integer" v-slot="{ errors }">
                        <label for="sell-amount">Amount for Sale</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="sell-amount" type="text" v-model="formSellAmount"/>
                    </validation-provider>
                    <validation-provider rules="required|integer" v-slot="{ errors }">
                        <label for="min-bid-amount">Minimum Acceptable Bid</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="min-bid-amount" type="text" v-model="formMinBidAmount"/>
                    </validation-provider>
                    <validation-provider rules="" v-slot="{ errors }">
                        <label for="description">Description</label>
                        <span class="error">{{ errors[0] }}</span>
                        <input name="description" type="text" v-model="formDescription"/>
                    </validation-provider>
                    <button :disabled="invalid">Click Me</button>
                </div>
            </form>
            </validation-observer>
        </block>
        </columns>
    </page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, integer } from "vee-validate/dist/rules";
import vSelect from "vue-select";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("integer", {
  ...integer,
  message: "This field must be an integer",
});

export default {
    components: { ValidationObserver, ValidationProvider, vSelect},
    data() {
        return {
            errors: [],
            viewingKey: "",
            formTitle: "",
            formSellToken: "",
            formBidToken: "",
            formSellAmount: "",
            formMinBidAmount: "",
            formDescription: "",
            tokenOptions: [
                {
                    tokenName: "sodta (SODTA)",
                    tokenAddress: "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga",
                },
                {
                    tokenName: "sodtb (SODTB)",
                    tokenAddress: "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy",
                },
                {
                    tokenName: "SODTC (SODTC)",
                    tokenAddress: "secret1rdz9e9hln0lv0y33se380fczmmst72ffzlqg9a",
                },
                {
                    tokenName: "Stake or Die Token D (SODTD)",
                    tokenAddress: "secret1yt94lse0rl89a9kdylhr80jffpuekv0tzpx2k0",
                },
                {
                    tokenName: "Stake or Die Token E (SODTE)",
                    tokenAddress: "secret18u0m2um6vv08ftzxls897gytd4tzcc2w6vlem6",
                }
            ]
        }
    },
    async mounted() {
        this.viewingKey = await this.$auctions.getViewingKey();
        const snip20Tokens = await this.$auctions.listAllTokens(); // Do we need this?
    },
    methods: {
        async createAuction() {
            //secretcli tx compute execute --label *factory_contract_label* '{"create_auction":{"label":"*your_auction_name*","sell_contract":{"code_hash":"*sale_tokens_code_hash*","address":"*sale_tokens_contract_address*"},"bid_contract":{"code_hash":"*bid_tokens_code_hash*","address":"*bid_tokens_contract_address*"},"sell_amount":"*amount_being_sold_in_smallest_denomination_of_sale_token*","minimum_bid":"*minimum_accepted_bid_in_smallest_denomination_of_bid_token*","description":"*optional_text_description*"}}' --from *your_key_alias_or_addr* --gas 400000 -y
            const consignAllowance = await this.$auctions.consignAllowance(this.formSellToken.tokenAddress, this.formSellAmount);
            console.log(consignAllowance);
            const auction = await this.$auctions.createAuction(this.formTitle,
                this.formSellToken.tokenAddress,
                this.formBidToken.tokenAddress,
                this.formSellAmount,
                this.formMinBidAmount,
                this.formDescription
            );
        }
    }
}
</script>

<style>

</style>