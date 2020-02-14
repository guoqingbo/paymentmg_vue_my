// 不作为Main组件的子页面展示的页面单独写，如下
// import Main from '@/views/main'
// import channelProduct from "./channelProduct"
// import merchant from "./merchant"
import cashier from './cashier'
let routers = [
  {
    path: '/',
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/LoginForm.vue'], resolve)
    }
  },
  {
    path: '/main',
    name: ' Main',
    component: resolve => {
      require(['@/views/main.vue'], resolve)
    },
    children: [
    ]
  },
  ...cashier,
  {
    path: '/404',
    name: '404',
    meta: {
      title: '页面丢失',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/nofound'], resolve)
    }
  },
  // {
  //   path: "*", // 此处需特别注意置于最底部
  //   redirect: "/404"
  // }
]
// 所有上面定义的路由都要写在下面的routers里
export default routers
