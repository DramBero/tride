<template>
  <div class="frame-dialogue">
    <DialogueFrameCard
      v-for="npc in getNPCs"
      :key="npc"
      :speaker-id="npc"
      type="npc"
    />
  </div>
</template>

<script>
import DialogueFrameCard from "./DialogueFrameCard.vue";
export default {
  components: { DialogueFrameCard },
  computed: {
    getNPCs() {
      return this.$store.getters["getDialogueSpeakerNPCs"];
    }
  }
};
</script>

<style>
.frame-dialogue {
  overflow: scroll;
  height: 100%;
  flex-grow: 1;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px 20px 0px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
}
</style>
