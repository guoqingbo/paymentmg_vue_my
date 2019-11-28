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
    components: {formList},
    data() {
      return {
        formListUrl: "/merchant/save",
        formList: [
          {
            title: '商户名称',
            name: 'parentMerchantCode',
            // rules: [{max: 50, message: "上级商户号不超过50字符", trigger: 'blur'}],
            type: 'autoComplete',
            value: '',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.formList1,'parentMerchantCode')
              this.common.searchMerchantList(value,arrItem)
            },
          },
          {
            title: '管理员手机号码',
            name: 'phone',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: false,
              trigger: "blur"
            }],
            value:'',
          },
          {
            title: '管理员密码',
            name: 'merchantName',
            type: 'input',
            rules: [
              {required: true, message: '请输入操作员密码', trigger: 'blur'},
              {min:6,max: 12, message: "密码仅支持6-12位", trigger: 'blur'}
            ]
          },
          {
            title: '账号所有人',
            name: 'corpName',
            type: 'input',
            rules: [{required: false, message: '请输入账号所有人', trigger: 'blur'},
              {max: 50, message: "账号所有人不超过50字符", trigger: 'blur'}]
          },
          {
            title: '电子邮箱',
            name: 'email',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: false, trigger: "blur"}
            ],
            value:''
          },
          {
            title: '账号状态',
            name: 'status',
            type: 'select',
            data: this.common.dic.memberStatus,
            rules: [
              {required: true, message: '请选择账号状态', trigger: 'change'}
            ],
            value: '1'
          }
        ],
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
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
      }
    }
  }
</script>

<style lang="scss">

</style>
