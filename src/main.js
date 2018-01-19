// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from 'vue-router';
import App from "./App";
import Buefy from "buefy";
import { store } from "./store/index";
import routes from './routes.js';

Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(Buefy);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
