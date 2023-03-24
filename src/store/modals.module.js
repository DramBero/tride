const state = {
  openFile: false,
  dialogueModal: "",
  questCreateModal: false,
  dialogueCreateModal: null,
  selectedFilter: {},
  primaryModal: "",
  selectedInfoId: '',
  selectedFilterIndex: '',
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
  setSelectedFilter(state, value) {
    state.selectedFilter = value
  },
  setSelectedInfoId(state, info_id) {
    state.selectedInfoId = info_id
  },
  setSelectedFilterIndex(state, index) {
    state.selectedFilterIndex = index
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
  getSelectedFilter: (s) => s.selectedFilter,
  getSelectedFilterIndex: (s) => s.selectedFilterIndex,
  getSelectedInfoId: (s) => s.selectedInfoId,
};

export default {
  state,
  getters,
  actions,
  mutations
};
