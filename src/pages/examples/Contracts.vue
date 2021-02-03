<template>
    <page>
      <columns number-l="2" weight="right">
        <h1>Query node</h1>
        <block>
          <h2>Contracts</h2>
          <form @submit.prevent="getContract()">
            <input v-model="codeIdForm" type="text" />
            <button>Get contract</button>
          </form>
          <div v-for="(contract, index) in contracts" :key="index">
            <h3>{{ contract.label }}</h3>
            <dl>
              <dt>Label</dt>
              <dd>{{ contract.address }}</dd>
              <dt>Code Id</dt>
              <dd>{{ contract.codeId }}</dd>
            </dl>
          </div>
          <hr>
        </block>
      </columns>
    </page>
</template>

<script>
export default {
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
      async listActiveAuctions() {
        //console.log(await this.$auctions.listActive());
      }
  },
};
</script>

<style></style>