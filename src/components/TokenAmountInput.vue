<template>
    <div class="token-amount-input">
        <div class="token-amount-input-field">
            <input
                name="{name}"
                type="text"
                :value="value.amount"
                @input="update('amount', $event.target.value)"
            />
            <div class="input-fake">
                <div class="conversion">
                    {{ convertedAmount }} {{selectedSymbol}}
                </div>
            </div>
            <div class="denomination-buttons">
                <div @click="convertToSymbol" class="button symbol" :class="{ off: fmuSelected }" :disabled="fmuSelected">{{ muSymbol }}</div>
                <div @click="convertToUSymbol" class="button u-symbol" :class="{ off: !fmuSelected }" :disabled="!fmuSelected">{{ fmuSymbol }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// Units for currency are FMU and MU
// FMU stands for Fractional Monetary Unit and is the smallest unit (1FMU = (1 / 10^tokenDecimals)MUs)
// MU stands for Monetary Unit and is the standard base unit (1MU = (1 * 10^tokenDecimals)FMUs)
export default {
    props: [
        "name",
        "value",
        "decimals",
        "muSymbol",
        "fmuSymbol"
    ],
    data() {
        return {
            selectedSymbol: "SODTE",
            fmuSelected: true,
        }
    },
    computed: {
        tokenAmount() {
            return this.value ? this.value : { amount: 1 }
        },
        convertedAmount: function() {
            if(this.value.amount) {
                if(this.fmuSelected) {
                    return this.value.amount / Math.pow(10, this.decimals);
                } else {
                    return this.value.amount * Math.pow(10, this.decimals);
                }
            } else {
                return 0;
            }
        }
    },
    methods: {
        update(key, value) {
            let fmuAmount = value
            console.log(this.fmuSelected)
            if(!this.fmuSelected) {
                fmuAmount = value * Math.pow(10, this.decimals);
            }
            this.$emit('input', { ...this.local, [key]: value, fmuAmount});
        },
        convertToSymbol() {
            if(this.fmuSelected) {
                this.fmuSelected = !this.fmuSelected;
                this.selectedSymbol = this.fmuSymbol;
                this.value.amount = this.value.amount / Math.pow(10, this.decimals);
            }
        },
        convertToUSymbol() {
            if(!this.fmuSelected) {
                this.fmuSelected = !this.fmuSelected;
                this.selectedSymbol = this.muSymbol;
                this.value.amount = this.value.amount * Math.pow(10, this.decimals);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .token-amount-input-field {
        display:flex;

        input {
            border:none;
            margin: 0px;
            width: auto;
    
            &:focus {
                outline: none;
            }
        }

        .input-fake {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border: none;
            background: white;
            
            .conversion {
                background: grey;
                margin: 5px 10px;
                padding: 5px 10px;
                border-radius: 5px;
                color: white;
            }
        }

        .denomination-buttons {
            display:flex;
            background: inherit;
            margin-left: 5px;

            .button {
                margin: 6px;
                color: black;
                cursor: pointer;

                &.off {
                    opacity: .4;

                }
            }
        }
    }

</style>