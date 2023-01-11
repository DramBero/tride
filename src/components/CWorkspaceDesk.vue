<template>
  <div class="workspace-desk">
    <JournalFrame />
    <DialogueFrame />
  </div>
</template>

<script>
import DialogueFrame from "./dialogue/DialogueFrame.vue";
import JournalFrame from "./journal/JournalFrame.vue";

export default {
  components: { JournalFrame, DialogueFrame }
};
</script>

<style>
.workspace-desk {
  height: calc(100% - 50px);
  width: 100%;
  display: flex;
}
</style>
