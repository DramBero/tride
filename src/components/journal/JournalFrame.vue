<template>
  <div class="journal-frame">
    <div class="journal-frame__controls" v-if="true">
      <div class="add-quest" @click="addQuest()">
        New <icon name="plus-circle" class="add-quest__button" scale="1"></icon>
      </div>
    </div>
    <div v-if="getJournal.length" class="quests">
      <transition-group
        name="fadeHeight"
        mode="out-in"
        :style="{ width: '100%' }"
      >
        <JournalFrameQuest
          v-for="quest in getJournal"
          :key="quest.id || 0"
          :quest="quest"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import JournalFrameQuest from "./JournalFrameQuest.vue";
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
export default {
  computed: {
    getJournal() {
      return this.$store.getters["getParsedQuests"];
    }
  },
  components: { JournalFrameQuest, Icon },
  methods: {
    addQuest() {
      this.$store.commit("setQuestCreateModal", true);
    }
  }
};
</script>

<style lang="scss">
.journal-frame {
  background-color: #986;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
  z-index: 2;
  padding: 10px;
  min-width: 500px;
  max-width: 500px;
  height: 100%;
  max-height: 100%;
  font-family: "Pelagiad";
  position: relative;
  &__controls {
    font-size: 22px;
    position: absolute;
    top: 10px;
  }
}
.quests {
  display: flex;
  height: calc(100% - 40px);
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
  margin-top: 40px;
  padding-right: 10px;
  gap: 5px;
  flex-direction: column;
  align-items: center;
}
.add-quest {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.65);
  color: rgb(202, 165, 96);
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 4px;
  transition: all 0.1s ease-in;
  &:hover {
    color: white;
    .add-quest__button {
      fill: white;
    }
  }
  &__button {
    transition: all 0.1s ease-in;
    fill: rgb(202, 165, 96);
  }
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
