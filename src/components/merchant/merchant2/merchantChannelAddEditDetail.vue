<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              @beforeSave="beforeSave"></formList>
  </div>
</template>
<script>
  import formList from "@/components/global/formList";
  export default {
    components: {
      formList
    },
    data () {
      return {
        formListUrl: "/merchantChannel/save",
        formList: [
          {
            title: '商户号',
            name: 'merchantCode',
            type: 'input',
            data: this.common.dic.merchantType,
            rules: [
              { required: true, message: '请输入商户号', trigger: 'blur' },
              { max: 20, message: "商户号不超过20字符" }
            ],
            value: ""
          },
          {
            title: '支付产品',
            name: 'payProductId',
            type: 'select',
            data:'',
            onChange:this.getChannelProduct,
            value:'',
            rules: [
              { required: true, type:'number',message: '请选择支付产品', trigger: 'change' }
            ]
          },
          {
            title: '渠道产品',
            name: 'channelProductId',
            type: 'select',
            data:'',
            onChange:this.getPayConfig,
            value:'',
            rules: [
              { required: true, type:'number',message: '请选择渠道产品', trigger: 'change' }
            ]
          },
          {
            title: '渠道计费方式',
            name: 'merchantFeeType',
            type: 'select',
            data:this.common.dic.feeType,
            rules: [
              { required: true, type:'number',message: '请选择计费方式', trigger: 'change' }
            ]
          },
          {
            title: '商户费率',
            name: 'merchantFeeRate',
            type: 'input',
            value:'',
            rules: [
              { required: true, validator:this.validateMerchantFeeRate, trigger: 'blur' }
              ]
          },
          {
            title: '支付配置信息',
            type: 'divider',
          }
        ],
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {

    },
    created () {
      this.getDetail()
    },
    methods: {
      validateMerchantFeeRate(rule, value, callback){
        if(rule.required && !value){
          callback(new Error('请输入商户费率'))
          return
        }
        if(value<=0 || value>=100){
          callback(new Error('请输入大于0小于100的数'))
          return
        }
        this.common.validate.floatNumber(rule, value, callback)
      },
      beforeSave(formItem){
        // 确认保存之前
        if(this.$route.query.id){
          formItem.id = this.$route.query.id
        }
      },
      getDetail(){
        this.routeType = this.$route.query.routeType
        if(this.routeType!=='detail'){
          // 获取支付产品
          this.getPayProduct()
        }
        if (this.$route.query.id) {
          let id = this.$route.query.id
          if(this.routeType == 'detail'){
            // 如果是详情页

            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理','商户渠道详情'])
          }else{
            // 如果是编辑
            this.formListUrl = "/merchantChannel/update"
            this.formList[1].disabled = true
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理','商户渠道编辑'])

          }
          this.apiGet("/merchantChannel/"+id).then(res => {
            if (res.status == 200 && res.data) {

              // 转换支付配置
              this.turnPayConfig(res.data.configInfos)

              this.formList.forEach((ele,index)=>{
                if(index <=5){
                  // 支付配置之前的选型需要赋值
                  ele.value = res.data[ele.name]
                }
                if(this.routeType == 'detail'&&ele.type!='text'&&ele.type!='divider'){
                  // 如果是详情页
                  ele.type += "Text"
                  // 转换数据
                  if(ele.name == 'channelProductId'){
                    ele.type = 'text'
                    ele.value = res.data.channelProductName
                  }else if(ele.name == 'payProductId'){
                    ele.type = 'text'
                    ele.value = res.data.payProductName
                  }
                }else{
                  if(ele.name == 'payProductId'){
                    // 获取渠道产品
                    this.getChannelProduct(ele.value)
                  }
                }
              })
            }
          });
        }
      },
      // 获取支付产品
      getPayProduct(){
        this.$store.dispatch("getPayProduct").then(res=>{
          this.formList[1].data = this.$store.state.global.payProduct
        })
      },
      // 获取渠道产品
      getChannelProduct(e){
        if(!e){
          return
        }
        this.apiGet('/channelProduct/payProductId/'+e).then(res=>{
          let channelProduct = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              channelProduct.push({
                value:ele.id,
                label:ele.channelProductName
              })
            })
          }
          this.formList[2].data = channelProduct
        })
      },
      // 获取渠道产品支付配置
      getPayConfig(e){
          this.apiGet('/merchantChannel/payConfig/channelProduct/'+e).then(res=>{
            if(res.status == 200){
              // 保留公共选项
              // this.formList.length = 6
              this.formList = this.formList.slice(0,6)
              // 转换支付配置
              this.turnPayConfig(res.data)
            }
          })
      },
      // 转换支付配置
      turnPayConfig(configInfos){
        configInfos.forEach((ele)=>{
          let formListItem = {
            title: ele.configName,
            name: ele.configKey,
            type: ele.ifFile == 'F'?'input':'uploadFile',
            rules: [
              { required: ele.required=='T'?true:false, message: '请输入'+ele.configName, trigger: 'blur' }
            ],
            value:ele.configValue?ele.configValue:''
          }
          this.formList.push(formListItem)
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
