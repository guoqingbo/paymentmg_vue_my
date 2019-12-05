<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          @beforeSubmit="beforeSubmit"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :routeType='routeType'
               @input='closeModal'
               @beforeSave='beforeSave'
               :url="formUrl"
               :title="formTitle">
    </modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    components: {list,confirm,modalForm},
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '名称',
            key: 'merchantCode',
            sortable: true,
          },
          {
            title: '唯一编码',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '前端url',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '接口url',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '是否加入自定义',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '权限类型',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '层级深度',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '添加时间',
            key: 'createTime',
            sortable: 'custom',
          },
          {
            title: '操作',
            key: 'action',
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'select',
                  data:[
                    {
                      label:'添加',
                      value:'1',
                    },
                    {
                      label:'编辑',
                      value:'2'
                    },
                    {
                      label:'删除',
                      value:'3'
                    }
                  ],
                  value:"",
                  onChange:(value)=>{
                    if(value == 1){
                      // 详情
                      this.routeType = 'detail'
                      this.openPop(params.row)
                    }else if(value == 2){
                      // 编辑
                      this.routeType = 'edit'
                      this.openPop(params.row)
                    }else if(value == 3){
                      // 删除
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm("/merchant/delete/" + params.row.id);
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
        url: '/merchant/grid',
        searchItems: [
          // {
          //   label: '商户名称',
          //   type: 'autoComplete',
          //   name: 'merchantName',
          //   data:[],
          //   search: (value)=>{
          //     let arrItem = this.common.getArrItem(this.searchItems,'merchantName')
          //     this.common.searchMerchantList(value,arrItem)
          //   }
          // },
          // {
          //   label: '开始日期',
          //   type: 'date',
          //   name: 'startDate',
          //   format:'yyyy-MM-dd 00:00:00',
          //   options:{},
          //   value: ''
          // },
          // {
          //   label: '结束日期',
          //   type: 'date',
          //   name: 'endDate',
          //   format:'yyyy-MM-dd 23:59:59',
          //   options:{},
          //   value: ''
          // },
        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              this.formItems.forEach(item=>{
                item.type=item.type.replace(/(Text)$/,'')
              });
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

        formTitle:"添加权限",
        formShow: false,
        formItems: [
          {
            title: '名称',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '名称',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '碓一编码',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '前端URL',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '接口URL',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '是否加入自定义',
            name: 'priority',
            type: 'radio',
            value: 999,
            data:this.common.dic.priority,
            rules: [{ required: true, type:'number', message: '请选择默认推荐支付方式', trigger: 'change' }]
          },
          {
            title: '排序',
            name: 'merchantName',
            type: 'input',
            disabled: false,
            data: '',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '功能类别',
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
            title: '层级深度',
            name: 'merchantType',
            type: 'select',
            data: this.common.dic.merchantType,
            onChange:this.merchantTypeChange,
            rules: [
              {required: true, type: 'number', message: '请选择商户类型', trigger: 'change'}
            ],
            value: 200,
          },
        ],
        formUrl: '/rsaKeyMerchant/update'
      }
    },
    mounted () {

    },
    created(){

    },
    methods: {
      // 打开弹框
      openPop(item){
        this.formShow = true
        this.formItems.forEach(item=>{
          item.value=''
        });
        if(this.routeType == 'edit'){
          this.formTitle = '修改'
          this.setDetail(item.id)
        }else if(this.routeType == 'add'){
          this.formTitle = '添加'
        }
      },
      // 设置详情页
      setDetail(merchantCode){
        this.apiGet('/rsaKeyMerchant/detail/'+merchantCode).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              item.value = res.data[item.name]
            });
            this.detail.merchantCode = res.data.merchantCode;
          }else{
            this.$Message.error(res.message)
          }
        })
      }
    }
  }
</script>
