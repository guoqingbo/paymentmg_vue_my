<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          width="1300"
          :params="params"
          :apiPrefix="apiPrefix"
          :searchItems="searchItems"
          @beforeSubmit="beforeSubmit"
          :hannleItems="hannleItems"></list>
    <!--    <confirm ref="confirmModel"-->
    <!--             :content="content"-->
    <!--             :sucessMsg="sucessMsg"-->
    <!--             :mode="mode"></confirm>-->
  </div>
</template>
<script>
    import list from '@/components/global/list'
    // import confirm from '@/components/global/confirm'
    export default {
        data() {
            return {
                apiPrefix:this.common.config.apiReconciliation,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '商户号',
                        key: 'merchantNo',

                    },
                    {
                        title: '商户名称',
                        key: 'merchantName',
                    },
                    {
                        title: '交易类型',
                        key: 'tradeType',
                        render:(h,params)=>{
                            let span = h('span',this.filter.turn('tradeType',params.row.tradeType))
                            return span
                        }
                    },
                    {
                        title: '渠道流水号',
                        key: 'thirdPartyNo',
                        // render: (h, params) => {
                        //     return h('span', this.common.formatNumber(params.row.orderAmount))
                        // }
                    },
                    {
                        title: '渠道金额',
                        key: 'thirdPartAmount',
                        render: (h, params) => {
                            return h('span', this.common.formatNumber(params.row.thirdPartAmount))
                        }
                    },
                    {
                        title: '渠道状态',
                        key: 'thirdPartState',
                        render:(h,params)=>{
                            let span = h('span',this.filter.turn('tradeState',params.row.thirdPartState))
                            return span
                        }
                    },
                    {
                        title: '渠道支付时间',
                        key: 'thirdSuccessTime',
                    },
                    {
                        title: '支付流水号',
                        key: 'payNo',
                    },
                    {
                        title: '订单金额',
                        key: 'payAmount',
                        render: (h, params) => {
                            return h('span', this.common.formatNumber(params.row.payAmount))
                        }
                    },
                    {
                        title: '交易状态',
                        key: 'tradeState',
                        render: (h, params) => {
                            let span = h('span',this.filter.turn('tradeState',params.row.tradeState))
                            return span
                        }

                    },
                    {
                        title: '支付时间',
                        key: 'tradeSuccessTime',
                    },
                    {
                        title: '错误代码',
                        key: 'errorCode',
                    },
                    {
                        title: '账不平原因',
                        key: 'errorCodeDesc',
                        render:(h,params)=>{
                            let span = h('span',{
                                style:{
                                    color:'#f00'
                                }
                            },params.row.errorCodeDesc)
                            return span
                        }
                    }
                ],
                params: {
                    // sort: 'modifyTime',
                    // order: 'desc'
                    ...this.$route.query
                },
                url: '/reconStat/fail/detail/list',
                searchItems: [
                    {
                        label: '商户名称',
                        name: 'merchantNo',
                        type: 'autoComplete',
                        value: '',
                        data: [],
                        search: (value) => {
                            this.common.searchMerchantList(value, this.searchItems[0])
                        }
                    },
                ],
                hannleItems: [],
            }
        },
        mounted() {

        },
        components: {list},
        created() {

        },
        methods: {
            // 搜索之前
            beforeSubmit(params) {
                // 拆分商户号
              this.common.splitMerchant(params)
              delete params.merchantName
            },
        }
    }
</script>
