<template>
  <div class="app-vkey" :class="{ hidden }">
    <div v-if="!account">
        <p>Please log in using your<br>Keplr wallet</p>
    </div>
    <div v-if="account">
        <div class="no-key" v-if="!savedViewingKey && !viewingKey">
            <div class="vkey-error" v-if="isInError && !isInProgress">
                <p>Error creating your viewing key. Do you have enough SCRT?</p>
            </div>
            <loading-icon v-if="isInProgress">
                <p>Creating viewing key</p>
            </loading-icon>
            <div v-if="!isInProgress">
                <slot name="description">
                    <small>A viewing key allows to interact with the private state of the contract.</small>
                </slot>
                <button class="no-button" @click="createViewingKey()">&#x1F511; Create viewing key</button>
                <button class="no-button" @click="isViewingKeyVisible = true; viewingKey = { key: '' }">&#x1F511; Enter key</button>
            </div>
        </div>

        <div class="saved-key" v-if="savedViewingKey && !isViewingKeyVisible">
            <button @click="isViewingKeyVisible = true">&#x1F511; Show viewing key</button>
        </div>

        <div class="vkey" v-if="viewingKey && isViewingKeyVisible">
            <div class="vkey__tools" v-if="viewingKey == savedViewingKey">
                <dl>
                    <dt>Viewing key</dt>
                    <dd class="vkey__saved-key">
                        {{ viewingKey.key }} 
                    </dd>
                </dl>
                <a class="hide"  href="" @click="hideViewingKey()">Hide</a>
                <a class="forget" v-if="savedViewingKey" href="" @click="forgetViewingKey()">Forget</a>
            </div>
            <div class="vkey__tools" v-if="viewingKey != savedViewingKey">
                <dl>
                    <dt>Viewing key</dt>
                </dl>
                <textarea class="vkey__key" v-model.trim="viewingKey.key"></textarea>
                <a class="save" href="" @click="saveViewingKey()">Save</a>
                <a class="remove" href="" @click="deleteViewingKey()">Delete</a>
            </div>
        </div>
    </div>
  </div>

</template>

<script>
import LoadingIcon from './LoadingIcon.vue';
export default {
  components: { LoadingIcon },
    props: {
        contract: {
            type: String,
            default: null,
        },
        account: {
            type: String,
            default: null,
        },
        value: {
            type: Object,
            default: null,
        },
        hidden: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            isViewingKeyVisible: false,
            isInError: false,
            isInProgress: false,
            viewingKey: null,
        }
    },
    watch: {
        account(newValue, oldValue) {
            this.viewingKey = null;
        }
    },
    computed: {
        savedViewingKey() {
            let savedKey = this.$vkeys.get(this.account, this.contract);
            if(savedKey) {
                this.$emit("input", savedKey);
                this.viewingKey = Object.assign(savedKey);
            }
            return savedKey;
        }
    },
    methods: {
        async saveViewingKey() {
            this.$vkeys.put(this.account, this.contract, this.viewingKey.key);
        },
        async forgetViewingKey() {
            this.$vkeys.delete(this.account, this.contract);
            this.viewingKey = null;
        },
        hideViewingKey() {
            this.isViewingKeyVisible = false;
        },
        deleteViewingKey() {
            this.viewingKey = null;
        },
        async createViewingKey() {
            try {
                //console.log(this.$vkeys.get('x', 'x'));
                //console.log(this.$vkeys.get(this.auctionForm.account));
                this.isInProgress = true;

                this.viewingKey = { key: await this.$auctions.createViewingKey() };
                await this.saveViewingKey();

                this.isViewingKeyVisible = true;
                this.isInProgress = false;
                this.isInError = false;
            } catch(err) {
                this.isInProgress = false;
                this.isInError = err.message.indexOf('rejected') < 0;
            }
        },
    },
}
</script>

<style lang="scss">
    .app-vkey {
        &.hidden {
            display: none;
        }

        button {
            width: 100%;
            font-weight: 600;
            margin-bottom: 0;

            &:hover {
                color: black;
                background-color: var(--color-white-secondary);
            }
        }
    }
    .vkey-error p {
        color: var(--color-negative);
    }
    .vkey {
        &__key {
            margin-bottom: var(--f-gutter-s);
        }
        &__saved-key {
            padding-top: 6px;
            word-break: break-word;
            line-height: 1.5em;
        }
        &__tools {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-evenly;
            row-gap: var(--f-gutter-s);
            column-gap: var(--f-gutter-l);

            dl {
                margin-right: auto;
            }

            textarea {
                width: 100%;
            }
    
            a {
                font-size: 0.8em;
                font-weight: 600;
                text-decoration: none;
                text-transform: uppercase;

                &.hide {
                    color: var(--color-turquoise-secondary);
                }
                &.save {
                    color: var(--color-positive);
                }
                &.remove, &.forget {
                    color: var(--color-negative);
                }
            }
        }
    }
    small {
        display: block;
        font-size: 13px;
        line-height: 1.5em;
        margin-bottom: var(--f-gutter);
    }
    
</style>