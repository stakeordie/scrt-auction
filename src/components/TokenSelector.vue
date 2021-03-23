<template>
    <div class="custom-select" :tabindex="tabindex">
        <!-- Place below in the element above -->
        <!-- @blur="open = false" -->
        <!-- TODO: #69 Token Selector background is too dark, should match complete auction steps -->
        <div class="selected" :class="{ open: open }" @click="open = !open">
            <g-image :immediate="true"
                :src="require(`!!assets-loader?width=15&height=15!@/assets/token-icons/${selected.iconImg ? selected.iconImg : 'secret-scrt-logo.svg'}`)">
            </g-image>
            {{ selected.symbol }}
        </div>
        <div class="selector-wrapper" v-if="open" :class="{ selectHide: !open }">
            <div class="list-custom-switch-wrapper">
                <div class="list-custom-switch">
                    <p class="switch show-list" :class="showList ? 'selectedSwitch' : ''" @click="showList = true">
                        Search</p>
                    <p class="switch show-custom-token" :class="!showList ? 'selectedSwitch' : ''"
                        @click="showList = false">
                        Add Custom</p>
                </div>
            </div>
            <div class="list-area" v-show="showList">
                <input type="search" placeholder="Search" v-model="searchPhrase" />
                <div class="items">
                    <div v-for="token in filteredTokens" :key="token.address" @click="
                        selected = token;
                        open = false;
                        $emit('input', token);
                    ">
                        <g-image clas="token-img" :immediate="true"
                            :src="require(`!!assets-loader?width=15&height=15!@/assets/token-icons/${token.iconImg ? token.iconImg : 'secret-scrt-logo.svg'}`)">
                        </g-image>
                        {{ token.symbol }}
                    </div>
                </div>
            </div>
            <div class="custom-token-area" v-show="!showList">
                <div class="fields">
                    <div class="field contract_address">
                        <label for="custom-sell-token-contract-address">Contract Address</label>
                        <input name="custom-sell-token-contract-address" type="text" class="contract"
                            v-model.trim="customSellTokenForm.address" @change="getCustomSellToken" />
                    </div>
                    <div class="field name">
                        <label for="sell-amount">Name</label>
                        <input placeholder="-" name="sell-amount" type="text" readonly v-model.trim="customSellTokenForm.token.name" />
                    </div>
                    <div class="field symbol">
                        <label for="sell-amount">Symbol</label>
                        <input placeholder="-" name="sell-amount" type="text" readonly
                            v-model.trim="customSellTokenForm.token.symbol" />
                    </div>
                    <div class="field decimals">
                        <label for="sell-amount">Decimals</label>
                        <input placeholder="-" name="sell-amount" type="text" readonly
                            v-model.trim="customSellTokenForm.token.decimals" />
                    </div>
                    <button type="button" class="add-token-button" @click="addCustomTokenToTokenData">Add Token</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            tokens: {
                type: Array,
                required: true,
            },
            default: {
                type: Object,
                required: false,
                default: null,
            },
            tabindex: {
                type: Number,
                required: false,
                default: 0,
            },
        },
        data() {
            return {
                showList: true,
                customSellTokenForm: {
                    address: "",
                    token: {}
                },
                searchPhrase: "",
                selected: this.default ?
                    this.default : this.tokens.length > 0 ?
                    this.tokens[0] : null,
                open: false,
            };
        },
        mounted() {
            this.$emit("input", this.selected);
        },
        computed: {
            filteredTokens() {
                if (!this.searchPhrase) {
                    return this.tokens;
                } else {
                    return this.tokens.filter(token => {
                        return token.symbol.toLowerCase().includes(this.searchPhrase.toLowerCase());
                    });
                }
            }
        },
        methods: {
            async getContractAddressFromLabel() {
                return null;
            },
            async getCustomSellToken() {
                const contractInfo = await this.$scrtjs.getContract(this.customSellTokenForm.address);
                const tokenInfo = await this.$scrtjs.queryContract(this.customSellTokenForm.address, {
                    "token_info": {}
                });
                this.customSellTokenForm.token = {
                    isCustom: true,
                    address: contractInfo.address,
                    codeId: contractInfo.codeId,
                    decimals: tokenInfo.token_info.decimals,
                    label: contractInfo.label,
                    name: tokenInfo.token_info.name,
                    symbol: tokenInfo.token_info.symbol,
                    iconImg: "secret-scrt-logo.svg"
                }
            },
            async addCustomTokenToTokenData() {
                this.$auctions.addToken(this.customSellTokenForm.token);
                this.selected = this.customSellTokenForm.token;
                this.showList = true;
                this.open = false;
                this.$emit('input', this.customSellTokenForm.token);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .selectHide {
        display: none;
    }



    .custom-select {
        position: relative;
        //   text-align: center;
        outline: none;
        //   height: 47px;
        //   line-height: 47px;
        border-radius: var(--f-forms-input-radius);
        margin-bottom: var(--f-gutter);

        .selected {
            padding: 6px var(--f-gutter-s);
            display: flex;
            background-color: #0a0a0a;
            border-radius: 6px;
            border: 1px solid #666666;
            color: #fff;
            font-size: var(--f-forms-input-text-size);
            cursor: pointer;
            user-select: none;
            align-items: center;

            &.open {
                border: 1px solid #4195C4;
                box-sizing: border-box;
                border-radius: 4px;
            }

            &:after {
                position: absolute;
                content: "";
                top: 1em;
                right: .6em;
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-color: #fff transparent transparent transparent;
                display: inline-flex;
            }

            img {
                margin-right: 10px;
                height: 20px;
            }
        }






        .selector-wrapper {

            display: grid;
            align-items: flex-start;
            padding: 16px;
            gap: 16px;
            position: absolute;
            width: 340px;
            left: 0;
            top: 40px;

            border: 1px solid #2E323C;
            background-color: #0D1017;
            box-sizing: border-box;
            border-radius: 10px;
            z-index: 9;

            .list-custom-switch-wrapper {
                width: 100%;
                display: flex;
                justify-content: center;

                .list-custom-switch {
                    cursor: pointer;
                    display: flex;
                    flex: auto;

                    .switch {
                        text-align: center;
                        display: inline-block;
                        flex: auto;
                        text-align: center;
                        padding-bottom: var(--f-gutter-s);
                        border-bottom: var(--f-gutter-xxs) solid rgba(white, 0.2);
                        color: rgba(white, 0.2);
                        background: transparent;
                        margin-bottom: 0;
                        align-items: center;
                        align-content: center;
                        font-size: 14px;
                        font-weight: 700;

                        &:after {
                            display: none;
                        }

                        &.selectedSwitch {
                            font-size: 14px;
                            color: white;
                            border-bottom: var(--f-gutter-xxs) solid white;
                            border-radius: 0px;
                            background: transparent;
                        }
                    }
                }
            }

            .list-area {

                .items {
                    display: flex;
                    flex-direction: column;
                    padding: 0px;
                    border: 1px solid #2E323C;
                    box-sizing: border-box;
                    border-radius: 6px;
                    overflow-y: scroll;
                    height: 285px;
                    -ms-overflow-style: none;
                    /* IE and Edge */
                    scrollbar-width: none;

                    /* Firefox */
                    &::-webkit-scrollbar {
                        display: none;
                    }

                    div {
                        justify-content: flex-start;
                        color: #fff;
                        padding-left: 1em;
                        cursor: pointer;
                        user-select: none;

                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 10px;

                        img {
                            margin-right: 30px
                        }

                        &:hover {
                            background-color: #BCBCCC;
                            color: #000;
                        }
                    }
                }
            }

            .custom-token-area {




                .fields {
                    // display: flex;
                    // flex-direction: column;


                    box-sizing: border-box;
                    border-radius: 6px;
                    overflow-y: scroll;
                    // height: 285px;
                    -ms-overflow-style: none;
                    /* IE and Edge */
                    scrollbar-width: none;

                    /* Firefox */
                    &::-webkit-scrollbar {
                        display: none;
                    }


                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 64px;
                    gap: var(--f-gutter);
                    grid-template-areas: "contract contract"
                    "name name"
                    "symbol decimals"
                    "button button";
                    // label {
                    //     // font-size: var(--f-gutter);
                    // }
                    input {
                        &:not(.contract) {
                            margin-bottom: 0;
                        background: transparent;
                        border: 0;
                        font-size: var(--f-gutter);
                        font-weight: 700;
                        padding: 0;
                        color: white;
                        }
                    }
                    .contract_address {
                        grid-area: contract;
                        margin-bottom: var(--f-gutter-xl);
                    }

                    .name {
                        grid-area: name;
                    }

                    .symbol {
                        grid-area: symbol;
                    }

                    .decimals {
                        grid-area: decimals;
                    }

                    .add-token-button {
                        grid-area: button;
                        margin-bottom: 0;
                        align-self: end;
                    }


                    .field {
                        font-size: 8px;
                    }

                }
            }
        }
    }
</style>