// 数据字典
let dic = {
  //商户类型
  merchantType: [
    {label: '个人商户', value: 100},
    {label: '企业商户', value: 200}
  ],
  // 状态
  status: [
    {label:"不可用",value:0},
    {label:"可用",value:1},
  ],
  // 支付限额状态
  payLimitStatus: [
    {label:"启用",value:1},
    {label:"停用",value:0},
  ],
  // channelType: [
  //   {label:"银行",value:0},
  //   {label:"支付公司",value:1},
  //   {label:"其他",value:2},
  // ],
  // 签约状态
  signStatus: [
    {label:"已解约",value:0},
    {label:"已签约",value:1},
  ],
  // 计费方式
  feeType:[
    {label:"按交易笔数（元/笔）",value:0},
    {label:"按交易金额（%）",value:1},
  ],
  idType:[
    {label:"身份证",value:1},
    {label:"护照",value:2},
    {label:"港澳通行证",value:3},
  ],
  // 默认推荐支付方式
  priority: [
    {label:"是",value:999},
    {label:"否",value:0},
  ],
  // // 商户模式
  // accessMode:[
  //   {label:"服务商模式",value:'service'},
  //   {label:"普通模式",value:'common'},
  // ],
  // 结算状态
  busiStatus: [
    {label:"全部状态",value:"all"},
    {label:"待结算",value:"0"},
    {label:"结算中",value:"1"},
    {label:"结算成功",value:"2"},
    {label:"结算失败",value:"3"}
  ],
  // 费用类型
  splitType: [
    {label:"普通分账",value:"0"},
    {label:"手续费分账",value:"1"},
  ],
}
export default dic
