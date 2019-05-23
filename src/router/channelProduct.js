//渠道产品路由
const channelProduct = [
  {
    path: '/channelAddEditDetail',
    name: 'channelAddEditDetail',
    meta: {
      breadcrumbList: ['产品渠道管理','渠道管理','添加渠道'],
      belongTab: 'productChannel',
      openName: 'channel'
    },
    component: resolve => {
      require(['@/components/productChannel/channel/channelAddEditDetail'], resolve)
    }
  },
  {
    path: '/channelProductAddEditDetail',
    name: 'channelProductAddEditDetail',
    meta: {
      breadcrumbList: ['产品渠道管理','渠道管理','添加渠道产品'],
      belongTab: 'productChannel',
      openName: 'channel'
    },
    component: resolve => {
      require(['@/components/productChannel/channel/channelProductAddEditDetail'], resolve)
    }
  },
  {
    path: '/payProductAdd',
    name: 'payProductAdd',
    meta: {
      breadcrumbList: ['产品渠道管理','支付产品管理','添加支付产品'],
      belongTab: 'productChannel',
      openName: 'payProduct'
    },
    component: resolve => {
      require(['@/components/productChannel/payProduct/payProductAdd'], resolve)
    }
  },
  {
    path: '/payProductChannelAdd',
    name: 'payProductChannelAdd',
    meta: {
      breadcrumbList: ['产品渠道管理','支付产品管理','添加支付产品渠道'],
      belongTab: 'productChannel',
      openName: 'payProduct'
    },
    component: resolve => {
      require(['@/components/productChannel/payProduct/payProductChannelAdd'], resolve)
    }
  },
]
export default channelProduct
