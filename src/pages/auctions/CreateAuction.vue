<template>
  <default-layout>
    <page>
        <columns>
        <h1>Secret Auction</h1>
        <block>
            <button @click="createAuction()">Click Me</button>
        </block>
        </columns>
    </page>
  </default-layout>
</template>

<script>
import DefaultLayout from "../../layouts/DefaultLayout.vue";
export default {
    components: { DefaultLayout },
    data() {
        return {

        }
    },
    methods: {
        async createAuction() {
            let auction = await this.$auctions.createAuction("testAuction",
                "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga",
                "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy",
                1000000000,
                1000000000,
                "This is a test description"
            );
            console.log(auction);
        }
    }
}
</script>

<style>

</style>