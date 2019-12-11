<template>
  <div>
    <formList :formItems="formList"
              ref='formList'
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
        detail:{},
        apiPrefix:this.common.config.apiUser,
        formListUrl: "/staff/add",
        formList: [
          {
            title: '手机号码',
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
            title: '操作员密码',
            name: 'accPass',
            type: 'password',
            rules: [
              {required: true, message: '请输入操作员密码', trigger: 'blur'},
              {min:6,max: 12, message: "密码仅支持6-12位", trigger: 'blur'}
            ]
          },
          {
            title: '账号所有人',
            name: 'accName',
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
            name: 'accStatus',
            type: 'select',
            data: this.common.dic.accStatus,
            rules: [
              {required: true, message: '请选择账号状态', trigger: 'change'}
            ],
            value: '1'
          },
          {
            title: '选择角色',
            name: 'roleIds',
            type: 'checkbox',
            data: [],
            onChange:()=>{
              // this.$nextTick(()=>{
              //   this.$refs.formList.validateField('roleIds')
              // })
              // setTimeout(()=>{
              //   this.$refs.formList.validateField('roleIds')
              // },0)
            },
            rules: [
              { required: true, type: 'array', min: 1, message: '请选择选择角色', trigger: 'blur' }
            ],
            value: []
          },
        ],
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
      // 获取角色
      this.getRoleList()
      // 如果是编辑，详情
      this.getDetail()
    },
    methods: {
      // 获取角色
      getRoleList(){
        let url = '/role/grid'
        this.apiGet(url,{},this.apiPrefix).then(res=>{
          if(res.success){
            let roleList = []
            res.data.rows.forEach(ele=>{
              roleList.push({
                label:ele.roleName,
                value:ele.id,
              })
            })
            this.common.setArrItem(this.formList,'roleIds',{data:roleList})
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      // 确认保存之前
      beforeSave(formItem) {
        formItem.roleIds = formItem.roleIds.join(",")
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
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '商户详情'])
          } else {
            // 如果是编辑
            this.formListUrl = '/staff/update'
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '编辑商户'])
          }
          this.apiGet("/staff/detail/",{id},this.apiPrefix).then(res => {
            if (res.status == 200 && res.data) {
              this.detail = res.data
              this.detail.roleIds = []
              this.detail.roles.forEach(ele=>{
                this.detail.roleIds.push(ele.id)
              })
              if (this.routeType == 'detail') {
                // 如果是详情页
              } else {
                // 如果是编辑

              }
              this.formList.forEach((ele) => {
                ele.value = res.data[ele.name]
                if (this.routeType == 'detail') {
                  // 如果是详情页
                  ele.type += "Text"
                }else {
                  if(ele.name == 'accPass'){
                    ele.rules = [
                      {required: false, message: '请输入操作员密码', trigger: 'blur'},
                      {min:6,max: 12, message: "密码仅支持6-12位", trigger: 'blur'}
                    ]
                  }
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
