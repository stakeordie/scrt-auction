<template>
  <div class="custom-select" :tabindex="tabindex">
      <!-- Place below in the element above -->
      <!-- @blur="open = false" --> 
    <div class="selected" :class="{ open: open }" @click="open = !open">
        <g-image :immediate="true" :src="require(`!!assets-loader?width=15&height=15!@/assets/token-icons/${selected.iconImg ? selected.iconImg : 'secret-scrt-logo.svg'}`)"></g-image>
        {{ selected.symbol }}
    </div>
    <div class="selector-wrapper" :class="{ selectHide: !open }">
        <div class="list-custom-switch-wrapper">
            <div class="list-custom-switch">
                <div class="switch show-list" :class="showList ? 'selected' : ''" @click="showList = true">Search</div>
                <div class="switch show-custom-token" :class="!showList ? 'selected' : ''" @click="showList = false">Add Custom</div>
            </div>
        </div>
        <div class="list-area" v-show="showList">
            <input type="search" placeholder="Search" v-model="searchPhrase"/>
            <div class="items">
                <div
                    v-for="token in filteredTokens"
                    :key="token.address"
                    @click="
                        selected = token;
                        open = false;
                        $emit('input', token);
                    "
                >
                    <g-image clas="token-img" :immediate="true" :src="require(`!!assets-loader?width=15&height=15!@/assets/token-icons/${token.iconImg ? token.iconImg : 'secret-scrt-logo.svg'}`)" ></g-image>
                    {{ token.symbol }}
                </div>
            </div>
        </div>
        <div class="custom-token-area" v-show="!showList">
            <div class="fields">
                <div class="field contract_address">
                    <label for="custom-sell-token-contract-address">Contract Address</label>
                    <input name="custom-sell-token-contract-address" type="text" v-model.trim="customSellTokenForm.address" @change="getCustomSellToken"/>
                </div>
                <div class="field name">
                    <label for="sell-amount">Name</label>
                    <input name="sell-amount" type="text" readonly v-model.trim="customSellTokenForm.token.name" />
                </div>
                <div class="field symbol">
                    <label for="sell-amount">Symbol</label>
                    <input name="sell-amount" type="text" readonly v-model.trim="customSellTokenForm.token.symbol" />
                </div>
                <div class="field decimals">
                    <label for="sell-amount">Decimals</label>
                    <input name="sell-amount" type="text" readonly v-model.trim="customSellTokenForm.token.decimals" />
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
        selected: this.default
        ? this.default
        : this.tokens.length > 0
        ? this.tokens[0]
        : null,
        open: false,
    };
  },
  mounted() {
    this.$emit("input", this.selected);
  },
  computed: {
      filteredTokens() {
          if(!this.searchPhrase) {
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
            const tokenInfo = await this.$scrtjs.queryContract(this.customSellTokenForm.address, {"token_info": {}});
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
  text-align: center;
  outline: none;
  height: 47px;
  line-height: 47px;

    .selected {
        display: flex;
        justify-content: flex-start;
        background-color: #0a0a0a;
        border-radius: 6px;
        border: 1px solid #666666;
        color: #fff;
        padding-left: 1em;
        cursor: pointer;
        user-select: none;

        &.open {
            border: 2px solid white;
            border-radius: 6px;
        }

        &:after {
            position: absolute;
            content: "";
            top: 22px;
            right: 1em;
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-color: #fff transparent transparent transparent;
        }

        img {
            margin-right: 10px;
        }
    }

    .list-custom-switch-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;

        .list-custom-switch {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            border: none;

            .switch {
                text-align: center;
                height: 45px;
                padding: 5px 20px;
                margin-bottom: 0;
                border-bottom: var(--f-gutter-xxs) solid rgba(white, 0.2);
                color: rgba(white, 0.2);

                &.selected {
                    color: white;
                    border: none;
                    border-radius: 0px;
                    border-bottom: var(--f-gutter-xxs) solid white;
                }
            }
        }
    }




    .selector-wrapper {
          margin-top: 15px;
        width: 300px;
        height: 415px;
        left: -150px;
        border: 2px solid white;
        border-radius: 20px;
        background-color: #0a0a0a;
        z-index: 20000;
        color: #fff;
        position: absolute;
        overflow: hidden;
        .list-area {
            padding: 20px 20px 10px;
            .items {
                overflow: scroll;
                height: 285px;
                div {
                    display: flex;
                    justify-content: flex-start;
                    color: #fff;
                    padding-left: 1em;
                    cursor: pointer;
                    user-select: none;

                    img {
                        margin-right: 30px
                    }

                    &:hover {
                        background-color: #ad8225;
                    }
                }
            }
        }

        .custom-token-area {
            
            width: 100%;
            color: #fff;
            padding: 20px 20px 10px;
            background-color: #0a0a0a;
            z-index: 20000;
            overflow: hidden;



            .fields {
                display: grid;
                grid-column: 1 / 4;
                grid-template-columns: 1fr 1fr 1fr;
                column-gap: var(--f-gutter);
                align-items: end;
                overflow: scroll;
                height: 275px;
                

                .field {
                    font-size: 8px;
                }

                .title {
                    grid-column: 1 / 4;
                }

                .label-search {
                    grid-column: 1 / 3;
                }

                .label-button {
                    grid-column: 3 / 4;
                }

                .contract_address {
                    grid-column: 1 / 4;
                }

                .name {
                    grid-column: 1 / 4;
                }

                .symbol {
                    grid-column: 1 / 4;
                }

                .decimals {
                    grid-column: 1 / 4;
                }

                .add-token-button {
                    grid-column: 1 / 4;
                }

            }
        }
    }
}

</style>
