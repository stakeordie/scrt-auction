<template>
    <default-layout>
        <validation-observer v-slot="{ handleSubmit, invalid }">
            <page>
                <column :class="['new-auction', 'new-auction__stage-' + stage]" number="2" number-s="1">
                    <block>
                        <h1>New Auction</h1>
                        <form class="auction-form" @submit.prevent="handleSubmit(submitInfo)">
                            <div class="auction-form__label">
                                <label for="auction-label">Emoji</label>
                                <a href="" :title="auctionForm.label" @click="randomizeLabel()" class="auction-form__label-emoji no-button">{{ String.fromCodePoint($auctions.emojiHash(auctionForm.label)) }}</a>
                            </div>

                            <!-- Using keplr to get the account -->
                            <validation-provider class="auction-form__account" rules="required" v-slot="{ errors }">
                                <label for="auction-account">Account</label>
                                <span class="error" v-show="errors.length > 0">Authenticate using Keplr</span>
                                <keplr-account v-model="auctionForm.account" :abbreviation="16"></keplr-account>
                            </validation-provider>

                            <!-- Sell token -->
                            <validation-provider class="auction-form__sell-amount" :rules="`required|max_decimals:${auctionForm.sellToken ? auctionForm.sellToken.decimals : 18}`" v-slot="{ errors }">
                                <label for="sell-amount">Selling</label>
                                <span class="error">{{ errors[0] }}</span>
                                <input name="sell-amount" type="text" v-model.trim="auctionForm.sellAmount" />
                            </validation-provider>

                            <validation-provider class="auction-form__sell-denom" rules="required" v-slot="{ errors }">
                                <span class="error">{{ errors[0] }}</span>
                                <select name="sell-denom" v-model="auctionForm.sellToken">
                                    <option value="" disabled selected hidden>Sell Token</option>
                                    <option v-for="sellToken in availableTokens" :key="sellToken.address" v-bind:value="sellToken">
                                        {{ sellToken.symbol }}
                                    </option>
                                </select>
                            </validation-provider>

                            <!-- Bid token -->
                            <validation-provider class="auction-form__bid-price" rules="required" v-slot="{ errors }">
                                <label for="minimum-bid-price">Asking Price</label>
                                <span class="error">{{ errors[0] }}</span>
                                <input name="minimum-bid-price" type="text" v-model.trim="auctionForm.bidPrice" />
                            </validation-provider>

                            <validation-provider class="auction-form__min-bid-amount" :rules="`required|greater_than:0|max_decimals:${auctionForm.bidToken ? auctionForm.bidToken.decimals : 18}`" v-slot="{ errors }">
                                <label for="minimum-bid-amount">Minimum bid</label>
                                <span class="error">{{ errors[0] }}</span>
                                <input name="minimum-bid-amount" readonly type="text" v-model="minBidAmount" />
                            </validation-provider>

                            <validation-provider class="auction-form__bid-denom" rules="required" v-slot="{ errors }">
                                <span class="error">{{ errors[0] }}</span>
                                <select name="bid-denom" v-model="auctionForm.bidToken" required>
                                    <option value="" disabled selected hidden>Bid Token</option>
                                    <option v-for="bidToken in availableTokens" :key="bidToken.address" v-bind:value="bidToken">
                                        {{ bidToken.symbol }}
                                    </option>
                                </select>
                            </validation-provider>

                            <!-- New auction date time -->
                            <validation-provider class="auction-form__end-time" rules="required" v-slot="{ errors }">

                                <label for="auction-end-time">Target Close</label>
                                <span class="error">{{ errors[0] }}</span>
                                <input class="auction-form__end-time__time" readonly name="auction-end-time" type="text" v-model="endTimeString" />

                                <p>Can be closed after 
                                    <input class="auction-form__end-time__amount" type="number" min="1" max="60" placeholder="1" @change="updateEndTime()" v-model="endTimeAmount">
                                    <select class="auction-form__end-time__unit" @change="updateEndTime()" v-model="endTimeUnit">
                                        <option value="1">minute<span v-if="endTimeAmount != 1">s</span></option>
                                        <option value="60">hour<span v-if="endTimeAmount != 1">s</span></option>
                                    </select>
                                </p>
                            </validation-provider>

                            <!-- New auction description -->
                            <validation-provider class="auction-form__description">
                                <label for="auction-description">Description</label>
                                <textarea name="auction-description" v-model.trim="auctionForm.description" placeholder="Optional markdown"></textarea>
                            </validation-provider>

                            <button class="auction-form__info-action" :disabled="invalid || stage != 'info'">Continue</button>
                        </form>
                    </block>


                    <block>
                        <!-- Form panel -->
                        <div class="stage-panel stage-panel__info">
                            <h4><span class="number" :class="{ valid: !invalid }">1</span> Fill auction details</h4>
                            <div class="details" v-if="stage == 'info'">
                                <p>Fill up the form with the auction details.</p>
                                <p>Click <strong>"Continue"</strong> when you are ready.</p>
                            </div>
                        </div>

                        <div class="stage-panel stage-panel__confirm">
                            <h4><span class="number">2</span> Confirm details</h4>
                            <div class="details" v-if="stage == 'confirm'">
                                <ul>
                                    <li>You are creating an auction to sell <strong>{{ auctionForm.sellAmount }} {{ auctionForm.sellToken.symbol }}</strong>. The tokens will be consigned to the auction contract when it is executed at step 4.</li>
                                    <li>The asking price is <strong>{{ auctionForm.bidPrice }} {{ auctionForm.bidToken.symbol }}</strong> per <strong>{{ auctionForm.sellToken.symbol }}</strong>.</li>
                                    <li>Bids will start at a minimum of <strong>{{ minBidAmount }} {{ auctionForm.bidToken.symbol }}</strong>.</li>
                                </ul>
                                <p>Please make sure that the terms are acceptable and that you have <strong>{{ auctionForm.sellAmount }} {{ auctionForm.sellToken.symbol }}</strong> available to consign.</p>
                                <button class="allowance-form__action" @click="increaseAllowance()">Confirm</button>
                                <p><a href="" @click="stage = 'info'">Back</a></p>
                            </div>
                        </div>

                        <!-- Allowance panel -->
                        <div class="stage-panel stage-panel__allowance" :class="{ error: allowanceError }">
                            <h4><span class="number">3</span> Set Allowance</h4>
                            <div class="details" v-if="stage == 'allowance' || stage == 'allowance--creating'">
                                <p>Before creating the auction you have to allow the auction contract to access your tokens. By setting allowance, you will enable the application to automate transactions for you.</p>
                                <div class="allowance-action" v-if="stage == 'allowance'">
                                    <div v-if="allowanceError != ''">
                                        <p class="error">Error: {{ allowanceError }}</p>
                                    </div>
                                    <button class="allowance-form__action" :disabled="stage != 'allowance'" @click="increaseAllowance()">{{ stage == 'allowance--creating' ? 'Increasing allowance' : 'Try again' }}</button>
                                    <p><a href="" @click="stage = 'info'">Back</a></p>
                                </div>
                                <loading-icon v-if="stage == 'allowance--creating'">
                                    <p>Setting allowance</p>
                                </loading-icon>
                            </div>
                        </div>

                        <!-- Auction panel -->
                        <div class="stage-panel stage-panel__auction" :class="{ error: auctionError }">
                            <h4><span class="number">4</span> Create auction</h4>
                            <div class="details" v-if="stage == 'auction--creating' || stage == 'auction'">
                                <p>After completion <strong>{{ auctionForm.sellAmount }} {{ auctionForm.sellToken.symbol }}</strong> will be consigned to the new auction contract from your account.</p>
                                <div v-if="stage == 'auction--creating'">
                                    <loading-icon v-if="stage == 'auction--creating'">
                                        <p>Executing the contract</p>
                                    </loading-icon>
                                </div>
                                <div v-if="stage == 'auction'">
                                    <p>It seems the transaction failed or was cancelled.</p>
                                    <p class="error">{{ auctionError }}</p>
                                    <button @click="createAuction()">Try again</button>
                                    <p><a href="" @click="stage = 'info'; auctionError = null;">Back</a></p>
                                </div>
                            </div>
                        </div>

                        <!-- Viewing keys panel -->
                        <div class="stage-panel stage-panel__congrats">
                            <h4>Extra: Viewing Key</h4>
                            <div class="details" v-if="stage == 'congrats'">
                                <p>Congratulations! Your Secret Auction is ready. Use your viewing key to easily find it and perform operations.</p>
                                <vkeys-address class="viewingkey__address" :contract="$auctions.factoryAddress" :account="auctionForm.account"></vkeys-address>
                                <p v-if="newAuctionPath != ''"><g-link class="auction-creation__action-list" :to="newAuctionPath">See your auction</g-link></p>
                                <p><g-link class="auction-creation__action-list" to="/">Go to the auction list</g-link></p>
                            </div>
                        </div>
                    </block>
                </column>
            </page>
        </validation-observer>
    </default-layout>
