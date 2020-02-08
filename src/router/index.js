import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',
    redirect: '/index' },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  { path: '/index',
    name: 'index',
    component: Index }
]

const router = new VueRouter({
  routes
})

// 所有路由在被访问时，都会先经过全局前置守卫，只有前置守卫放行了，才会真正显示匹配的路由
// to 到哪去
// from 从哪来
// next 是否放行 next()放行 next('/login')拦截到登录
// 如果准备去登录, 不需要拦截
// 如果已经登录过了, 有token, 不需要拦截
// 如果不是去登陆, 且没有 token, 拦截到登录页
router.beforeEach((to, from, next) => {
  console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router

// 本接口会将token认证信息返回，请于请求携带进行认证
// 前段：
// 1.将token存储到本地
// 2.请求携带
