<template>
  <default-layout>
    <page>
        <columns>
        <h1>Secret Auction</h1>
        <block>
          {{ id }}
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
      id: "",
    };
  },
  async mounted() {
    this.id = this.$route.params.id;
  },
};
</script>

<style></style>
