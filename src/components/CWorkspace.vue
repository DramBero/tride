<template>
  <div class="workspace">
    <ToolBar />
    <CWorkspaceDesk />
  </div>
</template>

<script>
import CWorkspaceDesk from "./CWorkspaceDesk.vue";
import ToolBar from "./toolbar/ToolBar.vue";

export default {
  components: { ToolBar, CWorkspaceDesk }
};
</script>

<style>
.workspace {
  height: 100vh;
  max-height: 100vh;
}
</style>
