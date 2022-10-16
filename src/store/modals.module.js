const state = {
  openFile: false
};

const mutations = {
  toggleOpenFile(state, value) {
    state.openFile = value;
  },
  hideOpenFile(state) {
    state.openFile = false;
  }
};

const actions = {};

const getters = {
  getOpenFile: (s) => s.openFile
};

export default {
  state,
  getters,
  actions,
  mutations
};
