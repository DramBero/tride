<template>
  <div class="dialogue-filters">
    <div
      class="dialogue-filters__filter dialogue-filters__filter_speaker"
      v-for="speakerType in getOtherSpeakers"
      :key="speakerType.value + speakerType.type"
      tabindex="0"
      @focus="handleFilter(filter)"
      @focusout="handleFilter({})"
    >
      <span class="filter__if">if </span>
      <span class="filter__function">{{ speakerType.type }} </span>
      <span class="filter__comparison">== </span>
      <span class="filter__value">{{ speakerType.value }}</span>
    </div>

    <div
      class="dialogue-filters__filter dialogue-filters__filter_disp"
      v-if="answer.data.disposition > 0"
      key="disposition"
      tabindex="0"
      @focus="handleFilter(filter)"
      @focusout="handleFilter({})"
    >
      <span class="filter__if">if </span>
      <span class="filter__function">Disposition </span>
      <span class="filter__comparison">> </span>
      <span class="filter__value">{{ answer.data.disposition }}</span>
    </div>

    <div
      class="dialogue-filters__filter"
      v-for="(filter, index) in answer.filters"
      :key="index"
      tabindex="0"
      @focus="handleFilter(filter)"
      @focusout="handleFilter({})"
    >
      <span class="filter__if">if </span>
      <span class="filter__function">{{ filter.filter_function }} </span>
      <span class="filter__id">{{ filter.id }} </span>
      <span class="filter__comparison"
        >{{ parseComparison(filter.filter_comparison) }}
      </span>
      <span class="filter__value">{{ Object.values(filter.value)[0] }}</span>
    </div>
    <icon
      v-if="editMode"
      name="plus-circle"
      class="icon_gray"
      scale="1.5"
    ></icon>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
export default {
  props: {
    answer: {
      type: Object
    },
    speaker: {
      type: String
    },
    editMode: {
        type: Boolean
    }
  },
  components: {
    Icon
  },
  computed: {
    getOtherSpeakers() {
      return [
        {
            type: 'Speaker ID',
            value: this.answer.speaker_id
        },
        {
            type: 'Speaker Cell',
            value: this.answer.speaker_cell
        },
        {
            type: 'Speaker Faction',
            value: this.answer.speaker_faction
        },
        {
            type: 'Speaker Class',
            value: this.answer.speaker_class
        },
        {
            type: 'Speaker Sex',
            value: this.answer.data.speaker_sex !== 'Any' ? this.answer.data.speaker_sex : ''
        },
        {
            type: 'Speaker Rank',
            value: this.answer.data.speaker_rank !== -1 ? this.answer.data.speaker_rank : ''
        },
        {
            type: 'Speaker Race',
            value: this.answer.speaker_rank
        },
        {
            type: 'Player Rank',
            value: this.answer.data.player_rank !== -1 ? this.answer.data.player_rank : ''
        },
        {
            type: 'Player Faction',
            value: this.answer.player_faction
        },
      ].filter(val => val.value && val.value !== this.speaker)
      ;
    }
  },
  methods: {
    handleFilter(filter) {
      if (filter.filter_function === "JournalType") {
        this.$store.commit("setSidebarActive", 'Journal')
        this.$store.commit("setJournalHighlight", filter);
      } else {
        this.$store.commit("setJournalHighlight", {});
      }
    },
    parseComparison(comparison) {
      switch (comparison) {
        case "Equal":
          return "==";
        case "GreaterEqual":
          return ">=";
        case "LesserEqual":
          return "<=";
        case "Less":
          return "<";
        case "Greater":
          return ">";
        case "NotEqual":
          return "!=";
        default:
          return comparison;
      }
    }
  }
};
</script>

<style lang="scss">
.dialogue-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &__filter {
    display: inline-block;
    cursor: pointer;
    align-items: center;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    padding: 5px 10px;
    margin: 5px;
    color: black;
    height: fit-content;
    width: fit-content;
    &_disp {
      background: rgba(255, 255, 255, 0.2);
      color: rgb(185, 185, 166);
    }
    &_speaker {
      background: rgba(121, 105, 82, 0.6);
      color: rgb(185, 185, 166);
    }
  }
}

.filter {
  &__if {
    color: rgb(56, 134, 60);
  }
}
</style>