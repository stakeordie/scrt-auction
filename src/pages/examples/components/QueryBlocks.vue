<template>
  <section class="query-blocks">
    <h2>Query blocks</h2>
    <validation-observer v-slot="{ handleSubmit }">
      <form class="height-form" @submit.prevent="handleSubmit(queryBlocks)">
        <validation-provider rules="required" v-slot="{ errors }">
          <label for="blocks-number">Blocks height</label>
          <span class="error">{{ errors[0] }}</span>
          <input name="blocks-number" type="text" v-model.trim="heightForm" />
        </validation-provider>
        <button>Get blocks</button>
      </form>
      <div class="blocks-info" v-if="blocks">
          <dl>
              <dt>Hash</dt>
              <dd>{{ blocks.block_id.hash }}</dd>
              <dt>Timestamp</dt>
              <dd>{{ blocks.block.header.time }}</dd>
          </dl>
      </div>
    </validation-observer>
  </section>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

export default {
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      heightForm: "",
      blocks: null,
    };
  },
  methods: {
    async queryBlocks() {
      this.blocks = await this.$scrtjs.getBlocks(this.heightForm);
      console.log(this.blocks);
    },
  },
};
</script>

<style lang="scss" scoped>
    @import "@lkmx/flare/src/functions/respond-to";

    .height-form {
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