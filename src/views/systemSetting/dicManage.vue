<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :url="formUrl"
               :routeType='routeType'
               @input='closeModal'
               :title="formTitle">
    </modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    data () {
      return {
        routeType: 'add',
        columns: [
          {
            title: '参数名称',
            key: 'orderSourceName',
            // sortable: true,
            align:'center'
          },
          {
            title: '数据编码',
            key: 'orderSource',
            // sortable: true,
            align:'center'
          },
          {
            title: '数据值',
            key: 'orderSource',
            // sortable: true,
            align:'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 130,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'dropdown',
                  data:[
                    {
                      label:'删除',
                      value:'1',
                      auth:'merchantFunDelete',// 权限校验
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm(
                        "/merchant/delete/" + params.row.id
                      );
                    }
                  }
                }
              ]
              return this.common.columnsItemRender(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/rsaKeyPlatform/grid',
        searchItems: [],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              this.formItems[0].disabled = false
              this.formItems.forEach((item,index)=>{
                item.type = item.type.replace(/(Text)$/g,'')
              });
              this.formUrl = '/rsaKeyPlatform/save'
              this.routeType = 'add'
              this.formTitle = '添加'
            }
          }
        ],

        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加",
        formShow: false,
        formItems: [
          {
            title: '参数类别',
            name: 'orderSource',
            type: 'input',
            rules: [
              {required: true, message: '请选输入参数类别', trigger: 'change'}
            ],
            value: null,
          },
          {
            title: '数据编码',
            name: 'orderSource',
            type: 'input',
            rules: [
              {required: true, message: '请选输入参数类别', trigger: 'change'}
            ],
            value: null,
          },
          {
            title: '数据值',
            name: 'orderSource',
            type: 'input',
            rules: [
              {required: true, message: '请选输入参数类别', trigger: 'change'}
            ],
            value: null,
          },
          {
            title: '备注',
            name: 'orderSource',
            type: 'textarea',
            rules: [
              {required: true, message: '请选输入参数类别', trigger: 'change'}
            ],
            value: null,
          },
        ],
        formUrl: '/rsaKeyPlatform/save'
      }
    },
    created(){
      this.getMerchantSource()
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      onCopySuccess(){
        this.$Message.success("复制成功")
      },
      onCopyError(){
        this.$Message.error("复制失败")
      },
      closeModal() {
        this.formShow = false;
      },
      // 生成秘钥
      rsaCreate() {
        let params = {
          // vagueMerchantMark: '',
          // columnType: 2,
        }
        let url = '/constant/rsaKey/create'
        this.apiGet(url,params).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              if(item.name=='privateKey'){
                item.value = res.data.privateKey
              }
              if(item.name=='publicKey'){
                item.value = res.data.publicKey
              }
            });
          }else{
            this.$Message.error(res.message)
          }
        })
      },
      // 获取商户来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = this.$store.state.global.merchantSource
          this.formItems[0].data = merchantSource
        })
      },
      // 设置详情页
      setDetail(orderSource){
        this.apiGet('/rsaKeyPlatform/detail/'+orderSource).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              item.value = res.data[item.name]
              // if(item.name=='orderSource'){
              //   item.value = res.data.orderSource
              // }
              // if(item.name=='privateKey'){
              //   item.value = res.data.privateKey
              // }
              // if(item.name=='publicKey'){
              //   item.value = res.data.publicKey
              // }
            });
            console.log(this.formItems)
          }else{
            this.$Message.error(res.message)
          }
        })
      },
    }
  }
</script>
