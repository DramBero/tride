<template>
  <div class="dialogue">
    <div class="dialogue-answers">
      <div class="dialogue-answers__header" v-if="currentTopic">
        <div class="dialogue-answers__add" v-if="editMode" @click="addEntry">
          Add entry
        </div>
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
            <!--             <icon
              name="save"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false"
            ></icon> -->
            <icon
              name="ban"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false; editedEntry = ''"
            ></icon>
            <!--             <icon
              name="trash"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="editMode = false"
            ></icon> -->
          </div>
        </div>
      </div>
      <div>
        <transition-group
          name="fadeHeight"
          class="dialogue-answers__frame"
          mode="out-in"
          :style="{ width: '100%' }"
        >
        <form
          v-for="(answer, index) in currentAnswers"
          @submit.prevent="editDialogue"
          :key="index"
          class="dialogue-answers-answer-wrapper"
        >
          <div
            :draggable="editMode"
            class="dialogue-answers-answer"
            :class="{ 'dialogue-answers-answer_edit': editMode }"
          >
            <div class="dialogue-answers-answer__ids" v-if="false">
              <div class="prev-id">{{ answer.prev_id || "-" }} (before)</div>
              <div class="curr-id">id: {{ answer.info_id }}</div>
            </div>
            <div
              class="dialogue-answers-answer-filters"
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
              v-if="editedEntry !== answer.info_id"
              class="dialogue-answers-answer__text"
              v-html="getHyperlinkedAnswer(answer.text)"
              @click="handleAnswerClick($event)"
            ></div>

            <textarea
              v-else
              v-text="answer.text"
              name="entryText"
              class="dialogue-entry-textarea"
            ></textarea>

            <dialogue-entry-results :code="getLanguage(answer.result, 'Lua')" language="Lua" />
            <dialogue-entry-results :code="getLanguage(answer.result, 'MWScript')" language="MWScript" />
            <div class="dialogue-answers-answer__ids" v-if="false">
              <div class="prev-id">{{ answer.info_id }} (id)</div>
              <div class="curr-id">next id: {{ answer.next_id || "-" }}</div>
            </div>
          </div>
          <icon
            v-if="editMode && editedEntry !== answer.info_id"
            name="pen"
            color="#E1FF00"
            class="icon_gold"
            scale="1"
            @click="editedEntry = answer.info_id"
          ></icon>
          <div
            class="entry-edit-controls"
            v-if="editMode && editedEntry == answer.info_id"
          >
          <button type="submit">
            <icon
              name="save"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
            ></icon>
          </button>
            <icon
              name="ban"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click.prevent="editedEntry = ''"
            ></icon>
            <icon
              name="trash"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click.prevent="deleteEntry(answer.info_id)"
            ></icon>
          </div>
        </form>
      </transition-group>
      </div>
      <div class="dialogue-answers__error" v-if="getOrderedEntries.error_text">
        {{ getOrderedEntries.error_text }}
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
import DialogueEntryResults from '../dialogue/DialogueEntryResults.vue';

