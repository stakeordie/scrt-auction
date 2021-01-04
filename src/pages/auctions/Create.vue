<template>
    <page>
        <columns>
        <h1>Secret Auction</h1>
        <block>
            <button @click="createAuction()">Click Me</button>
        </block>
        </columns>
    </page>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        async createAuction() {
            let auction = await this.$auctions.createAuction("newAuction",
                "secret1wma0dyp30mncz8rdzga0426s9fzx6jmqmp79uy",
                "secret1qvq5h3ta2qpng3vdlln7pu8mnhn98getzsw9ga",
                "1000",
                "1000",
                "This is a test description"
            );
            console.log(auction);
        }
    }
}
</script>

<style>

</style>