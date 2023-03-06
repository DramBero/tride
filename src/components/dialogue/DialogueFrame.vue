<template>
  <div class="frame">
    <div class="frame-controls">
      <div class="frame-controls-left"></div>
      <div class="frame-controls-types">
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_id')
          }"
          @click="toggleType('speaker_id')"
        >
          Name
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_cell')
          }"
          @click="toggleType('speaker_cell')"
        >
          Cell
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_faction')
          }"
          @click="toggleType('speaker_faction')"
        >
          Faction
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_class')
          }"
          @click="toggleType('speaker_class')"
        >
          Class
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_universal')
          }"
          @click="toggleType('speaker_universal')"
        >
          Global
        </div>
      </div>
    </div>

    <div class="frame-dialogue">
      <DialogueFrameCard
        v-for="npc in getNPCs"
        :key="npc"
        :speaker-id="npc"
        type="npc"
      />
    </div>
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
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
import ModalContentDialogue from "../modals/ModalContentDialogue.vue";
import ModalMain from "../modals/ModalMain.vue";
import DialogueFrameCard from "./DialogueFrameCard.vue";
export default {
  components: { Icon, DialogueFrameCard, ModalMain, ModalContentDialogue },
  data() {
    return {
      speakerTypes: ["speaker_id"]
    };
  },
  computed: {
    getNPCs() {
      return this.$store.getters["getDialogueSpeaker"](this.speakerTypes);
    },
    getOpenModalDialogue() {
      return this.$store.getters["getDialogueModal"];
    }
  },
  methods: {
    toggleType(type) {
      if (this.speakerTypes.includes(type)) {
        this.speakerTypes = this.speakerTypes.filter((val) => val != type);
      } else {
        this.speakerTypes.push(type);
      }
    }
  }
};
</script>

<style lang="scss">
.frame {
  display: flex;
  background: rgb(37, 72, 75);
  position: relative;
  height: 100%;
  width: 100%;
  flex-direction: column;
  &-controls {
    display: flex;
    justify-content: space-between;
    margin: 5px;
    &-types {
      display: flex;
      gap: 5px;
      &__type {
        width: 90px;
        user-select: none;
        border-radius: 2px;
        cursor: pointer;
        height: 40px;
        border: 2px solid rgb(120, 120, 120);
        background: rgba(0, 0, 0, 0.85);
        color: rgb(120, 120, 120);
        font-family: "Pelagiad";
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease-in;
        &:hover {
        }
        &_active {
          border: 3px solid rgb(202, 165, 96);
          background: rgb(202, 165, 96);
          color: black;
        }
      }
    }
  }
}
.frame-dialogue {
  position: relative;
  overflow-y: scroll;
  //flex-grow: 1;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px 20px 0px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
}
</style>
