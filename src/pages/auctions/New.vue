<template>
    <page>
        <column :class="'new-auction__stage-' + stage" number="3" number-m="1" number-s="1">
            <block class="scrt-box">
                <h1>Auction Info</h1>
                <validation-observer v-slot="{ handleSubmit, invalid }">
                    <form class="auction-form" @submit.prevent="handleSubmit(submitInfo)">
                        <div class="auction-form__label">
                            <label for="auction-label">Label</label>
                            <a href="" @click="randomizeLabel()" class="auction-form__label-emoji no-button">{{ String.fromCodePoint($auctions.emojiHash(auctionForm.label)) }}</a>
                        </div>

                        <!-- Using keplr to get the account -->
                        <validation-provider class="auction-form__account" rules="required" v-slot="{ errors }">
                            <label for="auction-account">Account</label>
                            <span class="error" v-show="errors.length > 0">Authenticate using Keplr</span>
                            <keplr-account v-model.trim="auctionForm.account" :abbreviation="16"></keplr-account>
                        </validation-provider>

                        <!-- Sell token -->
                        <validation-provider class="auction-form__sell-amount" :rules="`required|max_decimals:${auctionForm.sellToken ? auctionForm.sellToken.decimals : 18}`" v-slot="{ errors }">
                            <label for="sell-amount">Selling</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="sell-amount" type="text" v-model.trim="auctionForm.sellAmount" />
                        </validation-provider>

                        <validation-provider class="auction-form__sell-denom" rules="required" v-slot="{ errors }">
                            <span class="error" v-show="errors.length > 0">Required</span>
                            <select name="sell-denom" v-model="auctionForm.sellToken">
                                <option value=""></option>
                                <option v-for="sellToken in availableTokens" :key="sellToken.address" v-bind:value="sellToken">
                                    {{ sellToken.symbol }}
                                </option>
                            </select>
                        </validation-provider>

                        <!-- Bid token -->
                        <validation-provider class="auction-form__bid-price" rules="required" v-slot="{ errors }">
                            <label for="minimum-bid-price">Bid price</label>
                            <span class="error" v-if="errors.length > 0">Required</span>
                            <input name="minimum-bid-price" type="text" v-model.trim="auctionForm.bidPrice" />
                        </validation-provider>

                        <validation-provider class="auction-form__min-bid-amount" rules="required|min_value:0" v-slot="{ errors }">
                            <label for="minimum-bid-amount">Minimum bid</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input name="minimum-bid-amount" readonly type="text" v-model="minBidAmount" />
                        </validation-provider>

                        <validation-provider class="auction-form__bid-denom" rules="required" v-slot="{ errors }">
                            <span class="error" v-if="errors.length > 0">Required</span>
                            <select name="bid-denom" v-model="auctionForm.bidToken">
                                <option value=""></option>
                                <option v-for="bidToken in availableTokens" :key="bidToken.address" v-bind:value="bidToken">
                                    {{ bidToken.symbol }}
                                </option>
                            </select>
                        </validation-provider>


                        <!-- New auction date time -->
                        <validation-provider class="auction-form__end-time" rules="required" v-slot="{ errors }">

                            <label for="auction-end-time">End time</label>
                            <span class="error">{{ errors[0] }}</span>
                            <input class="auction-form__end-time__time" readonly name="auction-end-time" type="text" v-model="endTimeString" />

                            <p>Can be closed after 
                                <input class="auction-form__end-time__amount" type="number" min="1" max="60" @change="updateEndTime()" v-model="endTimeAmount">
                                <select class="auction-form__end-time__unit" @change="updateEndTime()" v-model="endTimeUnit">
                                    <option value="1">minute<span v-if="endTimeAmount > 1">s</span></option>
                                    <option value="60">hour<span v-if="endTimeAmount > 1">s</span></option>
                                </select>
                            </p>
                        </validation-provider>

                        <!-- New auction description -->
                        <validation-provider class="auction-form__description">
                            <label for="auction-description">Description</label>
                            <textarea name="auction-description" v-model.trim="auctionForm.description" placeholder="This is optional"></textarea>
                        </validation-provider>

                        <button class="auction-form__info-action" :disabled="invalid || stage != 'info'">Continue</button>
                    </form>
                </validation-observer>
            </block>


            <block>
                <div class="stage-panel stage-panel__info">
                    <h3><span class="number">1</span> Fill the form</h3>
                    <div class="details">
                        <p>Fill up the form with the auction information.</p>
                        <p>Click <strong>"Continue"</strong> when you are ready.</p>
                    </div>
                </div>
                <div class="stage-panel stage-panel__auction">
                    <h3><span class="number">2</span> Create auction</h3>
                    <div class="details">
                        <p>We are ready to creat the auction. Please make sure to have enough gas and authorize both of them!</p>
                        <ul>
                            <li>An allowance is placed so the Secret Auctions Factory can sell your tokens.</li>
                            <li>The factory then creates your auction and lists it in the auctions list.</li>
                        </ul>
                        <button class="allowance-form__action" :disabled="stage != 'auction'" @click="createAuction()">Go</button>
                        <a href="" @click="stage = 'info'">Go back</a>
                    </div>
                </div>
                <div class="stage-panel stage-panel__keys">
                    <h3><span class="number">3</span> Viewing keys</h3>
                    <div class="details">
                        <p>You need a viewing key.</p>
                        <p>Viewing keys are used in the Secret Netwwork to get access to the Secret Auction bids.</p>
                        <g-link class="auction-creation__action-list" to="/auctions">See the auction list</g-link>
                    </div>
                </div>
            </block>

            <block>
                <div class="status">
                    <p></p>
                </div>
            </block>

        </column>
    </page>
