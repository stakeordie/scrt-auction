<template>
  <default-layout>
      <column>
          <block>
                <div class="rrrow">
                    <button @click="getBooks">Get Order Books</button>
                    <pre v-show="!getBooksResponseClosed" class="rrrow-content">{{ getBooksResponse }}</pre>
                    <div v-show="!getBooksResponseClosed" class="rrrow-close" @click="getBooksResponseClosed = !getBooksResponseClosed">X</div>
                </div>
        </block>
      </column>
  </default-layout>
</template>

<script>
export default {
    data() {
        return {
            getBooksResponse: "",
            getBooksResponseClosed: true
        }
    },
    methods: {
        async getBooks() {
            console.log("pushed");
            this.getBooksResponse = await this.$limit.getBooks();
            this.getBooksResponseClosed = false;
        }    
    }
}
</script>

<style lang="scss" scoped>
    .rrrow {
        display: flex;
        padding: 10px;
        flex-direction: row;
        justify-content: space-between;
        border: 1px solid white;
        .rrrow-content {
            max-width: 80%;
            overflow: scroll;
        }
        .rrrow-close {
            cursor:pointer;
        }
    }
</style>