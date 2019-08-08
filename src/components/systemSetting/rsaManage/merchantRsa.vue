<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          @beforeSubmit="beforeSubmit"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :routeType='routeType'
               @input='closeModal'
               @beforeSave='beforeSave'
               :url="formUrl"
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
            title: '商户简称',
            key: 'merchantName',
            // sortable: true,
            align:'center'
          },
          {
            title: '商户号',
            key: 'merchantCode',
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
                    this.formItems.forEach(item=>{
                      item.clipboard=false
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
                    this.formTitle = '修改秘钥'
                    this.routeType = 'modify'
                    this.setDetail(params.row.merchantCode)
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
                        item.clipboard=true
                        item.type='textareaText'
                      }else if(item.type=='btn'){
                        item.disabled=true
                        item.value=null
                        item.desc=''
                      }
                    });
                    this.formTitle = '查看秘钥'
                    this.routeType = 'detail'
                    this.setDetail(params.row.merchantCode)
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
        url: '/rsaKeyMerchant/grid',
        searchItems: [
          {
            label: '商户简称',
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              this.common.searchMerchantList(value,this.searchItems[0])
            }
          },
          {
            label: '商户编号',
            type: 'hidden',
            name: 'merchantCode',
            data:[],
          },
        ],
        hannleItems: [],

        mode: "",
        content: "",
        sucessMsg: "",
        detail: {
          merchantName: '',
          merchantCode: '',
          privateKey: '',
          publicKey: '',
        },
        formTitle:"添加关联商户",
        formShow: false,
        formItems: [
          {
            title: '商户简介',
            name: 'merchantName',
            type: 'input',
            disabled: true,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '私钥',
            label: '私钥',
            name: 'privateKey',
            type: 'textarea',
            clipboard: true,
            clipboardText: '复制私钥',
            value: '',
            disabled: true,
            rules: [{ required: true, message: '请输入私钥', trigger: 'blur' },
            ]
          },
          {
            title: '公钥',
            label: '公钥',
            name: 'publicKey',
            type: 'textarea',
            clipboard: true,
            clipboardText: '复制公钥',
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
        formUrl: '/rsaKeyMerchant/update'
      }
    },
    computed:{

    },
    created(){

    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 弹框保存之前
      beforeSave(params){
        if(this.routeType=='modify')
        this.$set(params, "merchantCode", this.detail.merchantCode);
      },
      // 关闭弹框
      closeModal() {
        this.formShow = false;
      },
      // 设置详情页
      setDetail(merchantCode){
        this.apiGet('/rsaKeyMerchant/detail/'+merchantCode).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              if(item.name=='merchantName'){
                item.value = res.data.merchantName
              }
              if(item.name=='privateKey'){
                item.value = res.data.privateKey
              }
              if(item.name=='publicKey'){
                item.value = res.data.publicKey
              }
            });
            this.detail.merchantCode = res.data.merchantCode;
          }else{
            this.$Message.error(res.message)
          }
        })
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
    }
  }
</script>
