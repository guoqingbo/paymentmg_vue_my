//渠道产品路由
const merchant = [
  {
    path: '/merchantAdd',
    name: 'merchantAdd',
    meta: {
      breadcrumbList: ['商户管理','商户管理','添加商户'],
      belongTab: 'merchant',
      openName: 'merchantManage'
    },
    component: resolve => {
      require(['@/components/merchant/merchant/merchantAdd'], resolve)
    }
  },
  {
    path: '/merchantChannelAdd',
    name: 'merchantChannelAdd',
    meta: {
      breadcrumbList: ['商户管理','商户管理','添加渠道'],
      belongTab: 'merchant',
      openName: 'merchantManage'
    },
    component: resolve => {
      require(['@/components/merchant/merchant/merchantChannelAdd'], resolve)
    }
  },
]
export default merchant
