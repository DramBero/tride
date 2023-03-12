<template>
  <div id="app">
    <ModalMain v-show="getOpenModal" modalHide="hideOpenFile" header="Load">
      <ModalContentUpload />
    </ModalMain>
    <ModalMain
      v-show="getDialogueCreateModal"
      header="New dialogue"
      modalHide="hideDialogueCreateModal"
    >
      <ModalContentNewDialogue />
    </ModalMain>
    <ModalMain
      v-show="getQuestCreateModal"
      header="New quest"
      modalHide="hideQuestCreateModal"
    >
      <ModalContentNewQuest />
    </ModalMain>
    <CWorkspace />
  </div>
</template>

<script>
import ToolbarReadFile from "./components/toolbar/ToolbarReadFile.vue";
import JournalFrame from "./components/journal/JournalFrame.vue";
import ToolBarOpen from "./components/toolbar/ToolBarOpen.vue";
import ModalContentUpload from "./components/modals/ModalContentUpload.vue";
import ModalMain from "./components/modals/ModalMain.vue";
import BookFrame from "./components/books/BookFrame.vue";
import CWorkspace from "./components/CWorkspace.vue";
import ModalContentDialogue from "./components/modals/ModalContentDialogue.vue";
import ModalContentNewQuest from "./components/modals/ModalContentNewQuest.vue";
import ModalContentNewDialogue from "./components/modals/ModalContentNewDialogue.vue";

export default {
  name: "App",
  components: {
    ToolbarReadFile,
    JournalFrame,
    ToolBarOpen,
    ModalContentUpload,
    ModalMain,
    BookFrame,
    CWorkspace,
    ModalContentDialogue,
    ModalContentNewQuest,
    ModalContentNewDialogue
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
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Pelagiad";
  src: local("Pelagiad"), url(./fonts/pelagiad/Pelagiad.ttf) format("truetype");
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 8px;
  scrollbar-width: thin;
  background: none;
  &-thumb {
    background-color: rgb(202, 165, 96);
  }
}

.modal-field {
  width: 100%;
  &__input {
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgb(202, 165, 96);
    color: rgb(202, 165, 96);
    font-family: 'Pelagiad';
    font-size: 20px;
    padding: 10px;
    border-radius: 8px;
    &:focus {
      outline: none !important;
      border: 1px solid white;
    }
  }
}

.modal-button {
  border: 2px solid rgb(202, 165, 96);
  padding: 5px 10px;
  max-width: 100px;
  border-radius: 4px;
  cursor: pointer;
  transition: color .15s ease-in;
  &:hover {
    color: white;
  }
  &:disabled {
    color: gray;
    border: 2px solid gray;
    cursor: default;
  }
}

input[type='number'] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
