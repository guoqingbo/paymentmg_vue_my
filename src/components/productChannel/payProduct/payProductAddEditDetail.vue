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
      formList,
    },
    data () {
      return {
        formListUrl:"/payProduct/saveOrUpdate",
        formList: [
          {
            title: '支付产品代码',
            name: 'payProductCode',
            type: 'input',
            rules: [
              { required: true, message: '请输入支付产品代码', trigger: 'blur' },
              { max: 20, message: "支付产品代码不超过20字符" ,trigger: 'blur'}
            ],
            value:''//vue中对象新增属性赋值是监测不到的
          },
          {
            title: '支付产品名称',
            name: 'payProductName',
            type: 'input',
            rules: [
              { required: true, message: '请输入支付产品名称', trigger: 'blur' },
              { max: 20, message: "支付产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '产品说明',
            name: 'remark',
            type: 'textarea',
            rules: [{ max: 100, message: "产品说明不超过100字符" ,trigger: 'blur'}]
          },
        ],
        routeType:'',// 编辑、删除、详情
      }
    },
    watch: {

    },
    created () {
      // 如果是编辑，详情
      this.getDetail()
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
            this.$store.dispatch('setBreadcrumbListAction', ['支付产品管理','支付产品详情'])
          }else{
            // 如果是编辑的时候
            this.formList[0].disabled = true
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['支付产品管理','编辑支付产品'])
          }
          this.apiGet("/payProduct/"+id).then(res => {
            if (res.status == 200 && res.data) {
              this.formList.forEach((ele)=>{
                ele.value = res.data[ele.name]
                if(this.routeType == 'detail' && ele.type!='text' ){
                  // 如果是详情页
                  ele.type += "Text"
                }
              })
            }
            console.log(this.formList)
          });
        }
      },
    }
  }
</script>

<style lang="scss">

</style>
