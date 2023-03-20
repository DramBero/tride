const state = {
  openFile: false,
  dialogueModal: "",
  questCreateModal: false,
  dialogueCreateModal: null,
  primaryModal: "",
};

const mutations = {
  setPrimaryModal(state, value) {
    state.primaryModal = value
  },
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
  setDialogueCreateModal(state, value) {
    state.dialogueCreateModal = value
  },
  hideQuestCreateModal(state) {
    state.questCreateModal = false
  },
  hideDialogueCreateModal(state) {
    state.dialogueCreateModal = false
  },
};

const actions = {};

const getters = {
  getOpenFile: (s) => s.openFile,
  getDialogueModal: (s) => s.dialogueModal,
  getQuestCreateModal: (s) => s.questCreateModal,
  getDialogueCreateModal: (s) => s.dialogueCreateModal,
  getPrimaryModal: (s) => s.primaryModal,
};

export default {
  state,
  getters,
  actions,
  mutations
};
