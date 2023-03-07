<template>
  <div class="journal-frame">
    <JournalFrameQuest
      v-for="quest in getJournal"
      :key="quest.name_id"
      :quest="quest"
    />
  </div>
</template>

<script>
import JournalFrameQuest from "./JournalFrameQuest.vue";
export default {
  computed: {
    getJournal() {
      return this.$store.getters["getParsedQuests"];
    }
  },
  components: { JournalFrameQuest }
};
</script>

<style>
.journal-frame {
  background-color: #986;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
  z-index: 2;
  padding: 10px;
  min-width: 500px;
  max-width: 500px;
  height: 100%;
  overflow-y: scroll;
}
</style>
