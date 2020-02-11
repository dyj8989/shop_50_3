import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false
// 所有组件都是可复用的vue实例 this.$axios this.msg
// 将axios挂载到了vue原型上，将来所有的实例都可以共享
Vue.prototype.$axios = axios

// 配置axios的基准地址，效果：将来所有的请求，会自动在前面拼接上路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 配置请求拦截器：将每次的请求，进行拦截，可以对每次请求进行处理
axios.interceptors.request.use(function (config) {
  // console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  // 在发送请求之前做一些事情
  return config
},
function (error) {
  // 做一些有请求错误的事情
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log(response)
  // 对响应数据做点什么
  response = response.data
  // 校验结果,如果响应时,发现状态码时401,说明是无效token,拦截到登录
  if (response.meta.status === 401) {
    // this.$router=router
    router.push('/login')
    response.meta.msg = '登录状态已失效,请重新登录'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 使用element-ui
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
