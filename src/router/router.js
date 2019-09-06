// 不作为Main组件的子页面展示的页面单独写，如下
import Main from '@/components/main'
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
      title: '登录'
    },
    component: resolve => {
      require(['@/components/LoginForm.vue'], resolve)
    }
  },
  {
    path: '/adminLogin',
    name: 'adminLogin',
    meta: {
      title: '登录'
    },
    component: resolve => {
      require(['@/components/LoginForm.vue'], resolve)
    }
  },
  {
    path: '/404',
    name: '404',
    component: resolve => {
      require(['@/components/nofound'], resolve)
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
      require(['@/components/cashier/cashierManage/choosePayWay.vue'], resolve)
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
      require(['@/components/cashier/cashierManage/callWxPay.vue'], resolve)
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
      require(['@/components/cashier/cashierManage/paySuccess.vue'], resolve)
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
      require(['@/components/cashier/cashierManage/payError.vue'], resolve)
    }
  },
  {
    path: '/main',
    name: ' Main',
    component: Main,
    children: [
      {
        path: '/addMenu',
        name: 'addmenu',
        meta: {
          breadcrumbList: ['用户管理', '菜单管理'],
          belongTab: 'system',
          openName: 'account'
        },
        component: resolve => {
          require(['@/components/system/account/addMenu'], resolve)
        }
      },
      {
        path: '/menu',
        name: 'Menu',
        meta: {
          breadcrumbList: ['用户管理', '菜单管理'],
          belongTab: 'system',
          openName: 'account'
        },
        component: resolve => {
          require(['@/components/system/account/menu'], resolve)
        }
      },
      // ...channelProduct,
      // ...merchant,
    ]
  },

]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...loginRouter
  // otherRouter,
]
