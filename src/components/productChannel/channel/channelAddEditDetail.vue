<template>
  <div>
    <formList :formItems="formList"
              :url="formListUrl"
              :routeType="routeType"
              @beforeSave="beforeSave"></formList>
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
        formListUrl:"/channel/saveOrUpdate",
        formList: [
          {
            title: '渠道编码',
            name: 'channelCode',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道编码', trigger: 'blur' },
              { max: 20, message: "渠道编码不超过20字符" ,trigger: 'blur'}
            ],
            value:""
          },
          {
            title: '渠道名称',
            name: 'channelName',
            type: 'input',
            value:'',
            rules: [
              { required: true, message: '请输入场景名称', trigger: 'blur' },
              { max: 20, message: "场景名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道性质',
            name: 'channelType',
            type: 'select',
            data: this.$store.state.global.channelType,
            rules: [{ required: true,type:"number", message: '请选择渠道性质', trigger: 'change' }]
          },
          {
            title: '签约状态',
            name: 'status',
            type: 'select',
            data: this.common.dic.signStatus,
            rules: [{ required: true, type:"number",message: '请选择签约状态', trigger: 'change' }]
          },
          {
            title: '业务联系人',
            name: 'contactName',
            type: 'input',
            rules: [{ max: 20, message: "业务联系人不超过20字符" ,trigger: 'blur'}]
          },
          {
            title: '业务联系人手机号',
            name: 'contactPhone',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: false,
              trigger: "blur"
            }]
          },
          {
            title: '业务联系人邮箱',
            name: 'contactEmail',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: false, trigger: "blur"}
            ]
          },
          {
            title: '备注',
            name: 'remark',
            type: 'textarea',
            rules: [{ max: 100, message: "备注不超过100字符" ,trigger: 'blur'}]
          },
        ],
        routeType:"",
      }
    },
    watch: {

    },
    created () {
      // 如果是编辑，详情
      this.getDetail()
      //获取渠道类型
      this.getChannelType()
    },
    methods: {
      beforeSave(formItem){
        // 确认保存之前
        if (this.$route.query.id){
          formItem.id = this.$route.query.id
        }
      },
      getDetail(){
        if (this.$route.query.id) {
          let id = this.$route.query.id
          this.routeType = this.$route.query.routeType
          if(this.routeType == 'detail'){
            // 如果是详情页
            let moreFormList = [
              {
                title: '创建日期',
                name: 'createTime',
                type: 'text',
              },
              {
                title: '最近更新时间',
                name: 'modifyTime',
                type: 'text',
              },
            ]
            this.formList.push(...moreFormList)
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['渠道管理','渠道详情'])
          }else{
            // 如果是编辑
            this.formList[0].disabled = true
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['渠道管理','编辑渠道'])
          }
          this.apiGet("/channel/"+id).then(res => {
            if (res.status == 200 && res.data) {
              this.formList.forEach((ele)=>{
                ele.value = res.data[ele.name]
                if(this.routeType == 'detail' && ele.type!='text'){
                  // 如果是详情页
                  ele.type += "Text"
                }
              })
            }
          });
        }
      },
      getChannelType(){
        // if(!this.$store.state.global.channelType){
        //   this.$store.dispatch("getChannelType").then(res=>{
        //     this.formList[2].data = this.$store.state.global.channelType
        //   })
        // }
        this.$store.dispatch("getChannelType").then(res=>{
          this.formList[2].data = this.$store.state.global.channelType
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
