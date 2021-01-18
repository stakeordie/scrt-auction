<template>
    <page>
        <column mode-xl="slim">
            <h1>New auction</h1>
            <p>Consider visiting the FAQs to learn more about the process.</p>
        </column>
        <column number="2" number-s="1" mode-xl="slim">
            <block class="scrt-box">
                <h2>Info</h2>
                <validation-observer v-slot="{ handleSubmit, invalid }">
                    <form class="auction-form" @submit.prevent="handleSubmit(submitInfo)">
                        <div class="auction-form__account">
                            <label for="auction-account">Account</label>
                            <keplr-account v-model.trim="auctionForm.account"></keplr-account>
                        </div>

                        <!-- New auction label -->
                        <validation-provider class="auction-form__label" rules="required" v-slot="{ errors }">
                            <label for="auction-label">Label</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="auction-label" type="text" v-model.trim="auctionForm.label" placeholder="Enter a label for your auction" />
                        </validation-provider>

                        <!-- New auction description -->
                        <validation-provider class="auction-form__description">
                            <label for="auction-description">Description -optional-</label>
                            <textarea name="auction-description" v-model.trim="auctionForm.description"></textarea>
                        </validation-provider>

                        <!-- Sell token -->
                        <validation-provider class="auction-form__sell-amount" rules="required" v-slot="{ errors }">
                            <label for="sell-amount">Selling</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="sell-amount" type="text" v-model.trim="auctionForm.sellAmount" />
                        </validation-provider>

                        <validation-provider class="auction-form__sell-denom" rules="required" v-slot="{ errors }">
                            <span class="error" v-if="errors.length > 0">Required</span>
                            <select name="sell-denom" v-model="auctionForm.sellTokenAddress">
                                <option value=""></option>
                                <option v-for="sellToken in availableTokens" :key="sellToken.address" v-bind:value="sellToken.address">
                                    {{ sellToken.symbol }}
                                </option>
                            </select>
                        </validation-provider>

                        <!-- Bid token -->
                        <validation-provider class="auction-form__bid-amount" rules="required" v-slot="{ errors }">
                            <label for="minimum-bid-amount">Minimum bid</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="minimum-bid-amount" type="text" v-model.trim="auctionForm.bidAmount" />
                        </validation-provider>

                        <validation-provider class="auction-form__bid-denom" rules="required" v-slot="{ errors }">
                            <span class="error" v-if="errors.length > 0">Required</span>
                            <select name="bid-denom" v-model="auctionForm.bidTokenAddress">
                                <option value=""></option>
                                <option v-for="bidToken in availableTokens" :key="bidToken.address" v-bind:value="bidToken.address">
                                    {{ bidToken.symbol }}
                                </option>
                            </select>
                        </validation-provider>


                        <!-- New auction date time -->
                        <validation-provider class="auction-form__end-time" rules="required" v-slot="{ errors }">
                            <label for="auction-end-time">End time</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="auction-end-time" type="datetime-local" v-model.trim="auctionForm.endTime" />
                        </validation-provider>

                        <button class="auction-form__info-action" :disabled="invalid">Click Me</button>
                    </form>
                </validation-observer>
            </block>
            <block>
                <h2>Status</h2>
                <div class="stages stages__info"></div>
                <div class="stages stages__allowance"></div>
                <div class="stages stages__creation"></div>
            </block>
        </column>
    </page>
</template>

<script>
import { mapGetters } from 'vuex'

import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value, max_decimals } from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

extend("required", {
  ...required,
  message: "This field is required",
});

export default {
    components: { ValidationObserver, ValidationProvider, KeplrAccount },
    data() {
        return {
            step: "info", // info, allowance, auction
            auctionForm: {
                sellAmount: 0.0,
                sellTokenAddress: "",
                bidAmount: 0.0,
                bidTokenAddress: "",
                label: "",
                endTime: Date.now(),
            },
        }
    },
    computed: {
        ...mapGetters("$auctions", [
        "availableTokens", 
        ])
    },
    methods: {
        submitInfo() {
            
        }
    },
}
</script>

<style lang="scss" scoped>

.auction-form {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: var(--f-gutter);
    align-items: end;

    select, textarea, input {
        width: 100%;
    }

    label {
        margin-bottom: var(--f-gutter-xxs);
    }

    &__sell-amount, &__bid-amount{
        grid-column: 1 / 2;
    }
    &__bid-sell, &__bid-denom {
        grid-column: 2 / 3;
    }
    &__account, &__label, &__info-action, &__description, &__end-time {
        grid-column: 1 / 3;
    }
}

</style>