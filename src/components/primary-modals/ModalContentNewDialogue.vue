<template>
  <div>
    
  <div class="frame-upload">
    <h2 class="modal__title">Create a new dialogue</h2>
    <form class="add-dialogue-form" @submit.prevent="">
      <div v-if="!speakerName">
        <div class="add-dialogue-label">Choose an NPC:</div>
        <label class="modal-field">
          <span class="error" v-if="nameError" :key="index">{{
            nameError
          }}</span>
          <input
            class="modal-field__input"
            name="speaker-name"
            autocomplete="off"
            :placeholder="'Type NPC name or ID'"
            v-model="inputName"
          />
        </label>
        <div class="found-names">
          <div
            class="found-names-name"
            :class="{'found-names-name_active': !npc.TMP_dep}"
            v-for="npc in getNpcs"
            :key="npc.id"
            @click="
              speakerId = npc.id;
              speakerName = npc.name;
            "
          >
            <div class="found-names-name__title">{{ npc.name }}</div>
            <div class="found-names-name__id">{{ npc.id }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="add-dialogue-label">
          {{ "Add topic to: " }}
          <span class="speaker-name">{{ speakerName }}.</span>
          <!-- <span class="speaker-id">{{ ' (id: ' + speakerId + ')' }}</span> -->
          <a
            class="speaker-change"
            @click="
              speakerId = '';
              speakerName = '';
            "
            >{{ " Change?" }}</a
          >
        </div>
        <div class="topic-create-controls">
          <label class="modal-field">
            <input
              class="modal-field__input"
              name="dialogue-topic"
              :placeholder="'Type the topic'"
              autocomplete="off"
              required
              v-model="inputTopic"
            />
          </label>
          <button type="submit" class="modal-button" :disabled="!inputTopic" @click="createTopic()">Create</button>
        </div>
        <div class="found-names">
          <div
            class="found-names-name"
            :class="{'found-names-name_active': !topic.TMP_dep}"
            v-for="topic in getTopics"
            :key="topic.id"
            @click="inputTopic = topic.id"
          >
            {{ topic.id }}
            <!-- <div class="found-names-name__id">{{ npc.id }}</div> -->
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      nameError: "",
      idError: "",
      inputName: "",
      inputTopic: "",
      speakerName: "",
      speakerId: "",
      dialogueType: "Topic",
    };
  },
  watch: {
    inputName() {
      this.debounce(function () {
        this.getNpcs;
      }, 1000);
    },
    inputTopic() {
      this.debounce(function () {
        this.getTopics;
      }, 1000);
    }
  },
  methods: {
    debounce(fn, delay) {
      var timeoutID = null;
      return function () {
        clearTimeout(timeoutID);
        var args = arguments;
        var that = this;
        timeoutID = setTimeout(function () {
          fn.apply(that, args);
        }, delay);
      };
    },
    createTopic() {
      if (!this.inputTopic) return
      else {
        let location = this.$store.getters['getBestOrderLocationForNpc']([this.speakerId, this.inputTopic, this.dialogueType])
        this.$store.commit('addDialogue', [this.speakerId, this.inputTopic, this.dialogueType, location[0], location[1], "New entry"])
        this.$store.commit("setPrimaryModal", "");
        this.$store.commit("setDialogueModal", this.speakerId);
      }
    }
  },
  computed: {
    getNpcs() {
      if (!this.inputName) return [];
      else return this.$store.getters["searchNpcs"](this.inputName);
    },
    getTopics() {
      if (!this.inputTopic) return [];
      else return this.$store.getters["searchTopics"](this.inputTopic);
    }
  }
};
</script>

<style lang="scss">
.modal__title {
  color: rgba(0, 0, 0, 0.65);
  padding: 10px;
  font-weight: 500;
  margin-bottom: 20px;
}

.frame-upload {
  padding: 10px;
  margin: 2px;
  height: 100%;
  overflow-y: scroll;
}

.topic-create-controls {
  display: flex;
  gap: 10px;
}

.add-dialogue-form {
  display: flex;
  flex-direction: column;
  //align-items: center;
  width: 100%;
  gap: 10px;
}

.speaker-name {
  color: rgb(189, 185, 185);
}

.speaker-change {
  cursor: pointer;
  color: rgb(112, 126, 207);
  &:hover {
    color: rgb(159, 169, 223);
  }
}

.add-dialogue-label {
  text-align: center;
  width: 100%;
  padding: 5px;
}

.found-names {
  display: flex;
  height: 30vh;
  margin-top: 8px;
  margin-bottom: 8px;
  padding-right: 5px;
  max-height: 30vh;
  overflow-y: scroll;
  flex-direction: column;
  &-name {
    display: flex;
    cursor: pointer;
    padding: 10px 15px;
    min-height: 50px;
    align-items: center;
    border-top: 1px solid rgba(202, 165, 96, 0.5);
    transition: all .1s ease-in;
    &:last-child {
      border-bottom: 1px solid rgba(202, 165, 96, 0.5);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.16);
    }
    &__title {
      margin-right: 20px;
      width: 40%;
    }
    &__id {
      font-size: 17px;
    }
    &_active {
      background: rgba(145, 215, 145, 0.2);
      &:hover {
        background: rgba(145, 215, 145, 0.3);
      }
    }
  }
}
</style>
