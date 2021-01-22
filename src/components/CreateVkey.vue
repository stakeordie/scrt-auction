<template>
  <div class="create-vkey">
    <p class="error" v-if="vkeyError">{{vkeyError}}</p>
    <textarea v-if="viewingKey" readonly v-model="vkey.viewingKey"></textarea>
    <button v-if="!viewingKey" @click="createViewingKey()">Create and save viewing Key</button>
  </div>
</template>

<script>
export default {
    props: {
        vkey: {
            type: Object,
            default: null,
        },
    },
    methods: {
        async createViewingKey() {
            //console.log(this.$vkeys.get('x', 'x'));
            //console.log(this.$vkeys.get(this.auctionForm.account));
            this.viewingKey = await this.$auctions.createViewingKey();
            if(this.viewingKey) {
                 await this.$auctions.addUpdateWalletKey(this.$auctions.factoryAddress, this.viewingKey);
            }
        },
    },
}
</script>

<style>

</style>