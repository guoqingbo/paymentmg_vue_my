<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              :apiPrefix="apiPrefix"
              @beforeSave="beforeSave"></formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";

  export default {
    components: {formList},
    data() {
      return {
        apiPrefix:this.common.config.apiUser,
        formListUrl: "/admin/add",
        formList: [
          {
            title: '商户名称',
            name: 'merchantCode',
            rules: [{required: true, message: '选择商户名称', trigger: 'change'},
              {max: 50, message: "商户名不超过50字符", trigger: 'change'}],
            type: 'autoComplete',
            value: '',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.formList,'merchantCode')
              this.common.searchMerchantList(value,arrItem)
            },
          },
          {
            title: '管理员手机号码',
            name: 'phone',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: true,
              trigger: "blur"
            }],
            value:'',
          },
          {
            title: '管理员密码',
            name: 'accPass',
            type: 'password',
            rules: [
              {required: true, message: '请输入操作员密码', trigger: 'blur'},
              {min:6,max: 12, message: "密码仅支持6-12位", trigger: 'blur'},
              {required: false,validator: this.common.validate.space, trigger: "blur"}
            ]
          },
          {
            title: '确认管理员密码',
            name: 'accPassConfirm',
            type: 'password',
            rules: [
              {required: true, message: '请确认管理员密码', trigger: 'blur'},
              {required: true, validator: this.accPassConfirm, trigger: "blur"}
            ]
          },
          {
            title: '账号所有人',
            name: 'accName',
            type: 'input',
            rules: [{required: false, message: '请输入账号所有人', trigger: 'blur'},
              {max: 50, message: "账号所有人不超过50字符", trigger: 'blur'}],
            value:''
          },
          {
            title: '电子邮箱',
            name: 'email',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: false, trigger: "blur"},
              {max: 64, message: "邮箱地址不超过64字符", trigger: 'blur'}
            ],
            value:''
          },
          {
            title: '账号状态',
            name: 'accStatus',
            type: 'select',
            data: this.common.dic.accStatus,
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
      accPassConfirm(rule, value, callback){
        if (!rule.required && !value) {
          // 非必填时
          callback()
          return
        }
        let accPass = this.common.getArrItem(this.formList,'accPass')
        if (value !==accPass.value) {
          callback(new Error('密码不一致！'))
        } else {
          callback()
        }
      },
      // 确认保存之前
      beforeSave(formItem) {
        // 商户名，商户号拆分
        this.common.splitMerchant(formItem)
        if (this.$route.query.id) {
          formItem.userId = this.$route.query.id
        }
      },
      getDetail() {
        if (this.$route.query.id) {
          let id = this.$route.query.id
          this.routeType = this.$route.query.routeType
          if (this.routeType == 'detail') {
            // 如果是详情页

            // 更新位置占位符
            // this.$store.dispatch('setBreadcrumbListAction', ['商户管理员', '商户管理员'])
          } else {
            // 如果是编辑
            this.formListUrl = '/admin/update'
            // 更新位置占位符
            // this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '编辑商户'])
          }
          this.apiGet("/admin/detail",{id},this.apiPrefix).then(res => {
            if (res.success) {
              if (this.routeType == 'detail') {
                // 如果是详情页
              } else {
                // 如果是编辑

              }
              let accPassIndex = ''
              this.formList.forEach((ele,index) => {
                ele.value = res.data[ele.name]
                if(ele.name == 'accPass') {
                  accPassIndex = index
                }
                if (this.routeType == 'detail') {
                  // 如果是详情页
                  ele.type += "Text"
                }else {
                  if(ele.name == 'accPass'){
                    // ele.disabled = true
                    // ele.rules = [
                    //   {required: false, message: '请输入管理员密码', trigger: 'blur'},
                    //   {min:6,max: 12, message: "密码仅支持6-12位", trigger: 'blur'},
                    //   {required: false,validator: this.common.validate.space, trigger: "blur"}
                    // ]
                  }else if(ele.name == 'accPassConfirm'){
                    // ele.disabled = true
                    // ele.rules = [
                    //   {required: false, message: '请确认管理员密码', trigger: 'blur'},
                    //   {required: false, validator: this.accPassConfirm, trigger: "blur"}
                    // ]
                  }else if(ele.name == 'merchantCode'){
                    ele.disabled = true
                  }else if(ele.name == 'phone'){
                    ele.disabled = true
                  }
                }
                if(ele.name == 'merchantCode' && res.data.merchantName){
                  ele.value=res.data.merchantName+"("+res.data.merchantCode+")"
                }
              })
              this.formList.splice(accPassIndex, 2)
            }else{
              this.$Message(res.message)
            }
          });
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
