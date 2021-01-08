<template>
    <div class="token-amount-input">
        <div class="token-amount-input-field">
            <input
                name="{name}"
                type="text"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
                placeholder="0"
            />
            <div class="input-fake">
                <div class="conversion">
                    {{ convertedAmount }} {{selectedSymbol}}
                </div>
            </div>
            <div class="denomination-buttons">
                <div @click="switchDenomA" class="button" :class="{ off: baseDenomSelected }" :disabled="baseDenomSelected">{{ tokenSymbol }}</div>
                <div @click="switchDenomB" class="button" :class="{ off: !baseDenomSelected }" :disabled="!baseDenomSelected">{{ tokenBaseSymbol }}</div>
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
            baseDenomSelected: true
        }
    },
    computed: {
        convertedAmount: function() {
            if(this.value) {
                if(this.baseDenomSelected) {
                    return this.value / Math.pow(10, this.decimals);
                } else {
                    return this.value * Math.pow(10, this.decimals);
                }
            } else {
                return 0;
            }
        }
    },
    methods: {
        switchDenomA() {
            if(this.baseDenomSelected) {
                this.baseDenomSelected = !this.baseDenomSelected;
                this.selectedSymbol = "uSODTE";
            }
        },
        switchDenomB() {
            if(!this.baseDenomSelected) {
                this.baseDenomSelected = !this.baseDenomSelected;
                this.selectedSymbol = "SODTE";
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