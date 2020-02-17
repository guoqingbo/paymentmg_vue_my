
// 收银台
import cashier from './cashier'
// 收款账号
import payAccount from './payAccount'
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
  ...payAccount,
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
