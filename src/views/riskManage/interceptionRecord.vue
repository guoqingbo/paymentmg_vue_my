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

  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
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
            title: '订单来源',
            key: 'orderSource',
            sortable: true,
            render:''
          },
          {
            title: '用户标识',
            key: 'userSourceNo',
            sortable: true,
          },
          {
            title: '订单编号',
            key: 'orderNo',
            sortable: true,
          },
          {
            title: '拦截规则',
            key: 'ruleDesc',
            sortable: true,
          },
           {
            title: '支付渠道',
            key: 'channelCode',
            sortable: true,
          },
           {
            title: '渠道产品',
            key: 'channelProductCode',
            sortable: true,
            // render: (h, params) => {
            //   this.getChannelProduct(params.row.channelCode)
            //  }
          },
           {
            title: '拦截时间',
            key: 'interceptTime',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width:150,
            align:'center',
            render: (h, params) => {
              if(params.row.status !==0){
                return
              }
              const actions = [
                {
                  title: "加入白名单",
                  auth:'whiteListAdd',
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "加入白名单成功！";
                    this.content = "确定加入白名单？";
                    let param = {
                      id:params.row.id
                    }
                    this.$refs.confirmModel.confirm(
                      "/riskInterceptLog/saveWhiteList/",param
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
        url: '/riskInterceptLog/grid',
        searchItems: [
          {
            label: '用户标识',
            type: 'input',
            name: 'userSourceNo'
          },
          {
            label: '订单编号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '支付渠道',
            type: 'select',
            name: 'channelCode',
            data: ''
          },
          {
            label: '订单来源',
            type: 'select',
            name: 'orderSource',
            data: ''
          },
        ],
        hannleItems: [
        ],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    computed:{

    },
    created(){
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getPayChannel()
      // 获取渠道产品列表
      this.getChannelProduct()
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {
      // 获取订单来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = res
          this.searchItems[3].data = res

          // 表格订单来源转换
          let source={}
          merchantSource.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.columns[1].render = (h, params) => {
            return h('span', source[params.row.orderSource])
          }
        })
      },
      // 获取支付渠道
      getPayChannel(){
        this.$store.dispatch("getPayChannel").then(res=>{
          this.searchItems[2].data = res
          // 表格支付渠道转换
          let source={}
          res.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.columns[5].render = (h, params) => {
            return h('span', source[params.row.channelCode])
          }
        })
      },
      // 获取渠道产品列表
      getChannelProduct(){
        this.$store.dispatch("getChannelProduct").then(res=>{
          let source={}
          res.forEach((ele)=>{
            source[ele.value] = ele.label
          })
          this.columns[6].render = (h, params) => {
            return h('span', source[params.row.channelProductCode])
          }
        })
      },
    }
  }
</script>
