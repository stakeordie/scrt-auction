<template>
    <div class="auction-retract">
        <validation-observer v-slot="{ handleSubmit, invalid }">
        <form @submit.prevent="handleSubmit(retractBid)">
            <button :disabled="invalid">Retract</button>
        </form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

export default {
    name: "AuctionRetract",
    components: {ValidationObserver},
    props: {
        auction: {
            type: Object,
            default: null
        },
    },
    methods: {
        retractBid() {
            // Do the thing here

            // Optionally
            this.$emit('retract', this.auction);
        }
    },
}
</script>

<style>

</style>