export default {
  components: {
    Icon,
    DialogueEntryResults
  },
  props: {
    speaker: String
  },

  data() {
    return {
      //currentAnswers: [],
      currentTopic: "",
      editMode: false,
      showDependencies: false,
      editedEntry: "",
      topicType: "",
    };
  },

  mounted() {
    this.editMode = false;
  },

  computed: {
    getTopics() {
      let topics = [...new Set(this.getSpeakerData("Topic"))];
      if (!this.showDependencies) {
        topics = topics.filter((val) => !val.TMP_dep);
      }
      return [...new Set(topics.map((val) => val.TMP_topic))];
    },
    getGreetings() {
      let topics = [...new Set(this.getSpeakerData("Greeting"))];
      if (!this.showDependencies) {
        topics = topics.filter((val) => !val.TMP_dep);
      }
      return [...new Set(topics.map((val) => val.TMP_topic))];
    },
    getPersuasion() {
      let topics = [...new Set(this.getSpeakerData("Persuasion"))];
      if (!this.showDependencies) {
        topics = topics.filter((val) => !val.TMP_dep);
      }
      return [...new Set(topics.map((val) => val.TMP_topic))];
    },
    getOrderedEntries() {
      return this.$store.getters["getOrderedEntriesByTopic"]([
        this.currentTopic,
        "Topic"
      ]);
    },
    currentAnswers() {
      if (this.showDependencies) {
        return this.getSpeakerData(this.topicType).filter(
          (val) => val.TMP_topic == this.currentTopic
        );
      } else {
        return this.getSpeakerData(this.topicType).filter(
          (val) => val.TMP_topic == this.currentTopic && !val.TMP_dep
        );
      }
    },
  },

  methods: {
    addEntry() {
      if (!this.currentTopic) return
      let location = this.$store.getters['getBestOrderLocationForNpc']([this.speaker, this.currentTopic, this.topicType])
      this.$store.commit('addDialogue', [this.speaker, this.currentTopic, this.topicType, location[0], location[1], "New entry"])
    },
    editDialogue() {
      this.$store.commit('editDialogueEntry', [this.editedEntry, event.target.elements.entryText.value])
      this.editedEntry = ''
    },
    setCurrentAnswers(topic, topicType) {
      this.topicType = topicType
      this.currentTopic = topic;
    },
    deleteEntry(info_id) {
      this.$store.commit('deleteDialogueEntry', info_id)
    },
    getSpeakerData(topicType) {
      return this.$store.getters["getDialogueBySpeaker"]([
        this.speaker,
        topicType
      ]);
    },
    getLanguage(code, language) {
      if (!code) return ''
      if (language === "Lua") {
        return code
        .split("\r\n")
          .filter((val) => val.includes(";lua "))
          .map((val) => val.replace(";lua ", ""))
          .join("\r\n");
      } else if (language === "MWScript") {
        return code
          .split("\r\n")
          .filter((val) => !val.includes(";lua "))
          .join("\r\n");
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
    },
    handleFilter(filter) {
      if (filter.filter_function === "JournalType") {
        this.$store.commit("setJournalHighlight", filter);
      } else {
        this.$store.commit("setJournalHighlight", {});
      }
    },
    handleAnswerClick(e) {
      //if (this.editMode) return;
      if (
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
    padding: 0 5px 5px 5px;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    //overflow-y: scroll;
    &__error {
      background: rgba(110, 32, 32, 0.8);
    }
    &__add {
      position: absolute;
      cursor: pointer;
      left: 5px;
      transition: color .15s ease-in;
      &:hover {
        color: rgba(233, 214, 180, 1);
      }
    }
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
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 5px;
      scroll-behavior: smooth;
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
      flex-grow: 1;
      max-width: 100%;
      &-wrapper {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      &_edit {
        border: 1px dotted rgb(202, 165, 96);
        border-radius: 8px;
        padding: 10px;
        background: rgba(202, 165, 96, 0.02);
        transition: all 0.15s ease-in-out;
        cursor: grab;
        &:hover {
          background: rgba(202, 165, 96, 0.08);
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
    }
  }
  &-entry-textarea {
    width: 100%;
    font-family: "Pelagiad";
    background: rgba(202, 165, 96, 0.1);
    min-height: 200px;
    padding: 10px;
    color: rgb(202, 165, 96);
    font-size: 20px;
    border: none;
    border-radius: 8px 8px 8px 8px;
    resize: none;
    &:focus {
      outline: none !important;
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

.entry-edit-controls {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}

.icon_gold {
  fill: rgb(202, 165, 96);
  margin-left: 10px;
  min-width: 20px;
  transition: fill .2s ease-in;
  cursor: pointer;
  &:hover {
    fill: rgba(233, 214, 180, 1);
  }
}

.icon_gray {
  fill: rgba(255, 255, 255, 0.7);
  margin-left: 10px;
  transition: fill .2s ease-in;
  cursor: pointer;
  &:hover {
    fill: rgba(255, 255, 255, 0.5);
  }
}

.script-language {
  background: rgba(170, 169, 98, 0.5);
  width: 100%;
  display: block;
  color: rgb(237, 238, 167);
  padding: 0 10px;
  margin-bottom: 5px;
  font-weight: 700;
  &_lua {
    color: rgb(167, 236, 238);
    background: rgba(98, 150, 170, 0.5);
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
