<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          @beforeSubmit="beforeSubmit"
          @afterSubmit="afterSubmit"
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
            type:'selection',
            width:50,
            align:'center'
          },
          {
            title: '订单编号',
            key: 'orderNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算总金额（元）',
            key: 'splitAmount',
            // sortable: true,
            align:'center'
          },
          {
            title: '业务结算流水号',
            key: 'serialNum',
            // sortable: true,
            align:'center'
          },
          {
            title: '子订单编号',
            key: 'subOrderNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '业务商户编号',
            key: 'subMerchantNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '渠道商户编号',
            key: 'subMerchantSourceNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算金额（元）',
            key: 'amount',
            // sortable: true,
            align:'center'
          },
          {
            title: '费用类型',
            key: 'splitType',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.filter.turn("splitType",params.row.splitType))
            }
          },
          {
            title: '结算状态',
            key: 'status',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.filter.turn("busiStatus",params.row.status))
            }
          },
          {
            title: '备注',
            key: 'remark',
            // sortable: true,
            align:'center'
          },
        ],
        params: {
          sort:'modifyTime',
          order:'desc',
          outBatchNo:this.$route.query.outBatchNo,
          merchantNo:this.$route.query.merchantNo,
        },
        url: '/splitCustomerOrderDetail/grid',
        searchItems: [
          {
            label: '订单编号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '子订单编号',
            type: 'input',
            name: 'subOrderNo'
          },
          {
            label: '全部状态',
            type: 'select',
            name: 'status',
            data: this.common.dic.busiStatus
          },
        ],
        hannleItems: [
          {
            title: '批量提交',
            callback: () => {
              let selection = this.$refs.gridTable.selection
              if(!selection.length){
                this.$Message.info('请先选择订单')
                return
              }
              let serialNums = []
              selection.forEach(ele=>{
                serialNums.push(ele.serialNum)
              })
              let url = '/splitCustomerOrderDetail/splitApply'
              let params = {
                outBatchNo:this.$route.query.outBatchNo,
                merchantNo:this.$route.query.merchantNo,
                serialNums:serialNums.join(",")
              }
              this.apiPost(url,params).then(res=>{
                if(res.success){
                  this.$Message.info(res.message||'操作成功')
                  // 刷新列表
                  this.$store.dispatch('getList')
                }else{
                  this.$Message.info(res.message)
                }
              })
            }
          },
        ]
      }
    },
    computed:{

    },
    created(){
      // 更新位置占位符
      this.$store.dispatch('setBreadcrumbListAction', ['业务分账查询', '查看明细'])
    },
    mounted () {

    },
    components: {list},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
      },
      // 结算中1、结算成功2则不可选中
      afterSubmit(res){
        if(res.success){
          res.data.rows.forEach(ele=>{
            if(ele.status == 1 || ele.status == 2){
              this.$set(ele, '_disabled',true)
              // this.$set(ele, '_checked',true)
            }else{
              ele._disabled = false
            }
          })
          // this.$store.state.list.res = {...res}
        }
      }

    }
  }
</script>
