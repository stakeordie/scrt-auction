<template>
  <default-layout>
      <page>
          <columns number="2" number-s="1" weight="right">
            <h1>Query node</h1>
            <block>
              <query-latest-blocks></query-latest-blocks>
              <hr>
              <query-block></query-block>
              <hr>
              <account-query-form></account-query-form>
            </block>
          </columns>
      </page>
  </default-layout>
</template>

<script>
import DefaultLayout from '../../layouts/DefaultLayout'
import AccountQueryForm from './components/AccountQueryForm'
import QueryBlock from './components/QueryBlock.vue'
import QueryLatestBlocks from './components/QueryLatestBlocks.vue'

export default {
  components: { DefaultLayout, AccountQueryForm, QueryLatestBlocks, QueryBlock }
}
</script>