<template>
  <div class="classic-view-frame" v-if="getActive">
    <button class="classic-view-frame__close" @click="closeClassicView">
      <icon
        name="times"
        class="classic-view-frame__close-icon"
        scale="1.5"
      ></icon>
    </button>
    <div class="classic-view-frame__wrapper">
      <div class="classic-view-frame__header"></div>
      <div
        class="classic-view-frame__containter container"
        :class="{ container_half: currentId }"
      >
        <div class="container-topics">
          <div class="container-topics-header">
            <div
              class="container-topics-header__item"
              :class="{
                'container-topics-header__item_current': item === topicType
              }"
              @click="topicType = item"
              v-for="item in ['Topic', 'Greeting', 'Persuasion', 'Journal']"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
          <div
            class="container-topics__topic"
            :class="{
              'container-topics__topic_dep':
                getTmpDep(topic) && !getNoTmpDep(topic),
              'container-topics__topic_mod':
                getTmpDep(topic) && getNoTmpDep(topic),
              'container-topics__topic_current': getCurrentTopic === topic[0].id
            }"
            v-for="topic in getAllTopics"
            :key="topic[0].id"
            @click="setCurrentTopic(topic[0].id)"
          >
            {{ topic[0].id }}
          </div>
        </div>
        <div class="container-entries">
          <table border="0" cellspacing="0" cellpadding="0" v-if="rows.length">
            <tr class="container-entries__header">
              <th></th>
              <th>Text</th>
              <th>
                {{
                  getOrderedEntries[0] &&
                  getOrderedEntries[0].TMP_type === "Journal"
                    ? "Index"
                    : "Disp"
                }}
              </th>
              <th
                v-if="
                  getOrderedEntries[0] &&
                  getOrderedEntries[0].TMP_type !== 'Journal'
                "
              >
                Speaker ID
              </th>
              <th
                v-if="
                  getOrderedEntries[0] &&
                  getOrderedEntries[0].TMP_type !== 'Journal'
                "
              >
                Speaker Faction
              </th>
              <th
                v-if="
                  getOrderedEntries[0] &&
                  getOrderedEntries[0].TMP_type !== 'Journal'
                "
              >
                Speaker Cell
              </th>
              <th
                v-for="v in getOrderedEntries[0] &&
                getOrderedEntries[0].TMP_type !== 'Journal'
                  ? 6
                  : 0"
                :key="v"
              >
                Filter {{ v }}
              </th>
            </tr>
            <transition-group
              is="draggable"
              tag="tbody"
              :list="rows"
              :name="!drag ? 'flip-list' : null"
              :handle="'.container-entries__grip'"
              @start="drag = true"
              @end="drag = false"
              @change="handleReorder"
              :scroll-sensitivity="500"
              animation="200"
            >
              <tr
                class="container-entries__entry"
                :class="{
                  'container-entries__entry_new': !getOrderedEntries.find(
                    (val) => val.info_id == entry
                  ).TMP_dep,
                  'container-entries__entry_mod':
                    !getOrderedEntries.find((val) => val.info_id == entry)
                      .TMP_dep &&
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .old_values &&
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .old_values.length,
                  'container-entries__entry_del':
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .deleted !== undefined,
                  'container-entries__entry_dirty':
                    !getOrderedEntries.find((val) => val.info_id == entry)
                      .TMP_dep &&
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .old_values &&
                    checkDirtied(
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .old_values.at(-1),
                      getOrderedEntries.find((val) => val.info_id == entry)
                    )
                }"
                v-for="entry in rows"
                @click="
                    editEntry(entry)
                "
                :key="entry"
              >
                <td class="container-entries__grip" @click.stop>
                  <icon
                    name="grip-horizontal"
                    class="classic-view-frame__close-icon"
                    scale="1"
                  ></icon>
                </td>
                <td class="container-entries__text">
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .text &&
                    getOrderedEntries.find((val) => val.info_id == entry).text
                      .length > 150
                      ? getOrderedEntries
                          .find((val) => val.info_id == entry)
                          .text.slice(0, 150) + "..."
                      : getOrderedEntries.find((val) => val.info_id == entry)
                          .text
                  }}
                </td>
                <td>
                  {{
                    (getOrderedEntries.find((val) => val.info_id == entry)
                      .data &&
                      getOrderedEntries.find((val) => val.info_id == entry).data
                        .disposition) ||
                    ""
                  }}
                </td>
                <td
                  class="container-entries__speaker"
                  v-if="
                    getOrderedEntries[0] &&
                    getOrderedEntries[0].TMP_type !== 'Journal'
                  "
                >
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_id
                  }}
                </td>
                <td
                  class="container-entries__speaker"
                  v-if="
                    getOrderedEntries[0] &&
                    getOrderedEntries[0].TMP_type !== 'Journal'
                  "
                >
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_faction
                  }}
                </td>
                <td
                  class="container-entries__speaker"
                  v-if="
                    getOrderedEntries[0] &&
                    getOrderedEntries[0].TMP_type !== 'Journal'
                  "
                >
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_cell
                  }}
                </td>
                <td
                  v-for="v in getOrderedEntries[0] &&
                  getOrderedEntries[0].TMP_type !== 'Journal'
                    ? 6
                    : 0"
                  :key="v"
                >
                  <div
                    v-if="
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .filters.find(
                          (val) => val.slot === 'Slot' + (v - 1).toString()
                        )
                    "
                    class="classic-filter"
                  >
                    <span class="classic-filter__type">{{
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .filters.find(
                          (val) => val.slot === "Slot" + (v - 1).toString()
                        ).filter_function ||
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .filters.find(
                          (val) => val.slot === "Slot" + (v - 1).toString()
                        ).filter_type
                    }}</span>
                    <span class="classic-filter__id">{{
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .filters.find(
                          (val) => val.slot === "Slot" + (v - 1).toString()
                        ).id
                    }}</span>
                    <span class="classic-filter__compare">{{
                      getOrderedEntries
                        .find((val) => val.info_id == entry)
                        .filters.find(
                          (val) => val.slot === "Slot" + (v - 1).toString()
                        ).filter_comparison
                    }}</span>
                    <span class="classic-filter__value">{{
                      Object.values(
                        getOrderedEntries
                          .find((val) => val.info_id == entry)
                          .filters.find(
                            (val) => val.slot === "Slot" + (v - 1).toString()
                          ).value
                      )[0]
                    }}</span>
                  </div>
                </td>
              </tr>
            </transition-group>
          </table>
        </div>
      </div>
      <div class="classic-view-frame__edit" v-if="currentId">
        <button class="edit__close" @click="(currentId = ''), (editCode = '')">
          <icon name="times" class="edit__close-icon" scale="1.5"></icon>
        </button>
        <div class="edit__text">
          {{
            getOrderedEntries.find((val) => val.info_id == currentId) &&
            getOrderedEntries.find((val) => val.info_id == currentId).text
          }}
        </div>
        <div class="edit__filters"></div>
        <div class="edit__result">
          <CodeEditor 
            class="edit__result-code"
            v-model="editCode"
            :hide_header="true"
            :height="'100%'"
            :width="'100%'"
            :border_radius="'0'"
          >
          </CodeEditor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import draggable from "vuedraggable";
