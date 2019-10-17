<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          @beforeSubmit="beforeSubmit"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  export default {
    data () {
      return {
        columns: [
          {
            title: '订单编号',
            key: 'merchantName',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算总金额（元）',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '业务结算流水号',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '子订单编号',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '业务商户编号',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '渠道商户编号',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算金额（元）',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '费用类型',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算状态',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '备注',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '失败原因',
            key: 'merchantCode',
            // sortable: true,
            align:'center'
          },
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/rsaKeyMerchant/grid',
        searchItems: [
          {
            label: '订单编号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '子订单编号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '全部状态',
            type: 'select',
            name: 'payProductCode',
            data: ''
          },
        ],
        hannleItems: [

        ]
      }
    },
    computed:{

    },
    created(){
      // 获取支付产品
      this.getPayProduct()
    },
    mounted () {

    },
    components: {list},
    methods: {
      // 获取支付产品
      getPayProduct(){
        this.$store.dispatch("getPayProduct").then(res=>{
          this.common.setArrItem(this.searchItems,'payProductCode',{
            data:res
          })
        })
      },
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
      },
    }
  }
</script>
