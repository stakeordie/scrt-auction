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
import TransactionSend from "../../components/examples/TransactionSend.vue";
export default {
  components: {
    TransactionSend
  },
};
</script>

<style></style>