import CodeEditor from "simple-code-editor";

import "vue-awesome/icons";

export default {
  data() {
    return {
      rows: [],
      drag: false,
      currentId: "",
      editCode: "",
      topicType: "Topic",
      currentFilters: [],
      currentDisp: "",
      currentSpeakerData: {
        speaker_id: "",
        speaker_cell: "",
        speaker_faction: "",
        speaker_class: "",
        speaker_race: "",
      },
    };
  },
  components: {
    Icon,
    draggable,
    CodeEditor
  },
  mounted() {
    this.rows = this.getOrderedEntries.map((val) => val.info_id);
  },
  watch: {
    getOrderedEntries(newValue) {
      this.rows = newValue.map((val) => val.info_id);
    }
    /*     rowsClone: {
      handler: function (newValue, oldValue) {
        if (newValue.length === oldValue.length) {
          var idx = 0;
          var len = oldValue.length;
          while (
            (oldValue[idx] === newValue[idx] ||
              oldValue[idx] === newValue[idx + 1]) &&
            idx < len
          ) {
            idx++;
          }
          if (idx < newValue.length) {
            console.log("")
            console.log("OLD: ", oldValue)
            console.log("NEW: ", newValue)
            console.log('====================================================================================')
            console.log(`Entry moved. ID: ${oldValue[idx]}, Text: ${this.getOrderedEntries.find(val => val.info_id === oldValue[idx]).text}`);
            console.log(`Old prev_id: ${this.getOrderedEntries.find(val => val.info_id === oldValue[idx]).prev_id}, Old next_id: ${this.getOrderedEntries.find(val => val.info_id === oldValue[idx]).next_id}`)
            console.log(`New index: ${newValue.findIndex(id => id === oldValue[idx])},`)
            console.log('====================================================================================')
            console.log("")
          }
        }
      }
    } */
  },
  computed: {
    getActive() {
      return this.$store.getters["getClassicView"];
    },
    getCurrentTopic() {
      return this.$store.getters["getClassicViewTopic"];
    },
    getAllTopics() {
      return this.$store.getters["getAllTopics"](this.topicType);
    },
    getOrderedEntriesUncached: {
      cache: false,
      get() {
        return this.$store.getters["getOrderedEntriesByTopic"]([
          this.getCurrentTopic,
          this.topicType
        ]);
      }
    },
    getOrderedEntries() {
      return this.$store.getters["getOrderedEntriesByTopic"]([
        this.getCurrentTopic,
        this.topicType
      ]);
    },
    getTopicFilterAmount() {
      return 6;
    }
    /*     rowsClone() {
        return JSON.parse(JSON.stringify(this.rows))
    } */
  },
  methods: {
    closeClassicView() {
      this.$store.commit("setClassicView", false);
    },
    setCurrentTopic(topic) {
      this.$store.commit("setClassicViewTopic", topic);
    },
    editEntry(entry_id) {
        this.currentId = entry_id
        let currentEntry = this.getOrderedEntries.find((val) => val.info_id === entry_id)
        this.currentSpeakerData.speaker_id = currentEntry.speaker_id || ''
        this.currentSpeakerData.speaker_cell = currentEntry.speaker_cell || ''
        this.currentSpeakerData.speaker_faction = currentEntry.speaker_faction || ''
        this.currentSpeakerData.speaker_class = currentEntry.speaker_class || ''
        this.currentSpeakerData.speaker_race = currentEntry.speaker_race || ''
        this.currentFilters = currentEntry.filters
        this.currentDisp = currentEntry.data && currentEntry.data.disposition
        this.editCode = currentEntry.result
    },
    handleReorder(event) {
      let info_id = event.moved.element;
      let old_prev_id = this.getOrderedEntries.find(
        (val) => val.info_id === event.moved.element
      ).prev_id;
      let old_next_id = this.getOrderedEntries.find(
        (val) => val.info_id === event.moved.element
      ).next_id;
      let new_prev_id = this.rows[event.moved.newIndex - 1] || "";
      let new_next_id = this.rows[event.moved.newIndex + 1] || "";
      this.$store.commit("moveDialogueEntry", [
        info_id,
        old_prev_id,
        old_next_id,
        new_prev_id,
        new_next_id
      ]);
      this.rows = this.getOrderedEntriesUncached.map((val) => val.info_id);
      //await new Promise((resolve) => setTimeout(resolve, 1000));
      //this.rows = this.getOrderedEntries.map((val) => val.info_id);
      /*         console.log("")
        console.log('====================================================================================')
        console.log(`Entry moved. ID: ${info_id}, Text: ${this.getOrderedEntries.find(val => val.info_id === info_id).text}`);
        console.log(`Old prev_id: ${old_prev_id}, Old next_id: ${old_next_id}`)
        console.log(`New prev_id: ${new_prev_id}, New next_id: ${new_next_id}`)
        console.log('====================================================================================')
        console.log("") */
    },
    getTmpDep(topic) {
      return topic.filter((val) => val.TMP_dep).length;
    },
    getNoTmpDep(topic) {
      return topic.filter((val) => !val.TMP_dep).length;
    },
    checkDirtied(entryOne, entryTwo) {
      if (!entryOne || !entryTwo) return false;
      let entryOneNonId = Object.fromEntries(
        Object.entries(entryOne).filter(
          ([key]) =>
            !key.includes("_id") &&
            !key.includes("TMP_") &&
            !key.includes("old_values")
        )
      );
      let entryTwoNonId = Object.fromEntries(
        Object.entries(entryTwo).filter(
          ([key]) =>
            !key.includes("_id") &&
            !key.includes("TMP_") &&
            !key.includes("old_values")
        )
      );
      return JSON.stringify(entryOneNonId) === JSON.stringify(entryTwoNonId);
    }
  }
};
</script>

