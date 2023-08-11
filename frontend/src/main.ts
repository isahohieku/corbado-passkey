// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

import "@corbado/webcomponent/pkg/auth_cui.css";
import "./styles/main.scss";

Vue.config.productionTip = false;
Vue.config.ignoredElements = ["corbado-auth"];

/* eslint-disable no-new */
new Vue({
  router,
  vuetify,
  // store,
  render: (h) => h(App),
}).$mount("#app");