</template>

<script>
import { mapGetters } from 'vuex'

import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, min_value } from "vee-validate/dist/rules";
import KeplrAccount from '../../components/KeplrAccount.vue';

extend("required", {
  ...required,
  message: "This field is required",
});

extend("min_value", {
  ...required,
  message: "Must be greater than 0",
});

extend("max_decimals", {
  params: ["maxDecimalsAllowed"],
  validate: (value, param) => {
    return parseInt(param.maxDecimalsAllowed) >= parseFloat(value).countDecimals();
  },
  message: "The max decimals allowed are {maxDecimalsAllowed}",
});

export default {
    components: { ValidationObserver, ValidationProvider, KeplrAccount },
    data() {
        return {
            stage: "info", // info, auction, keys
            interval: null,

            infoComplete: false,
            endTimeAmount: 1,
            endTimeUnit: "60",

            hasViewingKey: false,

            statusLog: [],

            auctionForm: {
                sellAmount: 0.1,
                sellToken: null,
                bidPrice: 1,
                bidToken: null,
                label: null,
                description: "",
                endTime: new Date(),
            },
        }
    },
    computed: {
        ...mapGetters("$auctions", [
            "availableTokens",
            "getToken"
        ]),
        minBidAmount() {
            if(this.auctionForm.bidToken) {
                return (this.auctionForm.bidPrice * this.auctionForm.sellAmount).toFixed(this.auctionForm.bidToken.decimals);
            } else {
                return this.auctionForm.bidPrice * this.auctionForm.sellAmount;
            }
        },
        endTimeString() {
            return this.auctionForm.endTime.toLocaleString();
        },
    },
    mounted () {
        this.updateEndTime();
        this.interval = setInterval(this.updateEndTime, 1000);
    },
    async created () {
        this.randomizeLabel();
        const viewingKey = await this.$auctions.getViewingKey(this.$store.state.$keplr.selectedAccount?.address, this.$auctions.factoryAddress);
        if(viewingKey) {
            this.hasViewingKey = true;
        }
    },
    destroyed () {
        clearInterval(this.interval);
    },
    methods: {
        submitInfo() {
            this.stage = "auction";
        },
        randomizeLabel() {
            this.auctionForm.label = "auction-" + Math.round(Math.random() * 1000000);
        },
        async createAuction() {
            const sellAmountToFractional = this.auctionForm.sellAmount * Math.pow(10, this.auctionForm.sellToken.decimals);
            const bidAmountToFractional = this.minBidAmount * Math.pow(10, this.auctionForm.bidToken.decimals);

            const consignedAllowance = await this.$auctions.consignAllowance(this.auctionForm.sellToken.address, sellAmountToFractional.toString());
            
            //Create auction
            const auction = await this.$auctions.createAuction(this.auctionForm.label,
                this.auctionForm.sellToken.address,
                this.auctionForm.bidToken.address,
                sellAmountToFractional.toString(),
                bidAmountToFractional.toString(),
                this.auctionForm.formDescription,

                // Converts from millis to a second-based UNIX friendly epoch time
                Math.round(this.auctionForm.endTime.getTime() / 1000)
            );
            // Log status
            console.log("new/CreateAuction/this.$scrtjs.decodedResponse(auction)"); console.log(this.$scrtjs.decodedResponse(auction))

            this.stage = "keys";
            // Create viewing key if none exists
            if(!this.hasViewingKey) {
                const viewingKey = await this.$auctions.createViewingKey(this.$auctions.factoryAddress);
                await this.$auctions.addUpdateWalletKey(this.$auctions.factoryAddress,viewingKey);
            }
        },
        updateEndTime() {
            if(this.stage == "info") {
                this.auctionForm.endTime = new Date((new Date()).getTime() + (Number(this.endTimeAmount || 1) * Number(this.endTimeUnit) * 60000));
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.--flare-columns {
    --f-columns-weight-ratio: 1.6;
}

.auction-form {
    display: grid;
    grid-template-columns: 70px 1fr 100px;
    column-gap: var(--f-gutter);
    align-items: end;

    select, textarea, input {
        width: 100%;
    }

    input:read-only {
        color: var(--f-default-text-color);
        background-color: var(--color-black);
        border: 1px solid var(--color-black);
        font-weight: 600;
    }

    label {
        margin-bottom: var(--f-gutter-xxs);
    }

    &__account {
        grid-column: 2 / 4;
    }
    &__sell-amount {
        grid-column: 1 / 3;
    }
    &__bid-amount {
        grid-column: 2 / 3;
    }
    &__bid-price {
        grid-column: 1 / 2;
    }
    &__bid-sell, &__bid-denom {
        grid-column: 3 / 4;
    }
    &__info-action, &__end-time, &__description {
        grid-column: 1 / 4;
    }

    .keplr__account {
        font-size: 21px;
    }

    &__label {
        text-align: center;
        align-self: start;
        &-emoji {
            font-size: 40px;
            text-decoration: none;
        }
        &-change {
            font-size: 13px;
        }
    }

    &__description textarea {
        min-height: 70px;
    }

    &__end-time {
        &__amount {
            display: inline;
            max-width: 4ch;
            margin: 0 1ch;
        }
        select {
            display: inline;
            width: min-content;
        }
    }
}

.allowance-form {
    &__action {
        width: 100%;
    }
}

.auction-creation {
    &__action-list {
        width: 100%;
    }
}

.stage-panel {
  background-color: var(--color-black);
  padding: var(--f-gutter);
  border-radius: 10px;
  margin-bottom: var(--f-gutter);

  .details {
      display: none;
  }

  p, li {
      font-size: 15px;
  }

  .number {
      display: inline-grid;
      margin-right: var(--f-gutter-s);
      background-color: var(--color-purple-primary);
      border-radius: 1000px;
      line-height: 1em;
      width:  30px;
      height: 30px;
      justify-items: center;
      align-items: center;
      padding-top: 2px;
  }

}


// All the stage fun comes here...
.new-auction {
    &__stage-info {
        
        .stage-panel__info {
            border: 1px solid rgba(255,255,255,0.5);
            .number {
                background-color: var(--color-yellow-secondary);
                color: black;
            }
            .details {
                display: block;
            }
        }
        .stage-panel__auction, .stage-panel__keys {
            opacity: 0.5;
        }
    }

    &__stage-auction {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info {
            .number {
                background-color: var(--color-positive);
            }
        }
        .stage-panel__auction {
            border: 1px solid rgba(255,255,255,0.5);
            .number {
                background-color: var(--color-yellow-secondary);
                color: black;
            }
            .details {
                display: block;
            }
        }
        .stage-panel__info, .stage-panel__keys {
            opacity: 0.5;
        }
    }

    &__stage-keys {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__auction {
            .number {
                background-color: var(--color-positive);
                color: black;
            }
            opacity: 0.5;
        }
        .stage-panel__keys {
            border: 1px solid rgba(255,255,255,0.5);
            .number {
                background-color: var(--color-positive);
                color: black;
            }
            .details {
                display: block;
            }
        }
    }
}

</style>