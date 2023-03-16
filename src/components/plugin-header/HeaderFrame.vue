<template>
  <div class="journal-frame">
    <div class="journal-frame__header" v-if="true">
      <div class="frame-title">Header</div>
    </div>
    <div class="header-content">
      <span class="modal-field__name"> Plugin name: </span>
      <div class="header-content__row">
        <label class="modal-field modal-field_dark">
          <input
            class="modal-field__input"
            name="speaker-name"
            autocomplete="off"
            :placeholder="'Type plugin name'"
            v-model="name"
          />
        </label>
        <button
          class="modal-button modal-button_dark"
          :class="{
            'modal-button_dark-active': file_type.toUpperCase() === 'ESP'
          }"
          @click="file_type = 'Esp'"
        >
          ESP
        </button>
        <button
          class="modal-button modal-button_dark"
          :class="{
            'modal-button_dark-active': file_type.toUpperCase() === 'ESM'
          }"
          @click="file_type = 'Esm'"
        >
          ESM
        </button>
      </div>

      <div class="header-content__row">
        <label class="modal-field modal-field_dark">
          <span class="modal-field__name"> Version: </span>
          <input
            class="modal-field__input"
            name="speaker-name"
            autocomplete="off"
            :placeholder="'Type version'"
            v-model="version"
          />
        </label>
        <label class="modal-field modal-field_dark">
          <span class="modal-field__name"> Author: </span>
          <input
            class="modal-field__input"
            name="speaker-name"
            autocomplete="off"
            :placeholder="'Type author'"
            v-model="author"
          />
        </label>
      </div>
      <label class="modal-field modal-field_dark">
        <span class="modal-field__name"> Author: </span>
        <textarea
          class="modal-field__input modal-field__input_textarea"
          name="speaker-name"
          autocomplete="off"
          :placeholder="'Type description'"
          v-model="description"
        ></textarea>
      </label>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
export default {
  data() {
    return {
      name: "",
      version: "",
      file_type: "",
      author: "",
      description: "",
      dependencies: []
    };
  },
  watch: {
    getActiveHeader(newValue) {
      this.version = newValue.version;
      this.author = newValue.author;
      this.file_type = newValue.file_type;
      this.description = newValue.description;
    },
    getActivePluginTitle(newValue) {
      this.name = newValue;
    }
  },
  computed: {
    getActiveHeader() {
      return this.$store.getters["getActiveHeader"];
    },
    getActivePluginTitle() {
      return this.$store.getters["getActivePluginTitle"];
    }
  },
  components: { Icon },
  methods: {
    addQuest() {
      this.$store.commit("setQuestCreateModal", true);
    }
  }
};
</script>

<style lang="scss">
.header-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__row {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }
}
.frame-title {
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  color: rgb(202, 165, 96);
  background: rgb(48, 48, 48);
}
.journal-frame {
  background-color: #986;
  //box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
  z-index: 2;
  //padding: 10px;
  min-width: 500px;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  font-family: "Pelagiad";
  position: relative;
  &__header {
    background-color: rgb(71, 71, 71);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
    z-index: 2;
  }
  &__controls {
    font-size: 22px;
    padding: 10px;

    //display: flex;
    width: 100%;
    //top: 10px;
  }
}
.quests {
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
  padding: 10px 15px 10px 10px;
  gap: 5px;
  flex-direction: column;
  align-items: center;
}
.add-quest {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.65);
  color: rgb(202, 165, 96);
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 4px;
  transition: all 0.1s ease-in;
  &:hover {
    color: white;
    .add-quest__button {
      fill: white;
    }
  }
  &__button {
    transition: all 0.1s ease-in;
    fill: rgb(202, 165, 96);
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
