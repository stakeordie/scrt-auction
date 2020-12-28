<template>
  <section class="query-blocks">
    <h2>Query blocks</h2>
    <validation-observer v-slot="{ handleSubmit, invalid }">
      <form class="height-form" @submit.prevent="handleSubmit(queryBlock)">
        <ul>
          <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
        </ul>

        <div class="height-form__frame">
          <validation-provider rules="required|integer" v-slot="{ errors }">
            <label for="blocks-number">Block height</label>
            <span class="error">{{ errors[0] }}</span>
            <input name="blocks-number" type="text" v-model.trim="heightForm" />
          </validation-provider>
          <button :disabled="invalid">Get blocks</button>
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
import { required, integer } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("integer", {
  ...integer,
  message: "This field must be an integer",
});

export default {
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      heightForm: "",
      block: null,
      errors: [],
    };
  },
  methods: {
    async queryBlock() {
      try {
        this.errors = [];
        this.block = await this.$scrtjs.getBlock(this.heightForm);
        console.log(this.block);
      } catch(err) {
        this.block = null;
        this.errors.push(err.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
    @import "@lkmx/flare/src/functions/respond-to";

    .height-form__frame {
        display: grid;
        align-items: end;
        column-gap: var(--f-gutter);
        @include respond-to("<m") {
            grid-template-columns: 1fr;
        }
        @include respond-to(">=m") {
            grid-template-columns: 3fr 1fr;
        }
    }
</style>