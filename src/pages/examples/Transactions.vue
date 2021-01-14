<template>
  <page>
    <columns number="2" number-s="1" weight="right">
      <h1>Transactions</h1>
      <p>Send SCRT to an account</p>
      <block>
        <transaction-send></transaction-send>
      </block>
    </columns>
  </page>
</template>

<script>
import TransactionSend from "./components/TransactionSend.vue";
import TransactionSnip20Send from "./components/TransactionSnip20Send.vue";
export default {
  components: {
    TransactionSend,
    TransactionSnip20Send
  },
};
</script>

<style></style>
