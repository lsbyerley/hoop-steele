import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
//import store from './store'
//import router from './router'

const isProd = process.env.NODE_ENV === 'prod'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-114371448-1',
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

new Vue({
  el: '#app',
	//store,
	//router,
  render: h => h(App)
})
