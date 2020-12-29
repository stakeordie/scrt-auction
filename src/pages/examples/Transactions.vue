<template>
  <default-layout>
    <page>
      <h1>Query node</h1>
      <transaction-send></transaction-send>
      <hr>
      <button>Hola</button>      
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
