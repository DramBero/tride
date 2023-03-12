<template>
  <div class="frame">
    <div class="frame-controls">
      <div class="frame-controls-left">
        <div
          class="frame-controls-types__type frame-controls-types__type_active"
          :style="{'gap': '10px'}"
          @click="addDialogue()"
        >
          Add <icon name="plus-circle" scale="1"></icon>
        </div>
      </div>
      <div class="frame-controls-types" v-if="getNPCs">
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_id')
          }"
          @click="toggleType('speaker_id')"
        >
          Name {{ getSpeakerIdLength }}
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_cell')
          }"
          @click="toggleType('speaker_cell')"
        >
          Cell {{ getSpeakerCellLength }}
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_faction')
          }"
          @click="toggleType('speaker_faction')"
        >
          Faction {{ getSpeakerFactionLength }}
        </div>
        <div
          class="frame-controls-types__type"
          :class="{
            'frame-controls-types__type_active':
              speakerTypes.includes('speaker_class')
          }"
          @click="toggleType('speaker_class')"
        >
          Class {{ getSpeakerClassLength }}
        </div>
        <div
          v-if="false"
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

    <div >
      <transition-group
          name="fadeHeight"
          class="frame-dialogue"
          mode="out-in"
          :style="{ width: '100%' }"
        >
      <DialogueFrameCard
        v-for="npc in getNPCs"
        :key="npc"
        :speaker-id="npc"
        type="npc"
      />
    </transition-group>
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
    },
    getSpeakerIdLength() {
      return this.$store.getters["getDialogueSpeaker"](["speaker_id"]).length || '';
    },
    getSpeakerCellLength() {
      return this.$store.getters["getDialogueSpeaker"](["speaker_cell"]).length || '';
    },
    getSpeakerFactionLength() {
      return this.$store.getters["getDialogueSpeaker"](["speaker_faction"]).length || '';
    },
    getSpeakerClassLength() {
      return this.$store.getters["getDialogueSpeaker"](["speaker_class"]).length || '';
    },
  },
  methods: {
    toggleType(type) {
      if (this.speakerTypes.includes(type)) {
        this.speakerTypes = this.speakerTypes.filter((val) => val != type);
      } else {
        this.speakerTypes.push(type);
      }
    },
    addDialogue() {
      this.$store.commit("setDialogueCreateModal", true);
    }
  }
};
</script>

<style lang="scss">
.frame {
  display: flex;
  background-image: linear-gradient(#465057 1px, transparent 1px), linear-gradient(to right, #465057 1px, transparent 1px);
  background-size: 33px 33px;
  background-color: #2c3a42;
  position: relative;
  height: 100%;
  width: 100%;
  flex-direction: column;
  &-controls {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    &-types {
      display: flex;
      gap: 5px;
      &__type {
        width: 90px;
        user-select: none;
        border-radius: 4px;
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
          color: white;
        }
        &_active {
          border: 3px solid rgb(202, 165, 96);
          background: rgb(202, 165, 96);
          color: black;
          &:hover {
            color: black;
            background-color: rgba(202, 165, 96, 0.7);;
          }
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
  padding: 20px 20px 30px 20px;
  display: flex;
  justify-content: center;
  //grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.15s cubic-bezier(1, 1, 1, 1);
  opacity: 100;
}

.fadeHeight-enter,
.fadeHeight-leave-to {
  opacity: 0%;
}
</style>
