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
            title: '支付产品名称',
            key: 'payProductName',
            sortable: true,
          },
          {
            title: '支付产品代码',
            key: 'payProductCode',
            sortable: true,
          },
          {
            title: '产品说明',
            key: 'remark',
            sortable: true,
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "详情",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/payProduct/payProductAddEditDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/payProduct/payProductAddEditDetail",
                      query: { id: params.row.id }
                    });
                  }
                },
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/payProduct/delete/"+ params.row.id
                    );
                  }
                },
                {
                  title: "添加渠道产品",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/payProduct/payProductChannelAddDetail",
                      query: { payProductId: params.row.id,payProductName:params.row.payProductName }
                    });
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
        url: '/payProduct/grid',
        searchItems: [
        ],
        hannleItems: [
          {
            title: '新增支付产品',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/productChannel/payProduct/payProductAddEditDetail");
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {

    }
  }
</script>
