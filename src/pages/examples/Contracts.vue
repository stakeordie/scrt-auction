<template>
  <default-layout>
    <page>
      <columns number="2" number-s="1" weight="right">
        <h1>Query node</h1>
        <block>
          <h1>Contracts</h1>
          <form @submit.prevent="getContract()">
              <input v-model="codeIdForm" type="text" />
              <button>Get contract</button>
          </form>
          <dl v-for="(contract, index) in contracts" :key="index">
            <dt>Label</dt>
            <dd>{{ contract.label }}</dd>
            <dt>Address</dt>
            <dd>{{ contract.address }}</dd>
            <dt>Code Id</dt>
            <dd>{{ contract.codeId }}</dd>
          </dl>
          <hr>
          <button @click="queryActiveAuctions()">Query active auctions</button>
        </block>
      </columns>
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
        console.log(await this.$scrtjs.queryContract("secret1q5dadwv9dtvqde7l8tvkm0zlgn0hqr9vkla5pn", {"list_active_auctions":{}}));
      }
  },
};
</script>

<style></style>
