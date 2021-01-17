<template>
    <page>
        <column>
            <h1>New auction</h1>
            <p>The auction process creation consists of 3 steps. Consider visiting the FAQs to learn more about each one.</p>
        </column>
        <column number-l="3">
            <block>
                <h2>Info</h2>
                <validation-observer v-slot="{ handleSubmit, invalid }">
                    <form class="form" @submit.prevent="handleSubmit(submitInfo)">
                        <button :disabled="invalid">Click Me</button>
                    </form>
                </validation-observer>
            </block>
            <block>
                <h2>Allowance</h2>
            </block>
            <block>
                <h2>Info</h2>
            </block>
        </column>
    </page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

export default {
    components: { ValidationObserver, ValidationProvider },
    data() {
        return {
            step: "info", // info, allowance, auction
            formInfo: {

            },
        }
    },
    methods: {
        submitInfo() {
            
        }
    },
}
</script>

<style>

</style>