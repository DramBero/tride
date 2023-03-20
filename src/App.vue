<template>
  <div id="app">
    <modal-frame />
    <transition
      name="fadeHeight"
      class="frame-dialogue"
      mode="out-in"
      :style="{ width: '100%' }"
    >
      <ModalMain
        v-show="getOpenModalDialogue"
        modalHide="hideDialogue"
        :header="getOpenModalDialogue"
      >
        <ModalContentDialogue :speaker="getOpenModalDialogue" />
      </ModalMain>
    </transition>
    <CWorkspace />
  </div>
</template>

<script>
import ToolbarReadFile from "./components/toolbar/ToolbarReadFile.vue";
import JournalFrame from "./components/journal/JournalFrame.vue";
import ToolBarOpen from "./components/toolbar/ToolBarOpen.vue";
import ModalMain from "./components/modals/ModalMain.vue";
import BookFrame from "./components/books/BookFrame.vue";
import CWorkspace from "./components/CWorkspace.vue";
import ModalContentDialogue from "./components/modals/ModalContentDialogue.vue";
import ModalFrame from "@/components/primary-modals/ModalFrame.vue";

export default {
  name: "App",
  components: {
    ToolbarReadFile,
    JournalFrame,
    ToolBarOpen,
    ModalMain,
    BookFrame,
    CWorkspace,
    ModalContentDialogue,
    ModalFrame,
  },
  computed: {
    getOpenModal() {
      return this.$store.getters["getOpenFile"];
    },
    getQuestCreateModal() {
      return this.$store.getters["getQuestCreateModal"];
    },
    getDialogueCreateModal() {
      return this.$store.getters["getDialogueCreateModal"];
    },
    getOpenModalDialogue() {
      return this.$store.getters["getDialogueModal"];
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Pelagiad";
  src: local("Pelagiad"), url(./fonts/pelagiad/Pelagiad.ttf) format("truetype");
}

@font-face {
  font-family: "Consolas";
  src: local("Consolas"), url(./fonts/consolas/CONSOLA.TTF) format("truetype");
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-family: "Pelagiad";
  background-image: linear-gradient(#465057 1px, transparent 1px),
    linear-gradient(to right, #465057 1px, transparent 1px);
  background-size: 33px 33px;
  background-color: #2c3a42;
}

h2 {
  color: black;
  font-weight: 500;
  margin-bottom: 20px;
}

::-webkit-scrollbar {
  width: 8px;
  scrollbar-width: thin;
  background: none;
  &-thumb {
    background-color: rgb(202, 165, 96);
  }
  &-corner {
    background: none;
  }
}

.modal-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__name {
    font-size: 20px;
  }
  &__input {
    width: 100%;
    resize: none;
    background: rgba(255, 255, 255, 0.18);
    border: 2px solid rgb(202, 165, 96);
    color: black;
    font-family: "Pelagiad";
    font-size: 20px;
    padding: 10px;
    border-radius: 8px;
    &:focus {
      outline: none !important;
      border: 2px solid rgba(255, 255, 255, 0.18);
    }
    &::placeholder {
        color: rgba(0, 0, 0, 0.3);
      }
  }
  &_dark {
    .modal-field__input {
      background: rgba(0, 0, 0, 0.45);
      border: 2px solid rgb(68, 59, 44);
      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.modal-button {
  border: 2px solid rgb(202, 165, 96);
  padding: 5px 10px;
  max-width: 100px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  &_dark {
    min-width: 90px;
        user-select: none;
        border-radius: 4px;
        cursor: pointer;
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
        &-active {
          border: 2px solid rgb(204, 204, 204);
          color: black;
          background-color: rgb(204, 204, 204);
          &:hover {
            background-color: rgb(200, 200, 200);
            color: black;
          }
        }
  }
  &:hover {
    color: white;
  }
  &:disabled {
    color: gray;
    border: 2px solid gray;
    cursor: default;
  }
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
