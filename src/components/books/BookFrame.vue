<template>
  <div class="journal-frame">
    <BookFrameItem v-for="book in getBooks" :key="book.id" :book="book" />
  </div>
</template>

<script>
import BookFrameItem from "./BookFrameItem.vue";
export default {
  computed: {
    getBooks() {
      return this.$store.getters["getBooks"];
    }
  },
  components: { BookFrameItem }
};
</script>

<style>
.journal-frame {
  background-color: #986;
  padding: 10px;
  max-width: 50%;
}
</style>
