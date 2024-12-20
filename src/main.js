import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import Icon from "vue-awesome/components/Icon";

import VueDraggableResizable from 'vue-draggable-resizable'

import 'vue-draggable-resizable/dist/VueDraggableResizable.css'


//import 'highlight.js/styles/default.css';

Vue.config.productionTip = false;
Vue.component("v-icon", Icon);
Vue.component('vue-draggable-resizable', VueDraggableResizable)

// Ensure we checked auth before each page load.


new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
