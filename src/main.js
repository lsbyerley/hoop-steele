import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
//import store from './store'
//import router from './router'

const isProd = process.env.NODE_ENV === 'production'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-152719640-2',
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
