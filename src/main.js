import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import axios from 'axios'

Vue.config.productionTip = false
// 所有组件都是可复用的vue实例 this.$axios this.msg
// 将axios挂载到了vue原型上，将来所有的实例都可以共享
// Vue.prototype.$axios = axios

// 配置axios的基准地址，效果：将来所有的请求，会自动在前面拼接上路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 使用element-ui
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
