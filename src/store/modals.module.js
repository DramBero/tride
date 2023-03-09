const state = {
  openFile: false,
  dialogueModal: "",
  questCreateModal: false,
};

const mutations = {
  toggleOpenFile(state, value) {
    state.openFile = value;
  },
  hideOpenFile(state) {
    state.openFile = false;
  },
  hideDialogue(state) {
    state.dialogueModal = "";
  },
  setDialogueModal(state, value) {
    state.dialogueModal = value;
  },
  setQuestCreateModal(state, value) {
    state.questCreateModal = value
  },
  hideQuestCreateModal(state) {
    state.questCreateModal = false
  }
};

const actions = {};

const getters = {
  getOpenFile: (s) => s.openFile,
  getDialogueModal: (s) => s.dialogueModal,
  getQuestCreateModal: (s) => s.questCreateModal,
};

export default {
  state,
  getters,
  actions,
  mutations
};
