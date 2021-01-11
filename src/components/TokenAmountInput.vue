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
                <div @click="convertToSymbol" class="button symbol" :class="{ off: baseDenomSelected }" :disabled="baseDenomSelected">{{ tokenSymbol }}</div>
                <div @click="convertToUSymbol" class="button u-symbol" :class="{ off: !baseDenomSelected }" :disabled="!baseDenomSelected">{{ tokenBaseSymbol }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        "name",
        "value",
        "decimals",
        "tokenSymbol",
        "tokenBaseSymbol"
    ],
    data() {
        return {
            selectedSymbol: "SODTE",
            baseDenomSelected: true,
        }
    },
    computed: {
        tokenAmount() {
            return this.value ? this.value : { amount: 1 }
        },
        convertedAmount: function() {
            if(this.value.amount) {
                if(this.baseDenomSelected) {
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
            let denomValue = value
            console.log(this.baseDenomSelected)
            if(!this.baseDenomSelected) {
                denomValue = value * Math.pow(10, this.decimals);
            }
            this.$emit('input', { ...this.local, [key]: value, denomValue});
        },
        convertToSymbol() {
            if(this.baseDenomSelected) {
                this.baseDenomSelected = !this.baseDenomSelected;
                this.selectedSymbol = this.tokenBaseSymbol;
                this.value.amount = this.value.amount / Math.pow(10, this.decimals);
            }
        },
        convertToUSymbol() {
            if(!this.baseDenomSelected) {
                this.baseDenomSelected = !this.baseDenomSelected;
                this.selectedSymbol = this.tokenSymbol;
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