// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from 'vue-router';
import App from "./App";
import Buefy from "buefy";
import { store } from "./store/index";
import routes from './routes.js';

// for all dates
process.env.TZ = 'America/New_York';
Vue.config.productionTip = process.env.NODE_ENV === 'production'

//Vue.use(Buefy);
Vue.component(Buefy.Autocomplete.name, Buefy.Autocomplete)
Vue.component(Buefy.Datepicker.name, Buefy.Datepicker)
Vue.component(Buefy.Field.name, Buefy.Field)
Vue.component(Buefy.Input.name, Buefy.Input)
Vue.component(Buefy.Loading.name, Buefy.Loading)
Vue.component(Buefy.Select.name, Buefy.Select)
Vue.component(Buefy.Tooltip.name, Buefy.Tooltip)

Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes
});

// https://alligator.io/vuejs/vue-router-modify-head/
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;
  next();
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
