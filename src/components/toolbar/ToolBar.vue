<template>
  <div class="toolbar">
    <div class="file-controls">
      <ToolBarOpen />
    </div>
    <div class="header-controls" v-if="getTitle">
      <div class="header-controls__title">
        {{ getTitle }}
      </div>
      <div class="header-controls__info">

      </div>
    </div>

  </div>
</template>

<script>
import ToolBarOpen from "./ToolBarOpen.vue";

export default {
  components: { ToolBarOpen },
  computed: {
    getTitle() {
      return this.$store.getters['getActivePluginTitle']
    }
  }
};
</script>

<style lang="scss">
.toolbar {
  height: 50px;
  background-color: #cb9;
  box-shadow: 2px 2px 8px rgba(25, 56, 31, 0.15);
  display: flex;
  font-family: 'Pelagiad';
}

.file-controls {
  height: 100%;
}
.header-controls {
  margin-left: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  &__title {
    font-size: 25px;
  }
}
</style>
