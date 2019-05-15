<template>
  <div class="merchantAdd">
    <formList :formItems="formList"
              :url="formListUrl"
              :value="true"></formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";
  export default {
    components: {
      formList,
    },
    data () {
      return {
        formListUrl:"admin/sysRole/grid",
        formList: [
          {
            title: '所属渠道',
            name: 'chanelNature',
            type: 'input',
            disabled:true,
            value:'银联支付'
          },
          {
            title: '渠道产品编码',
            name: 'chanelProductNo',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品编码', trigger: 'blur' },
              { max: 20, message: "渠道产品编码不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道产品名称',
            name: 'chanelProductName',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品名称', trigger: 'blur' },
              { max: 20, message: "渠道产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道计费方式',
            name: 'channelBillingMode',
            type: 'select',
            data: [
              {label:"按交易笔数（元/笔）",value:"0"},
              {label:"按交易金额（%）",value:"1"},
            ],
            rules: [{ required: true, message: '请选择渠道计费方式', trigger: 'change' }]
          },
          {
            title: '渠道费率',
            name: 'channelRate',
            type: 'input',
            rules: [
              {required: true,message: '请输入渠道费率',trigger: 'blur'},
              {validator: this.validateChannelRate, trigger: "blur"}
            ]
          },
          {
            title: '退款是否退手续费',
            name: 'isServiceCharge ',
            type: 'radio',
            data: [
              {label:"是",value:"1"},
              {label:"否",value:"0"},
            ],
            rules: [{ required: true, message: '请选择是否退手续费', trigger: 'change' }]
          },
          {
            title: '可用状态',
            name: 'enabledStatus',
            type: 'select',
            data: [
              {label:"可用",value:"0"},
              {label:"不可用",value:"1"},
            ],
          },
          {
            title: '备注',
            name: 'sceneRemark',
            type: 'textarea',
            rules: [{ max: 100, message: "备注不超过100字符" ,trigger: 'blur'}]
          },
        ],
      }
    },
    watch: {

    },
    created () {

    },
    methods: {
      validateChannelRate(rule, value, callback){
        if(value<=0 || value>=100){
          callback(new Error('请输入大于0小于100的数'))
          return
        }
        this.common.validate.floatNumber(rule, value, callback)
      }
    }
  }
</script>

<style lang="scss">
  .merchantAdd {
    width: 70%;
    margin: 0 auto;
  }
</style>
