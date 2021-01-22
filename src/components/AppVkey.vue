<template>
  <div class="app-vkey" v-if="account">
    <div class="no-key" v-if="!savedViewingKey && !viewingKey">
        <div class="vkey-error" v-if="isInError && !isInProgress">
            <p>Error creating your viewing key. Do you have enough SCRT?</p>
        </div>
        <loading-icon v-if="isInProgress">
            <p>Creating viewing key</p>
        </loading-icon>
        <button v-if="viewingKey == null && !isInProgress" @click="createViewingKey()">Create a viewing key</button>
    </div>

    <div class="saved-key" v-if="savedViewingKey && !isViewingKeyVisible">
        <button @click="isViewingKeyVisible = true">🔑 See viewing key</button>
    </div>

    <div class="vkey" v-if="isViewingKeyVisible">
        <textarea class="vkey__key" readonly v-model="viewingKey.key"></textarea>
        <div class="vkey__tools">
            <a v-if="savedViewingKey != viewingKey" href="" @click="saveViewingKey()">Save it to memory</a>
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
    },
    data() {
        return {
            isViewingKeyVisible: false,
            isInError: false,
            isInProgress: false,
            viewingKey: null,
        }
    },
    computed: {
        savedViewingKey() {
            let savedKey = this.$vkeys.get(this.account, this.contract);
            if(savedKey) {
                this.viewingKey = Object.assign(savedKey);
            }
            return savedKey;
        }
    },
    methods: {
        saveViewingKey() {
            this.$vkeys.put(this.account, this.contract, this.viewingKey.key);
        },
        async createViewingKey() {
            try {
                //console.log(this.$vkeys.get('x', 'x'));
                //console.log(this.$vkeys.get(this.auctionForm.account));
                this.isInProgress = true;
                
                this.viewingKey = { key: await this.$auctions.createViewingKey() };
                await this.$auctions.addUpdateWalletKey(this.$auctions.factoryAddress, this.viewingKey.key);
                
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
    .vkey-error p {
        color: var(--color-negative);
    }
    .vkey {
        &__key {
            margin-bottom: var(--f-gutter-s);
        }
        &__tools {
            display: flex;
            flex-flow: row nowrap;
            margin-bottom: var(--f-gutter);
    
            a {
                font-size: 0.8em;
            }
        }
    }
    
</style>