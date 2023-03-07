<template>
  <div class="frame-upload">
    <ToolbarReadFile active />
    <div class="frame-upload-deps">
      <div class="frame-upload-deps__title" v-if="getDependencies && getDependencies.length > 0">Requires:</div>
      <div
        class="frame-upload-deps__element"
        v-for="dep in getDependencies"
        :key="dep"
      >
        {{ dep }} <ToolbarReadFile />
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
      if (this.$store.getters["getActiveHeader"][0]) {
        return this.$store.getters["getActiveHeader"][0].masters.map(
          (val) => val[0]
        );
      }
    }
  }
};
</script>

<style lang="scss">
.frame-upload {
  padding: 10px;
  margin: 2px;
  height: 100%;
  overflow-y: scroll;
  &-deps {
    font-size: 16px;
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