</template>

<script>
import { mapGetters } from 'vuex'

import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import KeplrAccount from '../components/KeplrAccount';

import { Decimal } from 'decimal.js';
import moment from 'moment';

import LoadingIcon from '../components/LoadingIcon';
import VkeysAddress from '../components/VkeysAddress.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue';


extend("required", {
  ...required,
  message: "Required",
});

extend("greater_than", {
  params: ["greaterThanValue"],
  validate: (value, param) => {
    return value > parseInt(param.greaterThanValue)
  },
  message: "Must be greater than {greaterThanValue}",
});

extend("max_decimals", {
  params: ["maxDecimalsAllowed"],
  validate: (value, param) => {
      //console.log(parseInt(param.maxDecimalsAllowed) >= parseFloat(value).countDecimals());
    return parseInt(param.maxDecimalsAllowed) >= parseFloat(value).countDecimals();
    
  },
  message: "The max decimals allowed are {maxDecimalsAllowed}",
});

export default {
    components: { ValidationObserver, ValidationProvider, KeplrAccount, LoadingIcon, VkeysAddress },
    metaInfo: {
        title: 'New auction',
    },
    data() {
        return {
            errors: [],

            stage: "info", // info, allowance, allowance--creating, auction--creating, congrats
            interval: null,

            infoComplete: false,
            endTimeAmount: 1,
            endTimeUnit: "60",

            statusLog: [],

            auctionError: null,
            allowanceError: "",

            auctionForm: {
                sellAmount: 1,
                sellToken: "",
                bidPrice: 1,
                bidToken: "",
                label: null,
                description: "",
                endTime: new Date(),
            },

            newAuctionPath: "",
        }
    },
    computed: {
        ...mapGetters("$auctions", [
            "availableTokens",
            "getToken"
        ]),
        minBidAmount() {
            const rawBidAmount = new Decimal("0" + this.auctionForm.bidPrice || 0).times(this.auctionForm.sellAmount || 0);
            return rawBidAmount.toString();
        },
        endTimeString() {
            return moment(this.auctionForm.endTime).format("YYYY-MM-DD HH:mm:ss");
        },
    },
    mounted () {
        this.updateEndTime(); 
        this.interval = setInterval(this.updateEndTime, 1000);
    },
    async created () {
        this.randomizeLabel();
    },
    destroyed () {
        clearInterval(this.interval);
    },
    methods: {
        submitInfo() {
            this.stage = "confirm";
        },
        randomizeLabel() {
            if(this.stage == 'info') {
                this.auctionForm.label = "auction-" + Math.round(Math.random() * 10000000);
            }
        },
        async increaseAllowance() {
            this.stage = "allowance--creating";
            this.allowanceError = "";
            const sellAmountToFractional = new Decimal(10).toPower(this.auctionForm.sellToken.decimals).times(this.auctionForm.sellAmount).toFixed(0);
            const response = await this.$auctions.consignAllowance(this.auctionForm.sellToken.address, sellAmountToFractional);
            if(!response.error) {
                this.createAuction();
            } else {
                this.stage = "allowance";
                this.allowanceError = response.error;
            }
        },
        async createAuction() {
            this.stage = "auction--creating";
            this.auctionError = null;

            const sellAmountToFractional = new Decimal(10).toPower(this.auctionForm.sellToken.decimals).times(this.auctionForm.sellAmount).toFixed(0);
            const bidAmountToFractional  = new Decimal(10).toPower(this.auctionForm.bidToken.decimals).times(this.minBidAmount).toFixed(0);

            //Create auction
            const auction = await this.$auctions.createAuction(this.auctionForm.label,
                this.auctionForm.sellToken.address,
                this.auctionForm.bidToken.address,
                new Decimal(sellAmountToFractional).toFixed(0),
                new Decimal(bidAmountToFractional).toFixed(0),
                this.auctionForm.description,

                // Converts from millis to a second-based UNIX friendly epoch time
                Math.round(this.auctionForm.endTime.getTime() / 1000)
            );

            await this.$auctions.updateAuctions();
            // Log status
            this.newAuctionPath = "/auctions/" + auction.auctionAddress;
            if(!auction.error) {
                this.stage = "congrats";

            } else {
                this.stage = "auction";
                this.auctionError = auction.error;
            }
        },
        updateEndTime() {
            if(this.stage == "info") {
                this.auctionForm.endTime = new Date((new Date()).getTime() + (Number(this.endTimeAmount || 1) * Number(this.endTimeUnit) * 60000));
            }
        }, 
    },
}
</script>

