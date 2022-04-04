import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import axios from 'axios'
import './assets/css/global.less'
import './assets/font/iconfont.css'
import 'echarts/theme/chalk'
import 'echarts/theme/vintage'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
