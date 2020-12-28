<template>
  <default-layout>
    <page>
        <columns number="2" number-s="1" weight="right">
            <h1>Query node</h1>
            <block>
                <transaction-send></transaction-send>
                <hr>
                <h2>Transfer</h2>
            </block>
          </columns>
    </page>
  </default-layout>
</template>

<script>
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import TransactionSend from './components/TransactionSend.vue';
export default {
  components: {
    DefaultLayout,
    TransactionSend,
  },
};
</script>

<style></style>
