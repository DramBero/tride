<template>
  <div class="frame-upload">
    <h2 class="modal__title">Upload your plugin and its masters</h2>
    <ToolbarReadFile />
    <div class="frame-upload-deps">
      <div class="frame-upload-deps__title" v-if="getDependencies && getDependencies.length > 0">Requires:</div>
      <div
        class="frame-upload-deps__element"
        v-for="dep in getDependencies"
        :key="dep"
      >
        {{ dep }} <ToolbarReadFile :dep="dep"/>
      </div>
    </div>
  </div>
</template>

<script>
import ToolbarReadFile from "@/components/toolbar/ToolbarReadFile.vue";
export default {
  components: {
    ToolbarReadFile
  },
  computed: {
    getDependencies() {
      if (this.$store.getters["getActiveHeader"] && this.$store.getters["getActiveHeader"].masters) {
        return this.$store.getters["getActiveHeader"].masters.map(
          (val) => val[0]
        );
      }
    }
  }
};
</script>

<style lang="scss">
.modal__title {
  color: rgba(0, 0, 0, 0.65);
  padding: 10px;
  font-weight: 500;
  margin-bottom: 20px;
}

.frame-upload {
  //padding: 10px;
  margin: 2px;
  height: 100%;
  overflow-y: scroll;
  &-deps {
    font-size: 20px;
    margin-top: 10px;
    &__element {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px;
    }
  }
}
</style>
