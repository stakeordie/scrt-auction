<template>
  <default-layout>
    <page>
      <h1>Contracts</h1>
      <form @submit.prevent="getContract()">
          <input v-model="codeIdForm" type="text" />
          <button>Get contract</button>
      </form>
      <dl v-for="contract in contracts" :key="contract.address">
        <dt>Label</dt>
        <dd>{{ contract.label }}</dd>
        <dt>Address</dt>
        <dd>{{ contract.address }}</dd>
        <dt>Code Id</dt>
        <dd>{{ contract.codeId }}</dd>
      </dl>
      <hr>
      <button @click="queryActiveAuctions()">Query active auctions</button>
    </page>
  </default-layout>
</template>

<script>
import DefaultLayout from "../../layouts/DefaultLayout.vue";

export default {
  components: { DefaultLayout },
  data() {
      return {
          codeIdForm: "",
          contracts: [],
      }
  },
  methods: {
      async getContract() {
          this.contracts = await this.$scrtjs.listContracts(this.codeIdForm);
      },
      async queryActiveAuctions() {
        console.log(await this.$scrtjs.queryContract("secret1s0l9vyh8futvlctv4nup8pa8lfz9u4rgcye7c2", {"list_active_auctions":{}}));
      }
  },
};
</script>

<style></style>
