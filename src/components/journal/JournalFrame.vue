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
  padding: 10px;
  max-width: 50%;
}
</style>
