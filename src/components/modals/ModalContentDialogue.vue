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
            <icon
              name="ban"
              color="#E1FF00"
              class="icon_gold"
              scale="1"
              @click="
                editMode = false;
                editedEntry = '';
              "
            ></icon>
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
        <div
          v-for="answer in currentAnswers"
          :key="answer.info_id"
          :class="{'highlight-even': !editMode}"
        >
          <div class="dialogue-answers-answer__above" v-if="!editMode">
            
          </div>
          <div class="dialogue-answers-answer__above-add" @click="addEntry([answer.prev_id, answer.info_id])" v-if="editMode">+</div>
          <form
            @submit.prevent="editDialogue"
            class="dialogue-answers-answer-wrapper"
            
          >
            <div
              class="dialogue-answers-answer"
              :class="{
                'dialogue-answers-answer_modified':
                  answer.old_values && answer.old_values.length,
                'dialogue-answers-answer_edit': editMode
              }"
              
            >
              <div
                class="dialogue-answers-answer-modified"
                v-if="answer.old_values && answer.old_values.length"
              >
                * Modified in {{ answer.old_values.slice(-1)[0].TMP_dep }}
                <span
                  class="dialogue-answers-answer-modified_dirty"
                  v-if="
                    checkDirtied(answer.old_values.slice(-1)[0], answer)
                  "
                >
                  (possibly dirtied by CS)
            </span>
              </div>
              <div class="dialogue-answers-answer__ids" v-if="false">
                <div class="prev-id">{{ answer.prev_id || "-" }} (before)</div>
                <div class="curr-id">id: {{ answer.info_id }}</div>
              </div>

              <DialogueEntryFilters
                :answer="answer"
                :speaker="speaker"
                :editMode="editMode"
              />

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

              <DialogueEntryResults
                :editMode="editMode"
                :code="getLanguage(answer.result, 'Lua (MWSE)')"
                language="Lua (MWSE)"
              />
              <DialogueEntryResults
                :editMode="editMode"
                :code="getLanguage(answer.result, 'MWScript')"
                language="MWScript"
              />

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

        </div>
      </transition-group>
      <div class="dialogue-answers-answer__above dialogue-answers-answer__above_no-margin" v-if="!editMode">
            
          </div>
          <div class="dialogue-answers-answer__above-add" @click="addEntry()" v-if="editMode">+</div>
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
import DialogueEntryResults from "../dialogue/DialogueEntryResults.vue";
import DialogueEntryFilters from "../dialogue/DialogueEntryFilters.vue";

