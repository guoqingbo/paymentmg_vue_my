<template>
  <div>
    <formList :formItems="formList"
              :url="formListUrl"
              :routeType="routeType"
              @beforeSave="beforeSave"
              @afterSave="afterSave"></formList>
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
        formListUrl:"/payProductChannel/saveOrUpdate",
        formList: [
          {
            title: '支付产品名称',
            name: 'payProductName',
            type: 'input',
            disabled:true,
            value:this.$route.query.payProductName,
          },
          {
            title: '渠道产品编码',
            name: 'channelProductCode',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品编码', trigger: 'blur' },
              { max: 20, message: "支付产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '说明',
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
        if (this.$route.query.payProductId){
          formItem.payProductId = this.$route.query.payProductId
        }
      },
      afterSave(){
        this.$router.push({
          path: "/productChannel/payProduct/payChannelManage",
        });
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
            this.$store.dispatch('setBreadcrumbListAction', ['支付产品管理','支付产品渠道详情'])
          }else{
            // 如果是编辑的时候

          }
          this.apiGet("/payProductChannel/"+id).then(res => {
            if (res.status == 200 && res.data) {
              this.formList.forEach((ele)=>{
                ele.value = res.data[ele.name]
                if(this.routeType == 'detail' && ele.type!='text' ){
                  // 如果是详情页
                  ele.type += "Text"
                }
              })
            }
          });
        }
      },
    }
  }
</script>

<style lang="scss">

</style>
