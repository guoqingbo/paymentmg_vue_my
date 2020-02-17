// 收银台
let routers = [
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
]
export default routers
