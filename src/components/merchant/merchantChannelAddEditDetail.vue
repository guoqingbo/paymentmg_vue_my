<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              @beforeSave="beforeSave">
      <div v-if="formList.length==6" class="select-channel-product" slot="bottom">请选择渠道产品</div>
    </formList>
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
            name: 'merchantNameSearch',
            data: [],
            type: 'autoComplete',
            value: '',
            disabled:false,
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.formList,'merchantNameSearch')
              this.common.searchMerchantList(value,arrItem)
            },
            rules: [{ required: true, message: '请输入商户号', trigger: 'blur' },
              // { max: 60, message: "商户号不超过60字符" }
              ]
          },
          {
            title: '支付产品',
            name: 'payProductCode',
            type: 'select',
            data:[],
            onChange:this.getChannelProduct,
            rules: [
              { required: true,message: '请选择支付产品', trigger: 'change' }
            ]
          },
          {
            title: '渠道产品',
            name: 'channelProductCode',
            type: 'select',
            data:'',
            onChange:this.payConfigOnChange,
            rules: [
              { required: true,message: '请选择渠道产品', trigger: 'change' }
            ]
          },
          {
            title: '默认推荐支付方式',
            name: 'priority',
            type: 'radio',
            value: 999,
            data:this.common.dic.priority,
            rules: [{ required: true, type:'number', message: '请选择默认推荐支付方式', trigger: 'change' }]
          },
          {
            title: '渠道计费方式',
            name: 'merchantFeeType',
            type: 'select',
            data:this.common.dic.feeType,
            disabled:true,
            rules: [
              { required: true, type:'number',message: '请选择计费方式', trigger: 'change' }
            ],
          },
          {
            title: '商户费率',
            name: 'merchantFeeRate',
            type: 'input',
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
        detail:'',//获取的详情
      }
    },
    watch: {

    },
    created () {
      this.getDetail()
    },
    methods: {
      // 商户费率验证
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
        // 商户名，商户号拆分
        this.common.splitMerchant(formItem,this.formList)
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
            this.common.setArrItem(this.formList,'merchantCode',{
              disabled:true
            })
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理','商户渠道编辑'])

          }
          this.apiGet("/merchantChannel/"+id).then(res => {
            if (res.status == 200 && res.data) {
              this.detail = res.data
              // 转换支付配置
              this.turnPayConfig(res.data.configInfos)

              this.formList.forEach((ele,index)=>{
                if(index <=6){
                  // 支付配置之前的选型需要赋值
                  ele.value = res.data[ele.name]
                }
                if(this.routeType == 'detail'&&ele.type!='text'&&ele.type!='divider'){
                  // 如果是详情页
                  ele.type += "Text"
                  // 转换数据
                  if(ele.name == 'channelProductCode'){
                    ele.type = 'text'
                    ele.value = res.data.channelProductName
                  }else if(ele.name == 'payProductCode'){
                    ele.type = 'text'
                    ele.value = res.data.payProductName
                  }
                }else{
                  if(ele.name == 'payProductCode'){
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
          this.common.setArrItem(this.formList,'payProductCode',{
            data:res
          })
        })
      },
      // 根据支付产品获取渠道产品
      getChannelProduct(e){
        if(!e){
          return
        }
        this.apiGet('/channelProduct/payProductCode/'+e).then(res=>{
          let channelProduct = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              channelProduct.push({
                value:ele.channelProductCode,
                label:ele.channelProductName
              })
            })
          }
          this.common.setArrItem(this.formList,'channelProductCode',{
            data:channelProduct
          })
        })
      },
      // 渠道产品更改时
      payConfigOnChange(e){
          if(this.$route.query.id ){
            // 如果是编辑页面，并且产品支付配置存在，则弹出提示
            this.$Modal.confirm({
              content:'更换渠道产品将清空支付配置信息',
              onCancel:()=>{
                // 恢复原选项
                this.setArrItem(this.formList,'channelProductCode',{
                  value:this.detail.channelProductCode
                })
                // 转换支付配置
                this.turnPayConfig(this.detail.configInfos)
              },
              onOk:()=>{
                this.getPayConfig(e)
              }
            })
          }else{
            // 新增的时候
            this.getPayConfig(e)
          }
      },
      //获取渠道产品支付配置
      getPayConfig(e){
        let arrItem = this.common.getArrItem(this.formList,'merchantCode')
        let params = {
          merchantCode:arrItem.value
        }
        this.apiGet('/merchantChannel/payConfig/channelProduct/'+e,params).then(res=>{
          if(res.status == 200){
            // 保留公共选项
            // this.formList.length = 6
            this.formList = this.formList.slice(0,7)
            // 设置渠道计费方式
            this.common.setArrItem(this.formList,'merchantFeeType',{
              value:res.data.feeType
            })
            // 转换支付配置
            this.turnPayConfig(res.data.configs)
          }
        })
      },
      // 转换支付配置
      turnPayConfig(configInfos){
        // 清空配置
        this.formList = this.formList.slice(0,7)
        configInfos.forEach((ele)=>{
          let formListItem = {
            title: ele.configName,
            name: ele.configKey,
            type: ele.ifFile == 'F'?'input':'uploadFile',
            rules: [
              { required: ele.required=='T'?true:false, message:'请输入'+ele.configName, trigger: 'blur'}
            ],
            placeholder:ele.tips?ele.tips:'',
            value:ele.configValue?ele.configValue:''
          }
          this.formList.push(formListItem)
        })
      },
      // 获取渠道计费方式
    }
  }
</script>

<style scoped>
  .select-channel-product{
      text-align: center;
      font-size: 30px;
      color: #999;
      padding-bottom: 40px;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 20px;
    }
</style>
