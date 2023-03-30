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
      <div class="classic-view-frame__containter container">
        <div class="container-topics">
          <div
            class="container-topics__topic"
            :class="{
              'container-topics__topic_dep':
                getTmpDep(topic) && !getNoTmpDep(topic),
              'container-topics__topic_mod':
                getTmpDep(topic) && getNoTmpDep(topic),
              'container-topics__topic_current': currentTopic === topic[0].id
            }"
            v-for="topic in getAllTopics"
            :key="topic[0].id"
            @click="currentTopic = topic[0].id"
          >
            {{ topic[0].id }}
          </div>
        </div>
        <div class="container-entries">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr class="container-entries__header">
              <th></th>
              <th>Text</th>
              <th>Speaker ID</th>
              <th>Speaker Cell</th>
              <th>Speaker Faction</th>
              <th v-for="v in 6" :key="v">Filter {{ v }}</th>
            </tr>
            <transition-group
              is="draggable"
              tag="tbody"
              :list="rows"
              :name="!drag ? 'flip-list' : null"
              @start="drag = true"
              @end="drag = false"
              animation="200"
            >
              <tr
                class="container-entries__entry"
                :class="{
                  'container-entries__entry_new': !getOrderedEntries.find(
                    (val) => val.info_id == entry
                  ).TMP_dep,
                  'container-entries__entry_mod':
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .old_values &&
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .old_values.length
                }"
                v-for="entry in rows"
                :key="entry"
              >
                <td class="container-entries__grip">
                  <icon
                    name="grip-horizontal"
                    class="classic-view-frame__close-icon"
                    scale="1"
                  ></icon>
                </td>
                <td class="container-entries__text">
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry).text
                      .length > 150
                      ? getOrderedEntries
                          .find((val) => val.info_id == entry)
                          .text.slice(0, 150) + "..."
                      : getOrderedEntries.find((val) => val.info_id == entry)
                          .text
                  }}
                </td>
                <td class="container-entries__speaker">
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_id
                  }}
                </td>
                <td class="container-entries__speaker">
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_cell
                  }}
                </td>
                <td class="container-entries__speaker">
                  {{
                    getOrderedEntries.find((val) => val.info_id == entry)
                      .speaker_faction
                  }}
                </td>
                <td v-for="v in 6" :key="v">
                  <div
                    v-if="
                      getOrderedEntries.find((val) => val.info_id == entry)
                        .filters.length >= v
                    "
                    class="classic-filter"
                  >
                    <span class="classic-filter__type">{{
                      getOrderedEntries.find((val) => val.info_id == entry)
                        .filters[v - 1].filter_function ||
                      getOrderedEntries.find((val) => val.info_id == entry)
                        .filters[v - 1].filter_type
                    }}</span>
                    <span class="classic-filter__id">{{
                      getOrderedEntries.find((val) => val.info_id == entry)
                        .filters[v - 1].id
                    }}</span>
                    <span class="classic-filter__compare">{{
                      getOrderedEntries.find((val) => val.info_id == entry)
                        .filters[v - 1].filter_comparison
                    }}</span>
                    <span class="classic-filter__value">{{
                      Object.values(
                        getOrderedEntries.find((val) => val.info_id == entry)
                          .filters[v - 1].value
                      )[0]
                    }}</span>
                  </div>
                </td>
              </tr>
            </transition-group>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import draggable from "vuedraggable";
import "vue-awesome/icons";

export default {
  data() {
    return {
      currentTopic: "",
      rows: [],
      drag: false,
    };
  },
  components: {
    Icon,
    draggable
  },
  mounted() {
    this.rows = this.getOrderedEntries.map((val) => val.info_id);
  },
  watch: {
    getOrderedEntries(newValue) {
      this.rows = newValue.map((val) => val.info_id);
    }
  },
  computed: {
    getActive() {
      return this.$store.getters["getClassicView"];
    },
    getCurrentTopic() {
      return this.$store.getters["getClassicViewTopic"];
    },
    getAllTopics() {
      return this.$store.getters["getAllTopics"];
    },
    getOrderedEntries() {
      return this.$store.getters["getOrderedEntriesByTopic"]([
        this.currentTopic,
        "Topic"
      ]);
    },
    getTopicFilterAmount() {
      return 6;
    }
  },
  methods: {
    closeClassicView() {
      this.$store.commit("setClassicView", false);
    },
    getTmpDep(topic) {
      return topic.filter((val) => val.TMP_dep).length;
    },
    getNoTmpDep(topic) {
      return topic.filter((val) => !val.TMP_dep).length;
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
}

.container {
  display: flex;
  font-size: 20px;
  //flex-grow: 1;
  height: 100%;
  &-topics {
    min-width: 300px;
    max-width: 300px;
    height: 100%;
    border-right: 2px solid rgb(202, 165, 96);
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: scroll;
    &__topic {
      cursor: pointer;
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
      &_current {
        color: white;
        cursor: default;
      }
    }
  }
  &-entries {
    color: rgb(202, 165, 96);
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

      padding: 10px;
      &_new {
        background-color: rgba(89, 170, 106, 0.15);
      }
      &_mod {
        background-color: rgba(112, 126, 207, 0.2);
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