export default {
  components: {
    Icon,
    DialogueEntryResults,
    DialogueEntryFilters
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
      topicType: ""
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
      let answers
      if (this.speaker !== 'Global Dialogue') {
      answers = this.getOrderedEntries
        .filter((val) => val.TMP_topic === this.currentTopic)
        .filter((topic) =>
          [
            topic["speaker_id"],
            topic["speaker_cell"],
            topic["speaker_faction"],
            topic["speaker_class"],
            topic["speaker_rank"]
          ].includes(this.speaker)
        );
      }
      else {
        answers = this.getOrderedEntries
        .filter((val) => val.TMP_topic === this.currentTopic)
        .filter((topic) =>
            !topic["speaker_id"] &&
            !topic["speaker_cell"] &&
            !topic["speaker_faction"] &&
            !topic["speaker_class"] &&
            !topic["speaker_rank"]
        );
      }
      if (this.showDependencies) {
        return answers;

        /*         return this.getSpeakerData(this.topicType).filter(
          (val) => val.TMP_topic == this.currentTopic
        ); */
      } else {
        return answers.filter((val) => !val.TMP_dep);
        /*         return this.getSpeakerData(this.topicType).filter(
          (val) => val.TMP_topic == this.currentTopic && !val.TMP_dep
        ); */
      }
    }
  },

  methods: {
    addEntry(location) {
      if (!this.currentTopic) return;
      if (!location) location = this.$store.getters["getBestOrderLocationForNpc"]([
        this.speaker,
        this.currentTopic,
        this.topicType
      ]);
      this.$store.commit("addDialogue", [
        this.speaker,
        this.currentTopic,
        this.topicType,
        location[0],
        location[1],
        "New entry"
      ]);
    },
    editDialogue() {
      this.$store.commit("editDialogueEntry", [
        this.editedEntry,
        event.target.elements.entryText.value
      ]);
      this.editedEntry = "";
    },
    setCurrentAnswers(topic, topicType) {
      this.topicType = topicType;
      this.currentTopic = topic;
    },
    deleteEntry(info_id) {
      this.$store.commit("deleteDialogueEntry", info_id);
    },
    getSpeakerData(topicType) {
      return this.$store.getters["getDialogueBySpeaker"]([
        this.speaker,
        topicType
      ]);
    },
    getLanguage(code, language) {
      if (!code) return "";
      if (language === "Lua (MWSE)") {
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
    checkDirtied(entryOne, entryTwo) {
      let entryOneNonId = Object.fromEntries(Object.entries(entryOne).filter(([key]) => !key.includes('_id') && !key.includes('TMP_') && !key.includes('old_values')));
      let entryTwoNonId = Object.fromEntries(Object.entries(entryTwo).filter(([key]) => !key.includes('_id') && !key.includes('TMP_') && !key.includes('old_values')));
      return JSON.stringify(entryOneNonId) === JSON.stringify(entryTwoNonId)
    },
    handleAnswerClick(e) {
      //if (this.editMode) return;
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
      this.setCurrentAnswers(["", ""]);
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
      transition: color 0.15s ease-in;
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
      //gap: 20px;
      max-width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 5px;
      scroll-behavior: smooth;
      /*       ::-webkit-scrollbar {
        width: 5px;
        scrollbar-width: thin;
        background: rgba(25, 56, 31, 0.02);
        border-radius: 24px;
        &-thumb {
          background-color: rgba(25, 56, 31, 0.4);
        }
      } */
    }
    &-answer {
      flex-grow: 1;
      max-width: 100%;
      &__above {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        min-height: 1px;
        font-size: 25px;
        
        transition: all .2s ease-out;

        background: rgba(202, 165, 96, 0.4);
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(134, 134, 134, 0.4) 20%,
          rgba(134, 134, 134, 0.4) 80%,
          rgba(0, 0, 0, 0) 100%
        );
        &:hover {
          .dialogue-answers-answer__above-add {
            height: fit-content;
          }
        }
        &-add {
          cursor: pointer;
          background: rgba(202, 165, 96, 0.4);
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(134, 134, 134, 0.4) 20%,
          rgba(134, 134, 134, 0.4) 80%,
          rgba(0, 0, 0, 0) 100%
        );
          color: black;
          font-size: 30px;
          width: 100%;
          display: flex;
          justify-content: center;
          transition: all .15s ease-out;
          &:hover {
            color: rgb(202, 165, 96);
          }
        }
        &_no-margin {
          margin: 0;
        }
      }
      &-modified {
        color: rgb(126, 126, 179);
        &_dirty {
          color: rgb(206, 206, 206);
        }
      }
      &-wrapper {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 20px;
      }
      &_edit {
        border-radius: 8px;
        padding: 10px;
/*         &:hover {
          background: rgba(202, 165, 96, 0.08);
        } */
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
      padding: 10px 10px 0px 10px;
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

.highlight-even {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(92, 85, 44, 0.2) 20%,
    rgba(92, 85, 44, 0.2) 80%,
    rgba(0, 0, 0, 0) 100%
  );
  &:nth-child(even) {
    background: rgb(0, 0, 0);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(92, 85, 44, 0.12) 20%,
      rgba(92, 85, 44, 0.12) 80%,
      rgba(0, 0, 0, 0) 100%
    );
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
  transition: fill 0.2s ease-in;
  cursor: pointer;
  &:hover {
    fill: rgba(233, 214, 180, 1);
  }
}

.icon_gray {
  fill: rgba(255, 255, 255, 0.7);
  margin-left: 10px;
  transition: fill 0.2s ease-in;
  cursor: pointer;
  &:hover {
    fill: rgba(255, 255, 255, 0.5);
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
