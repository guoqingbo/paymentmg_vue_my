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
               :title="formTitle">
      <div slot="merchantNameBefore">表单项前插入自定义内容，每一个type后添加Text后缀则展示文本，添加，编辑，详情页面等可共用</div>
      <div slot="merchantNameAfter">表单项后插入自定义内容</div>
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
            label: '订单号',
            type: 'input',
            name: 'orderNo'
          },
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
            label: '开始日期',
            type: 'date',
            name: 'startDate',
            format:'yyyy-MM-dd 00:00:00',
            options:{},
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd 23:59:59',
            options:{},
            value: ''
          },
          {
            label: '支付产品名称',
            type: 'select',
            name: 'payProductCode',
            data: ''
          },
        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              // 请求接口
              this.formUrl = '/rsaKeyPlatform/save'
              this.routeType = 'add'
              this.formTitle = '添加'
            }
          }
        ],

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
            title: '商户简称',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '私钥',
            name: 'privateKey',
            type: 'textarea',
            value: '',
            disabled: false,
            rules: [{ required: true, message: '请输入私钥', trigger: 'blur' },
            ]
          },
          {
            title: '上传营业执照',
            name: 'licenseUrl',
            type: 'uploadFile',
            tip: '建议上传小于2M的png、jpg、jpeg格式的图片',
            accept:'.jpg,.jpeg,.png',
            format:['jpg', 'jpeg', 'png'],
            rules: [{ required: true, message:'请上传上传营业执照', trigger: 'change'}],
            beforeUpload:(params)=>{}
          },
          {
            title: '所在地区',
            name: 'area',
            type: 'area',
            // addrCode: "",
            areaText:"",
            rules: [],
            value:''
          },
          {
            title: '默认推荐支付方式',
            name: 'priority',
            type: 'radio',
            value: 999,
            data:this.common.dic.priority,
            rules: [{ required: true, type:'number', message: '请选择默认推荐支付方式', trigger: 'change' }]
          },
          {
            title: '商户名称',
            name: 'merchantNo',
            value: '',
            type: 'autoComplete',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.formItems,'merchantNo')
              this.common.searchMerchantList(value,arrItem)
            }
          },
          {
            title: '商户类型',
            name: 'merchantType',
            type: 'select',
            data: this.common.dic.merchantType,
            onChange:this.merchantTypeChange,
            rules: [
              {required: true, type: 'number', message: '请选择商户类型', trigger: 'change'}
            ],
            value: 200,
          },
          {
            title: '开始日期',
            type: 'date',
            name: 'startDate',
            format:'yyyy-MM-dd 00:00:00',
            options:{},
            value: ''
          },
        ],
        formUrl: '/rsaKeyMerchant/update'
      }
    },
    computed:{

    },
    created(){
      // 获取支付产品
      this.getPayProduct()
      // 日期限制
      this.checkDate()
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      // 获取支付产品
      getPayProduct(){
        this.$store.dispatch("getPayProduct").then(res=>{
          this.common.setArrItem(this.searchItems,'payProductCode',{
            data:res
          })
        })
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.common.getArrItem(this.searchItems,'startDate')
        let endDateItem = this.common.getArrItem(this.searchItems,'endDate')
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.common.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.common.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      },
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
