<template>
    <div class="auction-bid">
        <validation-observer v-slot="{ handleSubmit, invalid }">
        <form @submit.prevent="handleSubmit(placeBid)">
            <button :disabled="invalid">Place bid</button>
        </form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

export default {
    name: "AuctionBid",
    components: {ValidationObserver},
    props: {
        auction: {
            type: Object,
            default: null
        },
    },
    methods: {
        placeBid() {
            // Do the thing

            // Optionally
            this.$emit('place', this.auction);
        }
    },
}
</script>

<style>

</style>