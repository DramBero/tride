import Vue from "vue";
import Vuex from "vuex";

import plugin from "./plugin.module";
import modals from "./modals.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    plugin,
    modals
  }
});
