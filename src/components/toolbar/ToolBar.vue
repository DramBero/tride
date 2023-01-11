<template>
  <div class="toolbar">
    <ToolBarOpen />
  </div>
</template>

<script>
import ToolBarOpen from "./ToolBarOpen.vue";

export default {
  components: { ToolBarOpen }
};
</script>

<style>
.toolbar {
  height: 50px;
  background-color: #cb9;
  box-shadow: 2px 2px 8px rgba(25, 56, 31, 0.15);
}
</style>
