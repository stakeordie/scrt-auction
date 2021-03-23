<template>
  <default-layout>
      <column>
          <block>
                <div class="rrrow">
                    <button @click="getBooks">Get Order Books</button>
                    <pre v-show="!getBooksResponseClosed" class="rrrow-content">{{ getBooksResponse }}</pre>
                    <div v-show="!getBooksResponseClosed" class="rrrow-close" @click="getBooksResponseClosed = !getBooksResponseClosed">X</div>
                </div>
                <div class="rrrow">
                    <button @click="getAmmPairs">Get AMM Pairs</button>
                    <pre v-show="!getAmmPairsResponseClosed" class="rrrow-content">{{  getAmmPairsResponse }}</pre>
                    <div v-show="!getAmmPairsResponseClosed" class="rrrow-close" @click="getAmmPairsResponseClosed = !getAmmPairsResponseClosed">X</div>
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
            getBooksResponseClosed: true,
            getAmmPairsResponse: "",
            getAmmPairsResponseClosed: true
        }
    },
    methods: {
        async getBooks() {
            this.getBooksResponse = await this.$limit.getBooks;
            this.getBooksResponseClosed = false;
        },
        async getAmmPairs() {
            this.getAmmPairsResponse = await this.$limit.getAmmPairs();
            this.getAmmPairsResponseClosed = false;
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
        max-height: 600px;
        overflow: scroll;
        .rrrow-content {
            max-width: 80%;
            overflow: scroll;
        }
        .rrrow-close {
            cursor:pointer;
        }
    }
</style>