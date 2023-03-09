<template>
  <div class="quest">
    <div class="quest-title" @click="toggleCollapse">
      {{ quest.name }}
    </div>
    <div class="quest-id" @click="toggleCollapse">
      {{ quest.id }}
    </div>
    <collapse-transition v-if="quest.entries.length">
      <div v-show="isCollapsed">
        <div
          v-for="entry in quest.entries.sort(
            (a, b) =>
              parseInt(a.data.disposition) - parseInt(b.data.disposition)
          )"
          :key="entry.info_id"
        >
          <div v-if="entryEdit != entry.data.disposition" class="entry-wrapper">
            <div
              class="quest-entry"
              :class="{
                'quest-entry_finished': entry.quest_finish,
                'quest-entry_highlighted': getIsHighlighted(
                  entry.data.disposition
                )
              }"
            >
              <div class="quest-entry__text">{{ entry.text }}</div>
              <div class="quest-entry__index">{{ entry.data.disposition }}</div>
            </div>
            <button class="edit-button">
              <icon
                name="pen"
                scale="1"
                @click="entryEdit = entry.data.disposition"
              ></icon>
            </button>
          </div>
          <div v-else>
            <form
              class="edit"
              @submit.prevent="editEntry($event, entry.info_id)"
            >
              <button @click.prevent="deleteEntry(entry.info_id)">
                <icon
                  name="trash"
                  scale="1"
                  @click="entryEdit = entry.data.disposition"
                ></icon>
              </button>
              <div class="edit-entry">
                <div class="edit-entry-above">
                  <textarea
                    v-text="entry.text"
                    name="entryText"
                    type="text"
                    class="edit-entry-above__text"
                  ></textarea>
                  <input
                    :placeholder="parseInt(entry.data.disposition)"
                    name="entryDisp"
                    type="number"
                    :value="parseInt(entry.data.disposition)"
                    class="edit-entry-above__disp"
                  />
                </div>
                <label class="edit-entry__checkbox"
                  ><span>Finished: </span
                  ><input
                    type="checkbox"
                    title="Finished"
                    name="entryFinished"
                    :checked="entry.quest_finish"
                /></label>
              </div>
              <div class="edit-entry-controls">
                <button type="submit">
                  <icon
                    name="save"
                    scale="1"
                    @click="entryEdit = entry.data.disposition"
                  ></icon>
                </button>
                <button @click.prevent="entryEdit = ''">
                  <icon
                    name="ban"
                    scale="1"
                    @click="entryEdit = entry.data.disposition"
                  ></icon>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="add-entry" @click="createEntry">+</div>
      </div>
    </collapse-transition>
    <div v-else class="no-entries">
      No entries yet. <a class="link" @click="createEntry">Create?</a>
    </div>
  </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
export default {
  props: {
    quest: Object
  },
  components: {
    CollapseTransition,
    Icon
  },
  data() {
    return {
      isCollapsed: false,
      highlightedComparison: "",
      highlightedId: "",
      entryEdit: ""
    };
  },
  watch: {
    getHighlight(newValue) {
      if (newValue.id === this.quest.id) {
        this.isCollapsed = true;
        this.highlightedComparison = newValue.filter_comparison;
        this.highlightedId = newValue.value.Integer;
      } else {
        this.isCollapsed = false;
        this.highlightedComparison = "";
        this.highlightedId = "";
      }
    }
  },
  computed: {
    getHighlight() {
      return this.$store.getters["getJournalHighlight"];
    },
    getLatestDisposition() {
      if (!this.quest.entries[0] || this.quest.entries[0].data.disposition) return "10";
      return (
        Math.floor(
          Math.max(
            ...this.quest.entries.map((val) => parseInt(val.data.disposition))
          ) /
            10 +
            1
        ) * 10
      ).toString();
    }
  },
  methods: {
    //editJournalEntry(state, [entryId, entryText, entryDisp, entryFinished])
    editEntry(event, info_id) {
      this.$store.commit("editJournalEntry", [
        info_id,
        event.target.elements.entryText.value,
        event.target.elements.entryDisp.value,
        event.target.elements.entryFinished.checked
      ]);
      this.entryEdit = "";
    },
    deleteEntry(info_id) {
      this.entryEdit = "";
      this.$store.commit("deleteJournalEntry", info_id);
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    getIsHighlighted(entryId) {
      let intEntryId = parseInt(entryId);
      let intHighlightedId = parseInt(this.highlightedId);
      switch (this.highlightedComparison) {
        case "Equal":
          return intEntryId == intHighlightedId;
        case "GreaterEqual":
          return intEntryId >= intHighlightedId;
        case "LesserEqual":
          return intEntryId <= intHighlightedId;
        case "Less":
          return intEntryId < intHighlightedId;
        case "Greater":
          return intEntryId > intHighlightedId;
        case "NotEqual":
          return intEntryId != intHighlightedId;
        default:
          return false;
      }
    },
    createEntry() {
      this.isCollapsed = true;
      this.$store.commit("addJournalEntry", [
        this.quest.id,
        "New entry",
        this.getLatestDisposition
      ]);
    }
  }
};
</script>

<style lang="scss">
button,
input[type="submit"],
input[type="reset"] {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.entry-wrapper {
  display: flex;
  gap: 10px;
}

.edit {
  display: flex;
  gap: 10px;
  width: 100%;
  &-entry {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-controls {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-above {
      display: flex;
      width: 100%;

      &__text {
        flex-grow: 1;
        font-family: "Pelagiad";
        min-height: 200px;
        padding: 10px;
        font-size: 20px;
        border-radius: 8px 0 0 8px;
      }
      &__disp {
        width: 70px;
        padding: 10px;
        font-family: "Pelagiad";
        font-size: 20px;
        border-radius: 0 8px 8px 0;
      }
    }
  }
}

.quest {
  font-family: "Pelagiad", "Sans serif";
  width: 100%;
  border-radius: 8px;
  line-height: 23px;
  font-size: 20px;
  padding: 15px;
  margin: 5px;
  background-color: rgba(255, 255, 255, 0.3);
  &-title {
    color: rgb(150, 50, 30);
    cursor: pointer;
    width: 100%;
    font-size: 23px;
    text-align: left;
    user-select: none;
    padding: 5px 0 8px 0;
    &:hover {
      color: rgb(180, 80, 60);
    }
  }
  &-id {
    color: black;
    cursor: pointer;
    font-size: 16px;
  }
  &-entry {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    flex-grow: 1;
    margin: 8px 0;
    min-height: 50px;
    display: flex;
    transition: all 0.2s ease-in;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
    &_finished {
      background-color: rgba(145, 215, 145, 0.5);
    }
    &_highlighted {
      background-color: rgba(255, 242, 122, 0.7) !important;
      border-color: rgb(255, 242, 122);
    }
    &__text {
      flex-grow: 1;
      padding: 10px;
    }
    &__index {
      min-width: 50px;
      max-width: 50px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 0 8px 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.add-entry {
  font-size: 40px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding: 15px;
}

.link {
  cursor: pointer;
  color: rgb(75, 86, 150);
  &:hover {
    color: rgb(112, 126, 207);
  }
}

.no-entries {
  text-align: center;
  width: 100%;
  padding: 10px;
}
</style>
