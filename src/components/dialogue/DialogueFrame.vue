<template>
  <div class="frame-dialogue">
    <DialogueFrameCard
      v-for="npc in getNPCs"
      :key="npc"
      :speaker-id="npc"
      type="npc"
    />
    <ModalMain
      dialogue
      v-show="getOpenModalDialogue"
      modalHide="hideDialogue"
      :header="getOpenModalDialogue"
    >
      <ModalContentDialogue :speaker="getOpenModalDialogue" />
    </ModalMain>
  </div>
</template>

<script>
import ModalContentDialogue from "../modals/ModalContentDialogue.vue";
import ModalMain from "../modals/ModalMain.vue";
import DialogueFrameCard from "./DialogueFrameCard.vue";
export default {
  components: { DialogueFrameCard, ModalMain, ModalContentDialogue },
  computed: {
    getNPCs() {
      return this.$store.getters["getDialogueSpeaker"]("speaker_id");
    },
    getOpenModalDialogue() {
      return this.$store.getters["getDialogueModal"];
    }
  }
};
</script>

<style>
.frame-dialogue {
  position: relative;
  overflow: scroll;
  height: 100%;
  flex-grow: 1;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px 20px 0px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
}
</style>
