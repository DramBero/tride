<template>
  <div class="dialogue">
    <div class="dialogue-answers">
      <div class="dialogue-answers__header" v-if="currentTopic">
        {{ currentTopic }}
        <div class="dialogue-answers__edit">
          <icon
            v-if="!editMode"
            name="pen"
            color="#E1FF00"
            class="icon_gold"
            scale="1"
            @click="editMode = true"
          ></icon>
          <div v-else>
            <icon
              name="save"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false"
            ></icon>
            <icon
              name="ban"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false"
            ></icon>
            <icon
              name="trash"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false"
            ></icon>
          </div>
        </div>
      </div>
      <div class="dialogue-answers__frame">
        <div
          class="dialogue-answers-answer"
          :class="{ 'dialogue-answers-answer_edit': editMode }"
          v-for="(answer, index) in currentAnswers"
          :key="index"
        >
          <div class="dialogue-answers-answer__ids" v-if="editMode">
            <div class="prev-id">{{ answer.prev_id || "-" }} (before)</div>
            <div class="curr-id">id: {{ answer.info_id }}</div>
          </div>
          <div
            class="dialogue-answers-answer-filters"
            v-if="answer.filters.length"
          >
            <div
              class="dialogue-answers-answer-filters__filter"
              v-for="(filter, index) in answer.filters"
              :key="index"
              tabindex="0"
              @focus="handleFilter(filter)"
              @focusout="handleFilter({})"
            >
              <span class="filter__if">if </span>
              <span class="filter__function"
                >{{ filter.filter_function }}
              </span>
              <span class="filter__id">{{ filter.id }} </span>
              <span class="filter__comparison"
                >{{ parseComparison(filter.filter_comparison) }}
              </span>
              <span class="filter__value">{{
                Object.values(filter.value)[0]
              }}</span>
            </div>
            <icon
              v-if="editMode"
              name="plus-circle"
              class="icon_gray"
              scale="1.5"
            ></icon>
          </div>
          <div
            class="dialogue-answers-answer__text"
            v-html="getHyperlinkedAnswer(answer.text)"
            @click="handleAnswerClick($event)"
          ></div>
          <div class="dialogue-answers-answer-results" v-if="answer.result">
            <div
              class="dialogue-answers-answer-results__result"
              v-for="(text, index) in answer.result.split('\n')"
              :key="index"
            >
              {{ text }}
            </div>
          </div>
          <div class="dialogue-answers-answer__ids" v-if="editMode">
            <div class="prev-id">{{ answer.info_id }} (id)</div>
            <div class="curr-id">next id: {{ answer.next_id || "-" }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialogue-questions">
      <div class="dialogue-questions__container" v-if="getGreetings.length">
        <div
          class="dialogue-questions__topic"
          v-for="(question, index) in getGreetings"
          :key="index"
          @click="setCurrentAnswers(question, 'Greeting')"
        >
          {{ question }}
        </div>
      </div>
      <div class="dialogue-questions__container" v-if="getPersuasion.length">
        <div
          class="dialogue-questions__topic"
          v-for="(question, index) in getPersuasion"
          :key="index"
          @click="setCurrentAnswers(question, 'Persuasion')"
        >
          {{ question }}
        </div>
      </div>
      <div
        class="dialogue-questions__topic"
        v-for="(question, index) in getTopics"
        :key="index"
        @click="setCurrentAnswers(question, 'Topic')"
      >
        {{ question }}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";

export default {
  components: {
    Icon
  },
  props: {
    speaker: String
  },

  data() {
    return {
      currentAnswers: [],
      currentTopic: "",
      editMode: false
    };
  },

  mounted() {
    this.editMode = false;
  },

  computed: {
    getTopics() {
      return [
        ...new Set(this.getSpeakerData("Topic").map((val) => val.TMP_topic))
      ];
    },
    getGreetings() {
      return [
        ...new Set(this.getSpeakerData("Greeting").map((val) => val.TMP_topic))
      ];
    },
    getPersuasion() {
      return [
        ...new Set(
          this.getSpeakerData("Persuasion").map((val) => val.TMP_topic)
        )
      ];
    }
  },

  methods: {
    setCurrentAnswers(topic, topicType) {
      if (this.editMode) return;
      this.currentAnswers = this.getSpeakerData(topicType).filter(
        (val) => val.TMP_topic == topic
      );
      this.currentTopic = topic;
    },
    getSpeakerData(topicType) {
      return this.$store.getters["getDialogueBySpeaker"]([
        this.speaker,
        topicType
      ]);
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
    },
    handleFilter(filter) {
      if (filter.filter_function === 'JournalType') {
        this.$store.commit('setJournalHighlight', filter)
      } else {
        this.$store.commit('setJournalHighlight', {})
      }
    },
    handleAnswerClick(e) {
      if (this.editMode) return;
      else if (
        e.target.className == "dialogue-answers-answer__text_hyperlink"
      ) {
        this.setCurrentAnswers(e.target.innerText, "Topic");
        this.currentTopic = e.target.innerText;
      }
    },
    getHyperlinkedAnswer(text) {
      let hyperlinkedAnswer = text;
      for (let topic of this.getTopics) {
        if (hyperlinkedAnswer.includes(topic)) {
          hyperlinkedAnswer = hyperlinkedAnswer.replace(
            topic,
            `<span class="dialogue-answers-answer__text_hyperlink">${topic}</span>`
          );
        }
      }
      return hyperlinkedAnswer;
    }
  },

  watch: {
    speaker() {
      this.currentAnswers = [];
      this.currentTopic = "";
    }
  }
};
</script>

<style lang="scss">
.dialogue {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2px;
  &-answers {
    padding: 0 5px;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    //overflow-y: scroll;
    &__edit {
      position: absolute;
      right: 5px;
    }
    &__header {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 2px solid rgb(202, 165, 96);
      min-height: 40px;
      margin-bottom: 2px;
    }
    &__frame {
      flex-grow: 1;
      overflow-y: scroll;
      padding: 5px;
      ::-webkit-scrollbar {
        width: 5px;
        scrollbar-width: thin;
        background: rgba(25, 56, 31, 0.02);
        border-radius: 24px;
        &-thumb {
          background-color: rgba(25, 56, 31, 0.4);
        }
      }
    }
    &-answer {
      margin-top: 20px;
      &_edit {
        border: 1px dotted rgb(202, 165, 96);
        border-radius: 4px;
        padding: 5px;
        background: rgba(202, 165, 96, 0.02);
        transition: all 0.15s ease-in-out;
        &:hover {
          background: rgba(202, 165, 96, 0.04);
        }
      }
      &__text {
        border-left: 2px dotted rgb(202, 165, 96);
        padding-left: 10px;
        margin-left: 20px;
        &_hyperlink {
          cursor: pointer;
          color: rgb(112, 126, 207);
          &:hover {
            color: rgb(159, 169, 223);
          }
        }
      }
      &__ids {
        display: flex;
        width: 100%;
        justify-content: space-between;
        font-size: 15px;
      }
      &-filters {
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
        }
      }
      &-results {
        border: 1px solid rgba(235, 235, 205, 0.3);
        color: rgb(145, 192, 145);
        width: fit-content;
        //white-space: pre-line;
        min-width: 50%;
        border-radius: 4px;
        font-size: 17px;
        padding: 10px;
        margin: 10px 20px;
        &__result {
          display: block;
        }
      }
    }
  }
  &-questions {
    min-width: 30%;
    max-width: 300px;
    border-left: 2px solid rgb(202, 165, 96);
    overflow-y: scroll;
    &__topic {
      padding: 5px 10px 0px 10px;
      cursor: pointer;
      color: rgb(112, 126, 207);
      &:hover {
        color: rgb(159, 169, 223);
      }
    }
    &__container {
      padding: 10px 0;
      border-bottom: 2px solid rgb(202, 165, 96);
    }
  }
}

.filter {
  &__if {
    color: rgb(33, 133, 38);
  }
}

.icon_gold {
  fill: rgb(202, 165, 96);
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    fill: rgba(202, 165, 96, 0.7);
  }
}

.icon_gray {
  fill: rgba(255, 255, 255, 0.7);
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    fill: rgba(255, 255, 255, 0.5);
  }
}
</style>
