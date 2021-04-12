import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import libs from './libs'
import * as filters from './filters'
import echarts from 'echarts'
import emply from './components/Emply'
import "swiper/dist/css/swiper.min.css"
import '@/mixins/wx-share'
Vue.prototype.$echarts = echarts 
Vue.use(libs, { router, store })
Vue.config.productionTip = false
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$maxNumber = 2147483647
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$eventName = require('@/const/bus')
Vue.component('emply', emply)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
