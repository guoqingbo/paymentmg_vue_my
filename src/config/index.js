const config = {
  // 测试环境
  test:{
    env:'test',
    apiAdminPrefix:'/api/admin',// 支付中心接口前缀
    apiPayPrefix:'/api/pay',// 支付收银台接口前缀
    apiUser:'/api/user',// 用户管理接口前缀
    apiReconciliation:'/api/reconciliation',// 对账接口前缀
  },
  // 预发环境
  pre:{
    env:'pre',
    apiAdminPrefix:'/manage/api/admin',// 支付中心接口前缀
    apiPayPrefix:'/manage/api/pay',// 支付收银台接口前缀
    apiUser:'/api/user',// 用户管理接口前缀
    apiReconciliation:'/api/reconciliation',// 对账接口前缀
  },
  // 生产环境
  production:{
    env:'production',
    apiAdminPrefix:'/manage/api/admin',// 支付中心接口前缀
    apiPayPrefix:'/manage/api/pay',// 支付收银台接口前缀
    apiUser:'/api/user',// 用户管理接口前缀
    apiReconciliation:'/api/reconciliation',// 对账接口前缀
  },
  // 开发环境
  dev:{
    env:'dev',
    apiAdminPrefix:'/api/admin',// 支付中心接口前缀
    apiPayPrefix:'/api/pay',// 支付收银台接口前缀
    apiUser:'/api/user',// 用户管理接口前缀
    apiReconciliation:'/api/reconciliation',// 对账接口前缀
  },
}
let env = 'production'
if(location.hostname == 'testpaycenter.zhiyoubao.com'||
  location.hostname == 'test1paycenter.zhiyoubao.com'){
  // 测试环境
  env = 'test'
}else if(location.hostname == 'prepaycenter.zhiyoubao.com'){
  // 预发环境
  env = 'pre'
}else if(location.hostname == 'paycenter.zhiyoubao.com' ||
  location.hostname == '119.3.63.43'){
  // 正式环境
  env = 'production'
}else{
  // 开发环境
  env = 'dev'
}
export default config[env]
