<template>
    <div class="latest-blocks">
        <button @click="queryLatestBlocks()">Query latest blocks</button>
    </div>
</template>

<script>
export default {
  methods: {
      async queryLatestBlocks() {
          console.log(await this.$scrtjs.getLatestBlocks());
      }
  },

}
</script>