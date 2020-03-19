// 我们不希望这边从node_modules中导入了, 而是希望用到的是全局的 Vue  Vue-router在vue.config.js文件中配置排除项
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 定义全局的过滤器
Vue.filter('dateFilter', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

Vue.config.productionTip = false
// 所有组件都是可复用的vue实例 this.$axios this.msg
// 将axios挂载到了vue原型上，将来所有的实例都可以共享
Vue.prototype.$axios = axios

// 配置axios的基准地址，效果：将来所有的请求，会自动在前面拼接上路径
axios.defaults.baseURL = '/aaa'

// 配置请求拦截器：将每次的请求，进行拦截，可以对每次请求进行处理
axios.interceptors.request.use(function (config) {
  // console.log(config)
  // 在请求拦截器这边, 统一的添加token
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
// 只要是vue的插件, 如果是基于模块化的开发模式, 必须use一下, 才能使用
// 只要插件被use了, 会调用插件ElementUI提供的install方法, 在install方法内部会进行全局组件的注册
// install: function(Vue) {
//   Vue.component('el-button', ...)
//   Vue.component('el-form', ...)
//   Vue.component('el-form-item', ...)
// }
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
