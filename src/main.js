import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

// Ensure we checked auth before each page load.

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