<style lang="scss">
.classic-view-frame {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  z-index: 100;
  &__close {
    position: absolute;
    top: 15px;
    right: 20px;
    &-icon {
      fill: rgb(202, 165, 96);
      transition: fill 0.15s ease-in;
    }
    &:hover {
      .classic-view-frame__close-icon {
        fill: rgb(223, 200, 157);
      }
    }
  }
  &__wrapper {
    background: rgba(20, 20, 20, 1);
    max-width: 1480px;
    width: 90vw;
    height: 100%;
    margin: 0 auto;
  }
  &__header {
    display: sticky;
  }
  &__edit {
    height: 50%;
    max-height: 50%;
    flex-grow: 0;
    flex-shrink: 1;
    background: rgb(226, 197, 142);
    padding-right: 45px;
    border-top: 2px solid black;
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    .edit__close {
      position: absolute;
      top: 10px;
      right: 15px;
    }
    .edit__text {
      font-size: 20px;
      padding: 10px;
      border-right: 2px solid rgb(117, 87, 31);
    }
    .edit__result {
      font-family: "Consolas";
      font-size: 14px;
      height: 100%;
      border-left: 2px solid rgb(117, 87, 31);
      background: rgb(46, 46, 34);
      color: rgb(237, 238, 167);
      width: 100%;
      max-height: 100%;
      &-code {
        max-height: 100%;

      }
    }
  }
}

