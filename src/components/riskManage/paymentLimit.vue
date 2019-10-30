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
               @beforeSave="beforeSave"
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
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '规则编号',
            key: 'ruleNo',
          },
          {
            title: '订单来源',
            key: 'orderSource',
            render:''
          },
          {
            title: '支付渠道',
            key: 'channelName',
          },
          {
            title: '渠道产品',
            key: 'channelProductName',
          },
          {
            title: '单笔交易限额',
            key: 'singleLimit',
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.singleLimit))
            }
          },
          {
            title: '单日累计交易限额',
            key: 'dayLimit',
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.dayLimit))
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('span', this.filter.turn('payLimitStatus',params.row.status))
            }
          },
          {
            title: '操作',
            key: 'action',
            width:120,
            align:'center',
            render: (h, params) => {
              const actions = [
                  {
                  title: "修改",
                  action: () => {
                    this.formTitle = '修改'
                    this.formShow = true
                    this.detail = params.row
                    this.formItems[0].disabled = true
                    this.formItems[1].disabled = true
                    this.formItems[2].disabled = true
                    this.setDetail()
                  }
                },
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/riskPayLimit/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/riskPayLimit/grid',
        searchItems: [

        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              // 清空详情
              this.detail = ''
              this.formTitle = '添加'
              this.formItems[0].disabled = false
              this.formItems[1].disabled = false
              this.formItems[2].disabled = false
              this.setDetail()
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
            title: '订单来源',
            name: 'orderSource',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择订单来源', trigger: 'change' }]
          },
           {
            title: '支付渠道',
            name: 'channelCode',
            type: 'select',
            data: '',
            onChange:this.getChannelProduct,
            rules: [{ required: true, message: '请选择支付渠道', trigger: 'change' }]
          },
           {
            title: '渠道支付产品',
            name: 'channelProductCode',
            type: 'select',
            data: '',
            rules: [{ required: true,message: '请选择渠道支付产品', trigger: 'change' }]
          },
          {
            title: '单笔限额（元）',
            name: 'singleLimit',
            type: 'input',
            rules: [{required: true,validator: this.validateLimit, trigger: "blur"},
              // {max: 20, message: "单笔限额不超过20字符", trigger: 'blur'}
            ],
            value:'',
          },
          {
            title: '单日累计限额（元）',
            name: 'dayLimit',
            type: 'input',
            rules: [{required: true,validator: this.validateLimit, trigger: "blur"},
              // {max: 20, message: "单日累计限额不超过20字符", trigger: 'blur'}
            ],
            value:'',
          },
          {
            title: '是否启用',
            name: 'status',
            type: 'radio',
            data: this.common.dic.payLimitStatus,
            value:0,
            rules: [{ required: false, type:'number'}]
          },
        ],
        formUrl: '/riskPayLimit/saveOrUpdate',
        detail:'',
      }
    },
    computed:{

    },
    created(){
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getPayChannel()

    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
       // 获取订单来源
      getMerchantSource(){

        this.$store.dispatch("getMerchantSource").then(res=>{
          this.formItems[0].data = res
          // 表格商户来源转换
          let source={}
          res.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.columns[2].render = (h, params) => {
            return h('span', source[params.row.orderSource])
          }
        })
      },
      // 获取支付渠道
      getPayChannel(){
        this.$store.dispatch("getPayChannel").then(res=>{
          this.formItems[1].data = res
        })
      },
      // 根据支付渠道获取渠道产品
      getChannelProduct(e){
        if(!e){
          return
        }
        this.apiGet('/riskPayLimit/channelProduct/list',{channelCode:e}).then(res=>{
          let channelProduct = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              channelProduct.push({
                value:ele.channelProductCode,
                label:ele.channelProductName
              })
            })
          }
          this.formItems[2].data = channelProduct
        })
      },
      // 单笔交易限额、单日累计交易限额校验
      validateLimit(rule, value, callback) {
        // 单笔限额
        let message = ''
        let singleLimit = ''
        let dayLimit = ''
        if(rule.field=="singleLimit"){
          singleLimit = value
          dayLimit = this.formItems[4].value
          message = '请输入单笔限额'
        }
        // 单日累计
        if(rule.field=="dayLimit"){
          singleLimit = this.formItems[3].value
          dayLimit = value
          message = '请输入单日累计限额'
        }
        let regexp = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
        if (rule.required && !value) {
          callback(new Error(message))
        } else if (value <= 0 || value >= 100000000) {
          callback(new Error('请输入大于0小于1亿的数'))
        } else if (!(regexp.test(value))) {
          callback(new Error('数据格式不正确！'))
        }else if (singleLimit - dayLimit > 0) {
          callback(new Error('单笔限额不得大于单日累计限额'))
        } else {
          callback()
        }
      },
      // 设置详情页
      setDetail(){
        this.formItems.forEach((ele,index)=>{
          ele.value = this.detail[ele.name]
          // 新增时默认是否启用为停用
          if(ele.name == 'status' && typeof this.detail[ele.name] == 'undefined'){
            ele.value = 0
          }
        })
        // 获取渠道支付产品
        if(this.detail.channelCode){
          this.getChannelProduct(this.detail.channelCode)
        }
      },
      // 保存提交之前
      beforeSave(params){
        if(this.detail.id){
          params.id = this.detail.id
        }
      }
    }
  }
</script>
