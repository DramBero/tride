<template>
  <div id="app">
    <ModalMain v-show="getOpenModal" modalHide="hideOpenFile" header="Load">
      <ModalContentUpload />
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
    ModalContentDialogue
  },
  computed: {
    getOpenModal() {
      return this.$store.getters["getOpenFile"];
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Pelagiad";
  src: local("Pelagiad"), url(./fonts/pelagiad/Pelagiad.ttf) format("truetype");
}

html {
  padding: 0;
}

::-webkit-scrollbar {
  /* chrome based */
  width: 0px; /* ширина scrollbar'a */
  scrollbar-width: thin;
  background: rgba(25, 56, 31, 0.02);
  border-radius: 24px;
  &-thumb {
    background-color: rgba(25, 56, 31, 0.4);
  }
  // background: transparent; /* опционально */
}
</style>