.container {
  display: flex;
  font-size: 20px;
  flex-grow: 1;
  height: 100%;
  transition: height 0.15s ease-in-out;
  &_half {
    height: 50%;
  }
  &-topics {
    min-width: 300px;
    max-width: 300px;
    height: 100%;
    border-right: 2px solid rgb(202, 165, 96);
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: scroll;
    &-header {
      display: flex;
      gap: 15px;
      border-bottom: 1px solid rgb(202, 165, 96);
      position: sticky;
      height: 50px;
      font-size: 15px;
      background: rgb(15, 15, 15);
      padding: 10px;
      z-index: 5;
      top: 0;
      //overflow-x: scroll;
      &__item {
        cursor: pointer;
        transition: color 0.15s ease-in-out;
        color: rgb(202, 165, 96);
        &:hover {
          color: rgb(223, 200, 157);
        }
        &_current {
          color: white;
          cursor: default;
          &:hover {
            color: white;
          }
        }
      }
    }
    &__topic {
      padding: 0 20px;
      cursor: pointer;
      transition: color 0.15s ease-in-out;
      color: rgb(89, 170, 106);
      &:hover {
        color: rgb(156, 207, 167);
      }
      &_dep {
        color: rgb(202, 165, 96);
        &:hover {
          color: rgb(223, 200, 157);
        }
      }
      &_mod {
        color: rgb(112, 126, 207);
        &:hover {
          color: rgb(159, 169, 223);
        }
      }
      &_del {
        color: rgb(207, 112, 112);
        &:hover {
          color: rgb(223, 159, 159);
        }
      }
      &_current {
        color: white;
        cursor: default;
      }
    }
  }
  &-entries {
    color: rgb(202, 165, 96);
    border-left: 2px solid black;
    overflow: scroll;
    //padding: 10px;
    flex-grow: 1;
    height: 100%;
    table {
      tr {
        td {
          border-bottom: 1px solid rgba(202, 165, 96, 0.5);
        }
      }
    }
    &__header {
      position: sticky;
      top: 0;
      z-index: 5;
      background: rgb(15, 15, 15);
      border-bottom: 1px solid rgb(202, 165, 96);
      th {
        padding: 10px;
        font-weight: 500;
        border-bottom: 1px solid rgb(202, 165, 96);
      }
    }
    &__entry {
      //display: flex;
      //flex-direction: row;
      //flex-wrap: nowrap;
      background-color: rgba(202, 165, 96, 0.05);
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease-in-out;

      padding: 10px;
      &_new {
        background-color: rgba(89, 170, 106, 0.15);
      }
      &_mod {
        background-color: rgba(112, 126, 207, 0.2);
      }
      &_del {
        background-color: rgba(226, 53, 53, 0.2);
      }
      &_dirty {
        background-color: rgba(202, 165, 96, 0.05);
        background-image: repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 12px,
          rgba(112, 126, 207, 0.2) 12px,
          rgba(112, 126, 207, 0.2) 24px
        );
      }
      td {
        padding: 10px;
        border: 1px solid rgba(202, 165, 96, 0.05);
      }
      transition: all 0.1s ease-in-out;
      &:hover {
        filter: brightness(130%);
        -webkit-filter: brightness(130%);
        -moz-filter: brightness(130%);
      }
    }
    &__text {
      min-width: 50ch;
    }
    &__grip {
      cursor: grab;
      text-align: center;
      min-width: 50px;
    }
  }
}

.classic-filter {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  align-items: center;
}

.flip-list {
  transition: transform 0.5s;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.sortable-ghost {
  opacity: 0.5;
  //background: #c8ebfb;
}
</style>