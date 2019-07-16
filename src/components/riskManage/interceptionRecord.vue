<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
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
            title: '序号',
            type:'index',
            width:60,
            align:'center'
          },
           {
            title: '订单来源',
            key: 'source',
            sortable: true,
            render:''
          },
          {
            title: '用户标识',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '订单编号',
            key: 'sourceMerchantCode',
            sortable: true,
          },
          {
            title: '拦截规则',
            key: 'createTime',
            sortable: true,
          },
           {
            title: '支付渠道',
            key: 'createTime',
            sortable: true,
          },
           {
            title: '渠道产品',
            key: 'createTime',
            sortable: true,
          },
           {
            title: '拦截时间',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "加入白名单",
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
          {
            label: '用户标识',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '订单编号',
            type: 'input',
            name: 'merchantCode'
          },
          {
            label: '支付渠道',
            type: 'select',
            name: 'source',
            data: ''
          },
          {
            label: '订单来源',
            type: 'select',
            name: 'source',
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
      this.getMerchantSource()
    },
    mounted () {

    },
    components: {list},
    methods: {
      getMerchantSource(){
        // 获取商户来源
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = this.$store.state.global.merchantSource
          this.formItems[0].data = this.searchItems[2].data = merchantSource

          // 表格商户来源转换
          let source={}
          merchantSource.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.columns[3].render = (h, params) => {
            return h('span', source[params.row.source])
          }
        })
      }
    }
  }
</script>
