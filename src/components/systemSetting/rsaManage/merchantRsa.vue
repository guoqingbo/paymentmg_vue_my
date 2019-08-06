<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :type='type'
               @input='closeModal'
               :btn='btn'
               :url="formUrl"
               :title="formTitle"></modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalRWX'
  export default {
    data () {
      return {
        btn:{
          text: '生成秘钥',
          cb: null,
          desc: '',
        },
        type: 'r',
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
            sortable: true,
          },
          {
            title: '商户号',
            key: 'merchantNo',
            sortable: true,
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
                      if(item.type=='inputText'){
                        item.type='input'
                      }else if(item.type=='textareaText'){
                        item.type='textarea'
                      }
                    });
                    this.btn.text = "重新生成秘钥"
                    this.btn.cb = this.rsaCreate
                    this.btn.desc = '重新生成秘钥可能导致支付错误，请谨慎操作！'
                    this.formTitle = '修改'
                    this.type = 'w'
                    this.setDetail(params.row.merchantNo)
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
                      }
                    });
                    this.btn.text = null
                    this.btn.cb = null
                    this.btn.desc = ''
                    this.formTitle = '查看'
                    this.type = 'r'
                    this.setDetail(params.row.merchantNo)
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
        url: '/api/admin/rsaKeyMerchant/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantNa',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,2)
            }
          },
          {
            label: '商户编号',
            type: 'hidden',
            name: 'merchantNo',
            data:[],
          },
        ],
        hannleItems: [],
        
        mode: "",
        content: "",
        sucessMsg: "",

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
            name: 'rsa0',
            type: 'privateKey',
            value: '',
            disabled: true,
            rules: [{ required: true, message: '请输入私钥', trigger: 'blur' },
            ]
          },
          {
            title: '公钥',
            name: 'publicKey',
            type: 'textarea',
            disabled: true,
            value: '',
            rules: [{ required: true, message: '请输入公钥', trigger: 'blur' },
            ]
          }
        ],
        formUrl: '/api/admin/rsaKeyMerchant/updatemerchantNo'
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
      closeModal() {
        this.formShow = false;
      },
      // 设置详情页
      setDetail(merchantNo){
        this.apiGet('/api/admin/rsaKeyMerchant/'+merchantNo).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              if(item.name=='merchantName'){
                item.value = res.merchantName
              }
              if(item.name=='privateKey'){
                item.value = res.privateKey
              }
              if(item.name=='publicKey'){
                item.value = res.publicKey
              }
            });
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
        let url = '/api/admin/rsaKey/create'
        this.apiGet(url,params).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              if(item.name=='privateKey'){
                item.value = res.privateKey
              }
              if(item.name=='publicKey'){
                item.value = res.publicKey
              }
            });
          }else{
            this.$Message.error(res.message)
          }
        })
      },
      // 商户信息模糊查询
      searchMerchantListAdd(keyword,columnType,form,index){
        if(keyword){
          let params = {
            vagueMerchantMark:keyword,
            columnType,
          }
          let url = '/merchant/queryMerchantListByVagueMerchantMark'
          this.apiGet(url,params).then(res=>{
            if(res.status == 200){
              let data = []
              if(res.data.length){
                res.data.forEach(ele=>{
                  data.push({label:ele.merchantName+"("+ele.merchantCode+")",value:ele.merchantCode})
                })
              }else{
                data = [{label:'暂无数据',value:''}]
              }
              this[form][index].data = data
            }
          })
        }
      },
      // 商户信息模糊查询
      searchMerchantList(keyword,columnType){
        // columnType，1:code查询，2:name查询
        if(keyword && columnType){
          let params = {
            vagueMerchantMark:keyword,
            columnType,
          }
          let url = '/merchant/queryMerchantListByVagueMerchantMark'
          this.apiGet(url,params).then(res=>{
            if(res.status == 200){
              let data = []
              if(res.data.length){
                res.data.forEach(ele=>{
                  data.push({label:ele.merchantName+"("+ele.merchantCode+")",value:ele.merchantCode})
                })
              }else{
                data = [{label:'暂无数据',value:''}]
              }
              if(columnType == 1){
                this.searchItems[1].data = data
              }else{
                this.searchItems[0].data = data
              }
            }
          })
        }
      },
    }
  }
</script>