<style lang="scss" scoped>

.auction-form {
    display: grid;
    grid-template-columns: 40px 1fr 1fr 120px;
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
        grid-column: 2 / 5;
    }
    &__sell-amount {
        grid-column: 1 / 4;
    }
    &__bid-amount {
        grid-column: 3 / 4;
    }
    &__bid-price {
        grid-column: 1 / 3;
    }
    &__bid-sell, &__bid-denom {
        grid-column: 4 / 5;
    }
    &__info-action, &__end-time, &__description {
        grid-column: 1 / 5;
    }

    .keplr__account {
        font-size: 21px;
    }

    &__label {
        align-self: start;
        justify-self: center;
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

.viewingkey__address {
    margin-bottom: var(--f-gutter);
}

.stage-panel {
    background-color: var(--color-black);
    padding: var(--f-gutter);
    border-radius: 10px;
    margin-bottom: var(--f-gutter);
    padding-bottom: 0;

    transition: height 1s;

    h4 {
        display: inline-block;
    }

    p, li {
        font-size: 13px;
    }

    strong {
        color: var(--color-purple-secondary);
    }

    .error {
        margin-bottom: var(--f-gutter);
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


// All the stage fun comes here, refactor one day to a proper CSS state machine...
.new-auction {

    margin: var(--f-gutter-xl) 0;

    // Info stage
    &__stage-info {
        
        .stage-panel__info {
            border: 1px solid #2E323C;
            background-color: #0D1017;
            .number {
                color: black;
                background-color: var(--color-yellow-primary);
                &.valid {
                    background-color: var(--color-positive);
                }
            }
        }
        .stage-panel__confirm, .stage-panel__allowance, .stage-panel__auction, .stage-panel__congrats {
            opacity: 0.5;
        }
    }

    // Confirm stage
    &__stage-confirm {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info {
            .number {
                color: white;
                background-color: var(--color-positive);
            }
        }
        .stage-panel__confirm {
            border: 1px solid #2E323C;
            background-color: #0D1017;
            .number {
                background-color: var(--color-yellow-primary);
                color: black;
            }
        }
        .stage-panel__info, .stage-panel__allowance, .stage-panel__auction, .stage-panel__congrats {
            opacity: 0.5;
        }
    }

    // Allowance stage
    &__stage-allowance, &__stage-allowance--creating {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__confirm {
            .number {
                color: white;
                background-color: var(--color-positive);
            }
        }
        .stage-panel__allowance {
            border: 1px solid #2E323C;
            background-color: #0D1017;
            .number {
                background-color: var(--color-yellow-primary);
                color: black;
            }
        }
        .stage-panel__info, .stage-panel__confirm, .stage-panel__auction, .stage-panel__congrats {
            opacity: 0.5;
        }
    }

    // Auction stage
    &__stage-auction, &__stage-auction--creating {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__confirm, .stage-panel__allowance {
            .number {
                color: white;
                background-color: var(--color-positive);
            }
        }
        .stage-panel__auction {
            &.error {
                border: 1px solid var(--color-negative);
            }
            &:not(.error) {
                border: 1px solid #2E323C;
                background-color: #0D1017;
            }
            .number {
                background-color: var(--color-yellow-primary);
                color: black;
            }
        }
        .stage-panel__info, .stage-panel__confirm, .stage-panel__keys, .stage-panel__allowance {
            opacity: 0.5;
        }
    }

    // Congrats stage
    &__stage-congrats {
        .auction-form {
            opacity: 0.3;
        }
        .stage-panel__info, .stage-panel__confirm, .stage-panel__auction, .stage-panel__allowance {
            .number {
                color: white;
                background-color: var(--color-positive);
            }
            opacity: 0.5;
        }
        .stage-panel__congrats {
            border: 1px solid #2E323C;
            background-color: #0D1017;
        }
    }
}

</style>