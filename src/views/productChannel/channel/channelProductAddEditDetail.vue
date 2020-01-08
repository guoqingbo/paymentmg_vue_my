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
        formListUrl:"/channelProduct/saveOrUpdate",
        formList: [
          {
            title: '所属渠道',
            name: 'channelName',
            type: 'input',
            disabled:true,
            value:this.$route.query.channelName
          },
          {
            title: '渠道产品编码',
            name: 'channelProductCode',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品编码', trigger: 'blur' },
              { max: 20, message: "渠道产品编码不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道所属类别',
            name: 'type',
            type: 'select',
            data: this.common.dic.funType,
            onChange:this.funTypeOnChange,
            rules: [{ required: true,message: '请选择渠道所属类别', trigger: 'change' }],
            value:''
          },
          {
            title: '渠道产品名称',
            name: 'channelProductName',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品名称', trigger: 'blur' },
              { max: 20, message: "渠道产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '可用状态',
            name: 'status',
            type: 'select',
            data: this.common.dic.status,
            rules: [{ required:false,type: 'number'}],
            value:1
          },
          {
            title: '备注',
            name: 'remark',
            type: 'textarea',
            rules: [{ max: 100, message: "备注不超过100字符" ,trigger: 'blur'}]
          },
        ],
        funTypeItems:[
          {
            title: '渠道计费方式',
            name: 'feeType',
            type: 'select',
            data: this.common.dic.feeType,
            rules: [{ required: true,type:'number',message: '请选择渠道计费方式', trigger: 'change' }]
          },
          {
            title: '渠道费率',
            name: 'feeRate',
            type: 'input',
            rules: [
              // {required: true,message: '请输入渠道费率',trigger: 'blur'},
              {required: true,validator: this.validateChannelRate, trigger: "blur"}
            ]
          },
          {
            title: '退款是否退手续费',
            name: 'returnFee',
            type: 'radio',
            data: [
              {label:"是",value:"T"},
              {label:"否",value:"F"},
            ],
            rules: [{ required: true, message: '请选择是否退手续费', trigger: 'change' }],
            value:'T'
          },
        ],
        routeType:"",
      }
    },
    watch: {

    },
    created () {
      this.getDetail()
    },
    methods: {
      funTypeOnChange(value){
        if(value==1 || value == 4){
          // 当前所属类别为备用金充值，分账 渠道计费方式，渠道费率，退款是否手续费隐藏
          if(this.formList[4].name == 'feeType'){
            this.formList.splice(4,3)
          }
        }else{
          if(this.formList[4].name !== 'feeType'){
            this.formList.splice(4,0,...this.funTypeItems)
          }
        }
      },
      validateChannelRate(rule, value, callback){
        if(rule.required && value === ''){
          callback(new Error('请输入渠道费率'))
          return
        }
        if(value<0 || value>=100){
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
      beforeSave(formItem){
        // 确认保存之前
        if (this.$route.query.channelId){
          formItem.channelId = this.$route.query.channelId
        }
        if(this.$route.query.id){
          formItem.id = this.$route.query.id
        }
      },
      afterSave(){
        this.$router.push({
          path: "/productChannel/channel/channelProductManage",
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
            // // 更新位置占位符
            // this.$store.dispatch('setBreadcrumbListAction', ['渠道管理','渠道产品管理','渠道产品详情'])
          }else{
            // 如果是编辑
            this.formList[1].disabled = true
            // // 更新位置占位符
            // this.$store.dispatch('setBreadcrumbListAction', ['渠道管理','渠道产品管理','编辑渠道产品'])
          }
          this.apiGet("/channelProduct/"+id).then(res => {
            if (res.status == 200 && res.data) {
              this.formList.forEach((ele)=>{
                ele.value = res.data[ele.name]
                if(ele.name == 'type'){
                  ele.value = ele.value+""
                  this.funTypeOnChange(ele.value)
                }
                if(this.routeType == 'detail'&&ele.type!='text'){
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
