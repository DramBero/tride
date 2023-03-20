<template>
  <div class="frame-upload">
    <h2 class="modal__title">Create a new journal quest</h2>
    <div class="modal-tip">Tip: to create a new journal line inside the same quest - just set the name same as the previous line and change the ID.</div>
    <form class="add-quest-form" @submit.prevent="createQuest()">
      <label class="modal-field">
          <span class="error" v-if="nameError" :key="index">{{
            nameError
          }}</span>
        <input
          class="modal-field__input"
          name="quest-name"
          :placeholder="'Quest name'"
          v-model="inputName"
        />
      </label>
      <label class="modal-field">
          <span class="error" v-if="idError" :key="index">{{
            idError
          }}</span>
        <input
          class="modal-field__input"
          name="quest-id"
          :placeholder="'Quest ID'"
          required
          v-model="inputId"
        />
      </label>
      <button type="submit" class="modal-button">Create</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameError: '',
      idError: '',
      inputName: '',
      inputId: '',
    }
  },
  methods: {
    createQuest() {
      this.$store.commit('addJournalQuest', [this.inputId, this.inputName])
      this.$store.commit("setPrimaryModal", "");
    }
  },
  computed: {}
};
</script>

<style lang="scss">

.modal-tip {
  margin-bottom: 20px;
}
.frame-upload {
  padding: 10px;
  margin: 2px;
  height: 100%;
  overflow-y: scroll;
  &-deps {
    font-size: 16px;
    margin-top: 10px;
    &__element {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px;
    }
  }
}

.add-quest-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
}
</style>
