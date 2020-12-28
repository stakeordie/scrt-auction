<template>
  <section class="tx-send">
      <h2>Send</h2>
      <validation-observer v-slot="{ handleSubmit, invalid }">
      <form class="form" @submit.prevent="handleSubmit(queryBlock)">
        <ul>
          <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
        </ul>

        <div class="form__frame">
          <validation-provider rules="required|integer" v-slot="{ errors }">
            <label for="blocks-number">Amount</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="blocks-number" type="text" v-model.trim="heightForm" />
          </validation-provider>
          <validation-provider rules="required|integer" v-slot="{ errors }">
            <label for="blocks-number">Gas</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="blocks-number" type="text" v-model.trim="heightForm" />
          </validation-provider>
          <button :disabled="invalid">Send</button>
        </div>
      </form>
      <div class="blocks-info" v-if="block">
          <dl>
              <dt>Hash</dt>
              <dd>{{ block.block_id.hash }}</dd>
              <dt>Timestamp</dt>
              <dd>{{ block.block.header.time }}</dd>
          </dl>
      </div>
    </validation-observer>

  </section>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

export default {
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      heightForm: "",
      block: null,
      errors: [],
    };
  },
}
</script>

<style>

</style>