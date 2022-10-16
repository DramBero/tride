<template>
  <div id="app">
    <ModalMain v-show="getOpenModal" modalHide="hideOpenFile">
      <ModalContentUpload />
    </ModalMain>
    <ToolBarOpen />
    <JournalFrame />
    <BookFrame />
  </div>
</template>

<script>
import ToolbarReadFile from "./components/toolbar/ToolbarReadFile.vue";
import JournalFrame from "./components/journal/JournalFrame.vue";
import ToolBarOpen from "./components/toolbar/ToolBarOpen.vue";
import ModalContentUpload from "./components/modals/ModalContentUpload.vue";
import ModalMain from "./components/modals/ModalMain.vue";
import BookFrame from "./components/books/BookFrame.vue";

export default {
  name: "App",
  components: {
    ToolbarReadFile,
    JournalFrame,
    ToolBarOpen,
    ModalContentUpload,
    ModalMain,
    BookFrame
  },
  computed: {
    getOpenModal() {
      return this.$store.getters["getOpenFile"];
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Pelagiad";
  src: local("Pelagiad"), url(./fonts/pelagiad/Pelagiad.ttf) format("truetype");
}
</style>
