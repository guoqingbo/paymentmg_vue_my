// 收款账号
let routers = [
  {
    path: '/payAccount/payAccountList',
    name: 'payAccountList',
    meta: {
      title: '商户收款账号',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/payAccount/payAccountList.vue'], resolve)
    }
  },
  {
    path: '/payAccount/setting',
    name: 'payAccountSetting',
    meta: {
      title: '商户收款账号-设置',
      isLogin:false,
    },
    component: resolve => {
      require(['@/views/payAccount/setting.vue'], resolve)
    }
  }
]
export default routers
