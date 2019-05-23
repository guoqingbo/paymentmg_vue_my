// 数据字典
let dic = {
  //商户类型
  merchantType: [
    {label: '个人商户', value: 1},
    {label: '企业商户', value: 2}
  ],
  status: [
    {label:"不可用",value:0},
    {label:"可用",value:1},
  ],
  // channelType: [
  //   {label:"银行",value:0},
  //   {label:"支付公司",value:1},
  //   {label:"其他",value:2},
  // ],
  signStatus: [
    {label:"已解约",value:0},
    {label:"已签约",value:1},
  ],
  feeType:[
    {label:"按交易笔数（元/笔）",value:0},
    {label:"按交易金额（%）",value:1},
  ],
}
export default dic
