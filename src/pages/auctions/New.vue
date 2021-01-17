<template>
    <page>
        <column>
            <h1>New auction</h1>
            <p>The auction process creation consists of 3 steps. Consider visiting the FAQs to learn more about each one.</p>
        </column>
        <column number-l="3">
            <block>
                <h2>Info</h2>
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
export default {
    data() {
        return {
            step: "info", // info, allowance, auction
        }
    },
}
</script>

<style>

</style>