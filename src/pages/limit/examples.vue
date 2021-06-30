<template>
  <default-layout>
      <column>
          <block>
                <div class="rrrow">
                    <button @click="getOrderBooks">Get Order Books</button>
                    <pre v-show="!getBooksResponseClosed" class="rrrow-content">{{ orderBooks }}</pre>
                    <div v-show="!getBooksResponseClosed" class="rrrow-close" @click="getBooksResponseClosed = !getBooksResponseClosed">X</div>
                </div>
                <div class="rrrow">
                    <button @click="getAmmPairs">Get AMM Pairs</button>
                    <pre v-show="!getAmmPairsResponseClosed" class="rrrow-content">{{  ammPairs }}</pre>
                    <div v-show="!getAmmPairsResponseClosed" class="rrrow-close" @click="getAmmPairsResponseClosed = !getAmmPairsResponseClosed">X</div>
                </div>
        </block>
      </column>
      <column>
        <block>
            <h1>New Auction</h1>
            <validation-observer v-slot="{ handleSubmit, invalid }">
                <form class="auction-form" @submit.prevent="handleSubmit(createBid)">
                    <select name="sell-denom" v-model="bidForm.orderBook" @change="getSimulatedPrice">
                        <option v-for="orderBook in orderBooks" :key="orderBook.address" :value="orderBook">
                            {{ orderBook.name }}
                        </option>
                        <option :value="{ customSellFormTrigger: true }">Create New Orderbook</option>
                    </select>

                    <label for="minimum-bid-price">Simulated Price</label>
                    <input name="minimum-bid-price" type="text" v-model.trim="simulatedPrice" readonly/>

                    <label for="minimum-bid-price">Bid Price</label>
                    <input name="minimum-bid-price" type="text" v-model.trim="bidForm.bidPrice" />

                    <label for="minimum-bid-amount">Ask Amount</label>
                    <input name="minimum-bid-amount" type="text" v-model.trim="bidForm.askAmount" @change="getSimulatedPrice" />

                    <button :disabled="invalid">Continue</button>
                </form>
            </validation-observer>
        </block>
        <block>
            {{limitOrders}}
        </block>
      </column>
  </default-layout>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { required } from "vee-validate/dist/rules";

export default {
  components: { ValidationObserver, ValidationProvider },
    

    data() {
        return {
            bidForm: {
                orderBook: {},
                bidPrice: 0,
                askAmount: 0
            },
            simulatedPrice: 0,
            limitOrders: [],
            orderBooks: [],
            ammPairs: [],
            getBooksResponseClosed: false,
            getAmmPairsResponseClosed: false
        }
    },
    mounted() {
        this.orderBooks = this.$store.state.$limit.orderBooks;
        this.ammPairs = this.$store.state.$limit.ammPairs;
        // this.$limit.updateOrderBooks();
        // this.$limit.updateAmmPairs();
    },
    computed: {
        
    },
    methods: {
        async getOrderBooks() {
            if(!this.orderBooks[0]) {
                this.$limit.updateOrderBooks()
                this.orderBooks = await this.$limit.getOrderBooks;
            }
            this.getBooksResponseClosed = false;
        },
        async getAmmPairs() {
            if(!this.ammPairs[0]) {
                this.$limit.updateAmmPairs()
                this.orderBooks = await this.$limit.getAmmPairs;
            }
            this.getAmmPairsResponseClosed = false;
        },
        async createBid() {
            const response = await this.$limit.createBid(this.bidForm);
        },
        async getSimulatedPrice() {
            if(this.bidForm.orderBook.ammPairAddress) {
                const ammPair = this.ammPairs.find(ammPair => ammPair.address == this.bidForm.orderBook.ammPairAddress);
                const amount = this.bidForm.askAmount == 0 ? 1 : this.bidForm.askAmount;
                const response = await this.$limit.simulateSwapReverse(ammPair, amount);
                const orders = await this.$limit.getLimitOrders(this.bidForm.orderBook);
                if(orders) {
                    this.limitOrders = orders
                } else {
                    this.limitOrders = "No Active Orders Currently"
                }
                this.simulatedPrice = parseFloat(response) / amount
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .rrrow {
        display: flex;
        padding: 10px;
        flex-direction: row;
        justify-content: space-between;
        border: 1px solid white;
        max-height: 600px;
        overflow: scroll;
        .rrrow-content {
            max-width: 80%;
            overflow: scroll;
        }
        .rrrow-close {
            cursor:pointer;
        }
    }
</style>