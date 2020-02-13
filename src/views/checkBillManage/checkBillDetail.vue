<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          @beforeSubmit="beforeSubmit"
          :hannleItems="hannleItems"
          :exportItem="exportItem"></list>
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
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '商户号',
                        key: 'orderTime',

                    },
                    {
                        title: '商户名称',
                        key: 'orderNo',

                    },
                    {
                        title: '交易类型',
                        key: 'payNo',

                    },
                    {
                        title: '渠道流水号',
                        key: 'orderAmount',

                        render: (h, params) => {
                            return h('span', this.common.formatNumber(params.row.orderAmount))
                        }
                    },
                    {
                        title: '渠道金额',
                        key: 'payAmount',

                        render: (h, params) => {
                            return h('span', this.common.formatNumber(params.row.payAmount))
                        }
                    },
                    {
                        title: '渠道状态',
                        key: 'payStatus',
                        render: (h, params) => {
                            return h('span', this.common.formatNumber(params.row.payAmount))
                        }
                    },
                    {
                        title: '渠道支付时间',
                        key: 'merchantName',

                    },
                    {
                        title: '支付流水号',
                        key: 'merchantName',

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
                        key: 'channelName',

                    },
                    {
                        title: '支付时间',
                        key: 'channelName',

                    },
                    {
                        title: '错误代码',
                        key: 'channelName',
                    },
                    {
                        title: '账不平原因',
                        key: 'channelName',
                        render:(h,params)=>{
                            let span = h('span',{
                                style:{
                                    color:'#f00'
                                }
                            },params.row.channelName)
                            return span
                        }
                    }
                ],
                params: {
                    sort: 'modifyTime',
                    order: 'desc'
                },
                url: '/splitSubMerchant/grid',
                searchItems: [
                    {
                        label: '商户名称',
                        name: 'merchantNo',
                        type: 'autoComplete',
                        value: '',
                        data: [],
                        search: (value) => {
                            this.common.searchMerchantList(value, this.searchItems[4])
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

            },
        }
    }
</script>
