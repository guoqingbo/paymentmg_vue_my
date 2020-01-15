// 不作为Main组件的子页面展示的页面单独写，如下
// import Main from '@/views/main'
// import channelProduct from "./channelProduct"
// import merchant from "./merchant"
export const loginRouter = [
  {
    path: '/',
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/base',
    redirect: {
      name: 'publishPark'
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
    path: '/adminLogin',
    name: 'adminLogin',
    meta: {
      title: '登录',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/LoginForm.vue'], resolve)
    }
  },
  {
    path: '/cashier/cashierManage/choosePayWay',
    name: 'choosePayWay',
    meta: {
      title: '收银台支付方式',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/cashier/cashierManage/choosePayWay.vue'], resolve)
    }
  },
  {
    path: '/cashier/cashierManage/callWxPay',
    name: 'callWxPay',
    meta: {
      title: '微信支付',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/cashier/cashierManage/callWxPay.vue'], resolve)
    }
  },
  {
    path: '/cashier/cashierManage/payWay',
    name: 'payWay',
    meta: {
      title: '微信支付',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/cashier/cashierManage/payWay.vue'], resolve)
    }
  },
  {
    path: '/cashier/cashierManage/paySuccess',
    name: 'paySuccess',
    meta: {
      title: '支付成功',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/cashier/cashierManage/paySuccess.vue'], resolve)
    }
  },
  {
    path: '/cashier/cashierManage/payError',
    name: 'payError',
    meta: {
      title: '支付失败',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/cashier/cashierManage/payError.vue'], resolve)
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
export const routers = [
  ...loginRouter
  // otherRouter,
]
