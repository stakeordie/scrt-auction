<template>
    <page>
        <columns number="2" number-s="1" weight="right">
            <h1>Transactions</h1>
            <p>Send SCRT to an account</p>
            <block>
                <form class="form" @submit.prevent="handleSubmit(mintTokens)">
                    <div class="form__frame">
                        <div>
                            <label for="payment-sender">My Address</label>
                            <keplr-account v-model="mint.userAddress"></keplr-account>
                        </div>
                        <div>
                            <label for="payment-recipient">Recipient</label>
                            <input name="payment-recipient" type="text" v-model.trim="mint.recipient" />
                        </div>
                        <div>
                            <label class="auctions-tools__filter-label" for="sell-token">SNIP-20s</label><br/>
                            <select class="auctions-tools__filter-select" name="sell-token" v-model="mint.tokenAddress">
                                <option v-for="token in tokenData" :key="token.address" :value="token.address">
                                    {{ token.symbol }}
                                </option>
                            </select>
                        </div>
                        <br />
                        <button>Mint Tokens</button>

                    </div>
                </form>
            </block>
        </columns>
    </page>
</template>

<script>
import KeplrAccount from '../../components/KeplrAccount.vue';
import { mapGetters } from 'vuex'

export default {
    components: {
        KeplrAccount
    },
    data() {
        return {
            mint: {
                tokenAddress: null,
                userAddress: null,
                recipient: null
            }
        }
    },
    computed: {
        ...mapGetters("$auctions", [
            "tokenData"
        ])
    },
    methods: {
        mintTokens() {
            console.log(this.mint)
        }
    }
}
</script>

<style>

</style>