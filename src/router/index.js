import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Index from '../components/Index.vue'
// import Users from '../components/users/Users.vue'
// import Roles from '../components/rights/Roles.vue'
// import Rights from '../components/rights/Rights.vue'
// import Categories from '../components/prodcuts/Categories.vue'
// import Goods from '../components/prodcuts/Goods.vue'
// import GoodsAdd from '../components/prodcuts/GoodsAdd.vue'

// 希望实现按需加载,需要哪个组件,就加载哪个组件
// 异步组件
// const Login=()=>{
//   return import('../components/Login.vue')
// }
const Login = () => import(/* webpackChunkName: 'index' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')

const Users = () => import(/* webpackChunkName: 'users' */'../components/users/Users.vue')

const Roles = () => import(/* webpackChunkName: 'rights' */'../components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */'../components/rights/Rights.vue')

const Categories = () => import(/* webpackChunkName: 'products' */'../components/products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'products' */'../components/products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'products' */'../components/products/GoodsAdd.vue')

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
    component: Index,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/goods-add', name: 'goods-add', component: GoodsAdd }
    ] }
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
  // console.log(to)
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
