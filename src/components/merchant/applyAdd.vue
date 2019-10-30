<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              @beforeSave="beforeSave">
    </formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";

  export default {
    components: {formList},
    data() {
      return {
        formListUrl: "/merchant/save",
        formList: [
          {
            title: '所属商户',
            name: 'merchantType',
            type: 'select',
            data: this.common.dic.merchantType,
            onChange:this.merchantTypeChange,
            rules: [
              {required: true, type: 'number', message: '请选所属商户', trigger: 'change'}
            ],
            value: 100
          },
          {
            title: '应用名称',
            name: 'merchantName',
            type: 'input',
            rules: [
              {required: true, message: '请输入应用名称', trigger: 'blur'},
              {max: 32, message: "应用名称不超过32字符", trigger: 'blur'}
            ],
            value: ""
          },
          {
            title: '应用图标',
            name: 'licenseUrl',
            type: 'uploadFile',
            tip: '请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于2M'
          },
          {
            title: '应用来源',
            name: 'source',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择应用来源', trigger: 'change' }]
          },
          {
            title: '支付标识（PayID）',
            name: 'payId',
            type: 'input',
            rules: [
              {required: true, message: '支付标识（PayID）', trigger: 'blur'},
            ],
            tip:'平台与支付中心约定的平台的支付标识，小鲸商城的店铺ID、云pms的店铺编号等',
            value: ""
          },
          {
            title: '应用简介',
            name: 'privateKey',
            type: 'textarea',
            value: '',
            disabled: false,
          },
          {
            title: '适用场景',
            name: 'idType',
            type: 'select',
            data: this.common.dic.idType,
            rules: [
              {required: true,message: '请选择证件类型', trigger: 'change'}
            ],
            onChange:this.idTypeChange,
            value: 1
          },
          {
            title: '应用状态',
            name: 'status',
            type: 'select',
            data: this.common.dic.applyStatus,
            rules: [
              {required: true,message: '请选择应用状态', trigger: 'change'}
            ],
            onChange:this.idTypeChange,
            value: 1
          }
        ],// 商户类型为个人时
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
      // 更改商户类型
      this.merchantTypeChange(200)
      // 如果是编辑，详情
      this.getDetail()
    },
    methods: {
      // 证件类型改变时
      idTypeChange(e){
        // 1身份证 2护照 3港澳通行证
        let arrItem = this.common.getArrItem(this.formList1,'idCard')
        if(e==1){
          arrItem.rules[0].validator = this.common.validate.IdCodeValid
        }else if(e==2){
          arrItem.rules[0].validator = this.common.validate.passport
        }else if(e==3){
          arrItem.rules[0].validator = this.common.validate.passportHM
        }
      },
      // 确认保存之前
      beforeSave(formItem) {
        if (formItem.areaObj) {
          // 转换省市区
          let area = formItem.areaObj
          formItem.provinceCode = area[0].value;
          formItem.province = area[0].label;
          formItem.cityCode = area[1].value;
          formItem.city = area[1].label;
          formItem.districtCode = area[2].value;
          formItem.district = area[2].label;
          delete formItem.areaObj
          delete formItem.area
        }

        // 商户名，商户号拆分
        this.common.splitMerchant(formItem)

        if (this.$route.query.id) {
          formItem.id = this.$route.query.id
        }
      },
      getDetail() {
        if (this.$route.query.id) {
          let id = this.$route.query.id
          this.routeType = this.$route.query.routeType
          if (this.routeType == 'detail') {
            // 如果是详情页

            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '商户详情'])
          } else {
            // 如果是编辑
            this.formListUrl = '/merchant/update'
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '编辑商户'])
          }
          this.apiGet("/merchant/detail/" + id).then(res => {
            if (res.status == 200 && res.data) {
              // 更改账户类型
              this.merchantTypeChange(res.data.merchantType)
              if (this.routeType == 'detail') {
                // 如果是详情页
              } else {
                // 如果是编辑
                // 更改证件类型验证
                this.idTypeChange(res.data.idType)
              }

              this.common.setArrItem(this.formList,'merchantType',{disabled:true})
              this.formList.forEach((ele) => {
                ele.value = res.data[ele.name]
                if (this.routeType == 'detail' && ele.type != 'text') {
                  // 如果是详情页
                  ele.type += "Text"
                  if (ele.name == 'area') {
                    // 初始化区域
                    let addrCodeName = [res.data.province, res.data.city, res.data.district].filter(ele=>{
                      if(ele){
                        return true
                      }
                    })
                    ele.areaText = addrCodeName.join("-")
                  }
                }
                if (this.routeType !== 'detail' && ele.name == 'area') {
                  // 如果是编辑页
                  if (ele.name == 'area') {
                    let addrCode = [res.data.provinceCode, res.data.cityCode, res.data.districtCode]
                    // ele.addrCode = addrCode.join("-")
                    ele.value = addrCode.join("-")
                    // if (addrCode[0] && addrCode[1] && addrCode[2]) {
                    //   ele.addrCode = addrCode.join("-")
                    // }
                  }
                }
                if(ele.name == 'parentMerchantCode' && res.data.parentMerchantCode){
                  ele.value=res.data.parentMerchantName+"("+res.data.parentMerchantCode+")"
                }
              })
            }
          });
        }
      },
      // 更改商户类型
      merchantTypeChange(type){
        // 100 个人商户 200企业商户
        if(type == 100){
          this.common.setArrItem(this.formList1,'merchantType',{value:100})
          this.formList = this.formList1
        }else{
          this.common.setArrItem(this.formList0,'merchantType',{value:200})
          this.formList = this.formList0
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
