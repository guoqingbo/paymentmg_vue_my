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
            width:60,
            align:'center'
          },
          {
            title: '规则编号',
            key: 'merchantCode',
          },
          {
            title: '订单来源',
            key: 'source',
            render:''
          },
          {
            title: '支付渠道',
            key: 'sourceMerchantCode',
          },
          {
            title: '渠道产品',
            key: 'createTime',
          },
          {
            title: '单笔交易限额',
            key: 'createTime',
          },
          {
            title: '单日累计交易限额',
            key: 'createTime',
          },
          {
            title: '状态',
            key: 'createTime',
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                  {
                  title: "修改",
                  action: () => {
                    this.formShow = true
                  }
                },
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/merchantRelation/delete/" + params.row.id
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
        url: '/merchantRelation/grid',
        searchItems: [

        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
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
            name: 'source',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
           {
            title: '支付渠道',
            name: 'payChannel',
            type: 'select',
            data: '',
            onChange:this.getChannelProduct,
            rules: [{ required: true, message: '请选择支付渠道', trigger: 'change' }]
          },
           {
            title: '渠道支付产品',
            name: 'channelPayProduct',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '单笔限额（元）',
            name: 'sourceMerchantCode',
            type: 'input',
            rules: [{ required: true, message: '请输入来源商户号', trigger: 'blur' },
              {max: 20, message: "来源商户号不超过20字符", trigger: 'blur'}]
          },
          {
            title: '单日累计限额（元）',
            name: 'merchantCode',
            type: 'input',
            rules: [{ required: true, message: '请输入支付中心商户号', trigger: 'blur' },
              {max: 20, message: "支付中心商户号不超过20字符", trigger: 'blur'}]
          },
          {
            title: '是否启用',
            name: 'isForbid',
            type: 'radio',
            data: [{label:'启用',value:'1'},{label:'禁用',value:'0'}],
            rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
        ],
        formUrl: '/merchantRelation/save'
      }
    },
    computed:{

    },
    created(){
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getChannel()

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
            return h('span', source[params.row.source])
          }
        })
      },
      // 获取支付渠道
      getChannel(){
        this.$store.dispatch("getChannel").then(res=>{
          this.formItems[1].data = res
        })
      },
      // 根据支付产品获取渠道产品
      getChannelProduct(e){
        if(!e){
          return
        }
        this.apiGet('/channelProduct/payProductId/'+e).then(res=>{
          let channelProduct = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              channelProduct.push({
                value:ele.id,
                label:ele.channelProductName
              })
            })
          }
          this.formItems[2].data = channelProduct
        })
      },
    }
  }
</script>
