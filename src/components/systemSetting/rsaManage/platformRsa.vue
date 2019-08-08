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
               :title="formTitle"></modalForm>
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
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '平台名称',
            key: 'orderSourceName',
            // sortable: true,
            align:'center'
          },
          {
            title: '平台代码',
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
                  title: "编辑",
                  action: () => {
                    this.formShow = true
                    this.formItems.forEach((item,index)=>{
                      if(!index){
                        item.disabled = true;
                      }
                      if(item.type=='inputText'){
                        item.type='input'
                      }else if(item.type=='textareaText'){
                        item.type='textarea'
                      }else if(item.type=='btn'){
                        item.disabled=false
                        item.value='重新生成秘钥'
                        item.desc='重新生成秘钥可能导致支付错误，请谨慎操作！'
                      }
                    });
                    this.formUrl = '/rsaKeyPlatform/update'
                    this.routeType = 'add'
                    this.formTitle = '修改'
                    this.detail = params.row
                    this.setDetail(params.row.orderSource)
                  }
                },
                {
                  title: "查看",
                  action: () => {
                    this.formShow = true
                    this.formItems.forEach(item=>{
                      if(item.type=='input'){
                        item.type='inputText'
                      }else if(item.type=='textarea'){
                        item.type='textareaText'
                      }else if(item.type=='btn'){
                        item.disabled=true
                        item.value='null'
                        item.desc=''
                      }
                    });
                    this.routeType = 'detail'
                    this.formTitle = '查看'
                    this.detail = params.row
                    this.formItems.forEach(item=>{
                      item.value = null
                    })
                    this.setDetail(params.row.orderSource)
                  }
                },
              ];
              return this.common.columnsHandle(h, actions);
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
            title: '添加平台密钥',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              this.formItems.forEach((item,index)=>{
                if(!index){
                  item.disabled = false;
                }else{
                  item.disabled = true;
                }
                if(item.type=='inputText'){
                  item.type='input'
                }else if(item.type=='textareaText'){
                  item.type='textarea'
                }else if(item.type=='btn'){
                  item.disabled=false
                  item.value='生成秘钥'
                  item.desc=''
                }
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
            title: '平台名称',
            name: 'orderSource',
            type: 'select',
            data: [],
            rules: [
              {required: true, message: '请选择平台名称', trigger: 'change'}
            ],
            value: null,
          },
          {
            title: '私钥',
            label: '私钥',
            name: 'privateKey',
            type: 'textarea',
            disabled: true,
            value: '',
            rules: [{ required: true, message: '请输入私钥', trigger: 'blur' },
            ]
          },
          {
            title: '公钥',
            label: '公钥',
            name: 'publicKey',
            type: 'textarea',
            disabled: true,
            value: '',
            rules: [{ required: true, message: '请输入公钥', trigger: 'blur' },
            ]
          },
          {
            title: '',
            name: '',
            type: 'btn',
            disabled: false,
            value: '生成秘钥',
            desc: '',
            cb: this.rsaCreate
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
              if(item.name=='orderSource'){
                item.value = res.data.orderSource
              }
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
    }
  }
</script>
