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
  defaultChannel: [
    {label:"是",value:"1"},
    {label:"否",value:"0"},
  ]
}
export default dic
