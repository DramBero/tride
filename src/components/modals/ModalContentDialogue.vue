<template>
  <div class="dialogue">
    <div class="dialogue-answers">
      <div class="dialogue-answers__header">{{ currentTopic }}</div>
      <div
        class="dialogue-answers-answer"
        v-for="(answer, index) in currentAnswers"
        :key="index"
      >
        <div class="dialogue-answers-answer-filters">
          <div
            class="dialogue-answers-answer-filters__filter"
            v-for="(filter, index) in answer.filters"
            :key="index"
          >
            <span class="filter__if">if </span>
            <span class="filter__function">{{ filter.filter_function }} </span>
            <span class="filter__id">{{ filter.id }} </span>
            <span class="filter__comparison"
              >{{ parseComparison(filter.filter_comparison) }}
            </span>
            <span class="filter__value">{{
              Object.values(filter.value)[0]
            }}</span>
          </div>
        </div>
        <div
          class="dialogue-answers-answer__text"
          v-html="getHyperlinkedAnswer(answer.text)"
          @click="handleAnswerClick($event)"
        ></div>
        <div class="dialogue-answers-answer-results" v-if="answer.result">
          <div
            class="dialogue-answers-answer-results__result"
            v-for="(text, index) in answer.result.split(';')"
            :key="index"
          >
            {{ text }}
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
export default {
  props: {
    speaker: String
  },
  data() {
    return {
      currentAnswers: [],
      currentTopic: ""
    };
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
      this.currentAnswers = this.getSpeakerData(topicType).filter(
        (val) => val.TMP_topic == topic
      );
      this.currentTopic = topic;
    },
    getSpeakerData(topicType) {
      return this.$store.getters["getDialogueBySpeakerNPC"]([
        this.speaker,
        "speaker_id",
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
    handleAnswerClick(e) {
      if (e.target.className == "dialogue-answers-answer__text_hyperlink") {
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
  &-answers {
    padding: 10px;
    flex-grow: 1;
    overflow: scroll;
    &__header {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 2px solid rgb(202, 165, 96);
      height: 30px;
    }
    &-answer {
      margin-top: 20px;
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
      &-filters {
        &__filter {
          display: inline-block;
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
    border-left: 2px solid rgb(202, 165, 96);
    overflow: scroll;
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
</style>