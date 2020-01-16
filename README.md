# 支付中心管理系统
* 用户模块接口:http://192.168.66.28:8080/doc.html#/default/user-operator-controller/gridUsingGET_2
## 开发规范
* global下为公用组件,组件中请不要带页面的具体业务逻辑，或字段，以防破环组件的公用性
   
## git管理
 * test分支 测试代码
 * master分支 正式发布代码备份 下次迭代开发时，要从master分支拉代码，新建分支feature/功能_上线日期
 * pre分支 预发分支
 * feature/xxx_xxx 迭代开发分支
 * develop分支 正式发布代码（基本没用到）
   
## 项目信息
 * 源码地址 http://git.sendinfo.com/zhiyoubao/Front-end/payment/paymentmg_vue.git
 * jekins地址 http://192.168.200.24:9002 guoqingbo/Gqb123456
 * admin-swagger  http://192.168.200.88:10806/swagger-ui.html
 * pay-swagger  http://192.168.200.88:6073/swagger-ui.html
 * 用户管理api文档 http://192.168.200.88:10910/doc.html
 * 收银台 paycenter.zhiyoubao.com/cashier/cashierManage/choosePayWay
 * 微信支付唤起 paycenter.zhiyoubao.com/cashier/cashierManage/callWxPay
 * 不同的支付方式 paycenter.zhiyoubao.com/cashier/cashierManage/payWay
 * 支付成功 paycenter.zhiyoubao.com/cashier/cashierManage/paySuccess
 * 支付失败 paycenter.zhiyoubao.com/cashier/cashierManage/payError
    
## 测试环境
 * 域名 testpaycenter.zhiyoubao.com
 * 超级账号 superadmin/123456  18888888888/123456
    
## 预发环境
 * 域名 prepaycenter.zhiyoubao.com
 * 超级账号 superadmin/123456
 
## 正式环境
 * 域名 paycenter.zhiyoubao.com
 * 超级账号 superadmin/123456
