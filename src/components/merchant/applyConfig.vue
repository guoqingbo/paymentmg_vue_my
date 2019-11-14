<template>
  <div>
    <formList ref="formList"
              :formItems="formList"
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
    data() {
      return {
        formListUrl: "/merchantChannel/save",
        formList: [
          {
            title: '功能名称',
            name: 'channelProductCode',
            type: 'input',
            disabled:true
          },
          {
            title: '收费模式',
            name: 'merchantFeeType',
            type: 'select',
            data: this.common.dic.feeType,
            disabled: true,
            rules: [
              {required: true, type: 'number', message: '请选择收费模式', trigger: 'change'}
            ],
          },
          {
            title: '商户费率',
            name: 'merchantFeeRate',
            type: 'input',
            rules: [
              {required: true, validator: this.validateMerchantFeeRate, trigger: 'blur'}
            ]
          },
          {
            title: '优先支付',
            name: 'priority',
            type: 'radio',
            value: 999,
            data: this.common.dic.priority,
            rules: [{required: true, type: 'number', message: '请选择优先支付方式', trigger: 'change'}]
          }
        ],
        routeType: "",// 判断是新增，详情，编辑
        detail: {},//获取的详情
      }
    },
    watch: {},
    created() {
      this.getDetail()
    },
    methods: {
      // 商户费率验证
      validateMerchantFeeRate(rule, value, callback) {
        if (rule.required && value === '') {
          callback(new Error('请输入商户费率'))
          return
        }
        if (value < 0 || value >= 100) {
          callback(new Error('请输入0至100的数'))
          return
        }
        let regexp = /^(([0-9]*)|(([0]\.\d{1,7}|[1-9][0-9]*\.\d{1,7})))$/
        if (!(regexp.test(value))) {
          callback(new Error('数据格式不正确！'))
        } else {
          callback()
        }
      },
      beforeSave(formItem) {
        formItem.id = this.detail.id
        formItem.merchantCode = this.detail.merchantCode
        formItem.payProductCode = this.detail.payProductCode
      },
      // 获取功能详情
      getDetail(){
        let id = this.$route.query.id
        this.apiGet("/merchantChannel/" + id).then(res => {
          if (res.success) {
            this.detail = res.data
            if(res.data.configInfos && res.data.configInfos.length){
              // 隐藏优先支付
              this.formList.splice(3, 1)
              // 转换支付配置
              this.turnPayConfig(res.data.configInfos)
            }else{
              this.getPayConfig()
            }
            this.formList.forEach(ele => {
              if(typeof this.detail[ele.name]!='undefined'){
                ele.value = this.detail[ele.name]
              }
            })
          }
        });
      },
      //获取渠道产品支付配置
      getPayConfig() {
        let channelProductCode = this.detail.channelProductCode
        let params = {
          merchantCode: this.detail.merchantCode,
          // accessMode:'',
        }
        this.apiGet('/merchantChannel/payConfig/channelProduct/' + channelProductCode, params).then(res => {
          if (res.success) {
            // 保留公共选项
            // 设置渠道计费方式
            this.common.setArrItem(this.formList, 'merchantFeeType', {
              value: res.data.feeType
            })
            // 转换支付配置
            this.turnPayConfig(res.data.configs)
          }
        })
      },
      // 转换支付配置
      turnPayConfig(configInfos) {
        // 是否为农行商
        let abc = {}
        // 是否为微信官方
        let wechatOfficial = {}
        if (configInfos) {
          configInfos.forEach((ele) => {
            let formListItem = {
              title: ele.configName,
              name: ele.configKey,
              placeholder: ele.tips ? ele.tips : '',
              value: ele.configValue ? ele.configValue : '',
              rules: [
                {required: ele.required == 'T' ? true : false, message: '请输入' + ele.configName, trigger: 'blur'}
              ],
              type: 'input'
            }
            if (ele.ifFile == 'file') {
              formListItem.type = 'uploadFile';
              // 限制文件类型
              if (ele.fileSuffix) {
                let fileSuffixArr = ele.fileSuffix.split(",")
                let acceptArr = []
                formListItem.format = fileSuffixArr
                fileSuffixArr.forEach(ele => {
                  acceptArr.push("." + ele)
                })
                formListItem.showUploadUrl = false
                formListItem.accept = acceptArr.join(",")
                formListItem.tip = '上传' + acceptArr.join(",") + '格式的文件';
                formListItem.rules = [{
                  required: ele.required == 'T' ? true : false,
                  message: '请上传' + ele.configName,
                  trigger: 'change'
                }]
              }
            }
            else if (ele.ifFile == 'checkbox') {
              // 对象转为数组
              let data = []
              if (ele.tips) {
                let tipsObj = JSON.parse(ele.tips)
                Object.keys(tipsObj).forEach(sele => {
                  data.push({
                    value: sele,
                    label: tipsObj[sele]
                  })
                })
              }
              formListItem.type = 'radio'
              formListItem.data = data
              formListItem.rules = [{
                required: ele.required == 'T' ? true : false,
                message: '请选择' + ele.configName,
                trigger: 'change'
              }]
            }
            else if (ele.ifFile == 'textarea') {
              formListItem.type = 'textarea';
            }
            this.formList.push(formListItem)

            // 微信官方时特殊处理
            if (ele.configKey == 'accessMode') {
              // 有商户模式，则认为是微信官方
              wechatOfficial.accessMode = formListItem
              wechatOfficial.accessModeIndex = this.formList.length - 1
            }

            // 农行商时特殊处理
            if (ele.configKey == 'merchantCertFile') {
              abc.merchantCertFile = formListItem
            } else if (ele.configKey == 'merchantCertPassword') {
              abc.merchantCertPassword = formListItem
            } else if (ele.configKey == 'abcMerchantId') {
              abc.abcMerchantId = formListItem
            }
          })

          // 农行商
          if (Object.keys(abc).length) {
            this.turnPayConfigAbc(abc)
          }
          // 支付渠道为微信官方时，增加商户模式，为服务商模式和普通模式，默认返回的为服务商模式
          if (Object.keys(wechatOfficial).length) {
            this.turnPayConfigWechatOfficial(wechatOfficial)
          }
        }
      },
      // 渠道产品是农行商时特殊处理，上传商户证书时，商户号也传入
      turnPayConfigAbc(abc) {
        // 渠道产品编号前三位是104，则是农行商
        // 商户密钥
        let merchantCertPassword = abc.merchantCertPassword
        // 获取商户代码项
        let abcNoItem = abc.abcMerchantId
        // 获取商户证书项
        let abcCertFileItem = abc.merchantCertFile
        if (merchantCertPassword) {
          merchantCertPassword.type = 'textarea'
          merchantCertPassword.rules.push({
            max: 1000,
            message: merchantCertPassword.title + "不超过1000字符",
            trigger: 'blur'
          })
        }
        if (abcNoItem && abcCertFileItem) {
          abcNoItem.rules.push({max: 100, message: abcNoItem.title + "不超过100字符", trigger: 'blur'})
          abcNoItem.onChange = (e) => {
            if (e) {
              abcCertFileItem.disabled = false
            } else {
              abcCertFileItem.disabled = true
            }
          }
          abcCertFileItem.disabled = true
          abcCertFileItem.url = '/file/merchantcertfile'
          // abcCertFileItem.showUploadUrl = false
          abcCertFileItem.beforeUpload = (params) => {
            let val = abcNoItem.value
            if(val && typeof val == 'string'){
              val = val.replace(/(^\s*)|(\s*$)/g, "")
            }
            params.merchantId = val
          }
        }
      },
      // 支付渠道为微信官方时，增加商户模式，为服务商模式和普通模式，默认返回的为服务商模式
      turnPayConfigWechatOfficial(wechatOfficial) {
        // 商户模式
        let accessMode = wechatOfficial.accessMode
        let accessModeIndex = wechatOfficial.accessModeIndex
        // 清空参数
        // let params = this.$refs.formList.getFormItem()
        // Object.keys(params).forEach(ele=>{
        //   delete params[ele]
        // })
        if (!accessMode.value) {
          accessMode.value = "common"
        }
        accessMode.onChange = (e) => {
          // let url = '/merchantChannel/payConfig/changemodel'
          // let params = {
          //   accessModel:e,
          //   channelProductCode:this.common.getArrItem(this.formList,'channelProductCode').value
          // }

          let formItem = this.common.splitMerchant(this.$refs.formList.getFormItem())
          let channelProductCode = this.common.getArrItem(this.formList, 'channelProductCode').value
          if (!formItem.merchantCode) {
            this.$Message.info("请先输入商户号")
            return
          }
          let url = '/merchantChannel/payConfig/channelProduct/' + channelProductCode
          let params = {
            merchantCode: formItem.merchantCode,
            accessMode: e,
          }
          this.apiGet(url, params).then(res => {
            if (res.success) {
              let configInfos = []
              // 如果是编辑页
              let accessMode = ''
              if (this.detail) {
                this.detail.configInfos.forEach(ele => {
                  if (ele.configKey == "accessMode") {
                    accessMode = ele.configValue
                  }
                })
                if (accessMode == e) {
                  configInfos = this.detail.configInfos
                  // this.turnPayConfig(this.detail.configInfos)
                } else {
                  configInfos = res.data.configs
                  // this.turnPayConfig(res.data)
                }
              } else {
                configInfos = res.data.configs
                // this.turnPayConfig(res.data)
              }
              this.turnPayConfig(configInfos)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .select-channel-product {
    text-align: center;
    font-size: 30px;
    color: #999;
    padding-bottom: 40px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 20px;
  }
</style>
