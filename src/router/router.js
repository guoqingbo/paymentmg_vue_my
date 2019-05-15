// 不作为Main组件的子页面展示的页面单独写，如下
import Main from '@/components/main'
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

      {
        path: '/merchantAdd',
        name: 'merchantAdd',
        meta: {
          breadcrumbList: ['商户管理','商户管理','添加商户'],
          belongTab: 'merchant',
          openName: 'merchantAdd'
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
          openName: 'merchantChannelAdd'
        },
        component: resolve => {
          require(['@/components/merchant/merchant/merchantChannelAdd'], resolve)
        }
      },

      {
        path: '/channelAdd',
        name: 'channelAdd',
        meta: {
          breadcrumbList: ['产品渠道管理','渠道管理','添加渠道'],
          belongTab: 'productChannel',
          openName: 'channelAdd'
        },
        component: resolve => {
          require(['@/components/productChannel/channel/channelAdd'], resolve)
        }
      },
      {
        path: '/channelProductAdd',
        name: 'channelProductAdd',
        meta: {
          breadcrumbList: ['产品渠道管理','渠道管理','添加渠道产品'],
          belongTab: 'productChannel',
          openName: 'channelProductAdd'
        },
        component: resolve => {
          require(['@/components/productChannel/channel/channelProductAdd'], resolve)
        }
      },
    ]
  },

]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...loginRouter
  // otherRouter,
]
