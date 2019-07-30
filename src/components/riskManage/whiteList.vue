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
            title: '加入时间',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '操作员',
            key: 'createBy',
            sortable: true,
          },
           {
            title: '解除拦截规则',
            key: 'ruleList',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "取消白名单",
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "取消白名单成功！";
                    this.content = "确定取消白名单？";
                    let param = {
                      orderSource:params.row.orderSource,
                      userSourceNo:params.row.userSourceNo,
                    }
                    this.$refs.confirmModel.confirm(
                      "/riskWhiteList/removeWhiteList",param
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
        url: '/riskWhiteList/grid',
        searchItems: [
          {
            label: '用户标识',
            type: 'input',
            name: 'userSourceNo'
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
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {
      // 获取订单来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = res
          this.searchItems[2].data = merchantSource

          // 表格商户来源转换
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
          this.searchItems[1].data = res
        })
      },
    }
  }
</script>
