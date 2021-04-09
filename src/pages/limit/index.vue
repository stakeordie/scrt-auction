<template>
  <default-layout>

  </default-layout>
</template>

<script>

export default {
  data() {
    return {

    }
  },
  methods: {
    async getBooks() {
        this.getBooksResponse = await this.$limit.getBooks;
        this.getBooksResponseClosed = false;
    }
  }
}
</script>

<style>

</style>