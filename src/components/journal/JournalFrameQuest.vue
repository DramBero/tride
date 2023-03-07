<template>
  <div class="quest" v-if="quest.entries.length">
    <div class="quest-title" @click="toggleCollapse">
      {{ quest.name }}
    </div>
    <div class="quest-id" @click="toggleCollapse">
      {{ quest.id }}
    </div>
    <collapse-transition>
      <div v-show="isCollapsed">
        <div
          class="quest-entry"
          :class="{ 'quest-entry_finished': entry.quest_finish, 'quest-entry_highlighted': getIsHighlighted(entry.data.disposition) }"
          v-for="entry in quest.entries"
          :key="entry.info_id"
        >
          <div class="quest-entry__text">{{ entry.text }}</div>
          <div class="quest-entry__index">{{ entry.data.disposition }}</div>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
export default {
  props: {
    quest: Object
  },
  components: {
    CollapseTransition
  },
  data() {
    return {
      isCollapsed: false,
      highlightedComparison: '',
      highlightedId: '',
    };
  },
  watch: {
    getHighlight(newValue) {
      if (newValue.id === this.quest.id) {
        this.isCollapsed = true
        this.highlightedComparison = newValue.filter_comparison
        this.highlightedId = newValue.value.Integer
      } else {
        this.isCollapsed = false
        this.highlightedComparison = ''
        this.highlightedId = ''
      }
    }
  },
  computed: {
    getHighlight() {
      return this.$store.getters['getJournalHighlight']
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    getIsHighlighted(entryId) {
      let intEntryId = parseInt(entryId)
      let intHighlightedId = parseInt(this.highlightedId)
      switch(this.highlightedComparison) {
        case 'Equal': return intEntryId == intHighlightedId
        case 'GreaterEqual': return intEntryId >= intHighlightedId
        case 'LesserEqual': return intEntryId <= intHighlightedId
        case 'Less': return intEntryId < intHighlightedId
        case 'Greater': return intEntryId > intHighlightedId
        case 'NotEqual': return intEntryId != intHighlightedId
        default: return false
      }
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
.quest {
  font-family: "Pelagiad", "Sans serif";
  border-radius: 8px;
  line-height: 23px;
  font-size: 20px;
  padding: 15px;
  margin: 5px;
  background-color: rgba(255, 255, 255, 0.3);
  &-title {
    color: rgb(150, 50, 30);
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
    font-size: 16px;
  }
  &-entry {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    margin: 5px 0;
    display: flex;
    transition: all .2s ease-in;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
    &_finished {
      background-color: rgba(145, 215, 145, 0.5);
    }
    &_highlighted {
      background-color: rgba(255, 242, 122, 0.7) !important;
      border-color: rgb(255, 242, 122)
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
</style>
