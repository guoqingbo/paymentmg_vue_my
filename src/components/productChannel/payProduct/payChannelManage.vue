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
            type:'index'
          },
          {
            title: '支付产品代码',
            key: 'payProductCode',
            sortable: true,
          },
          {
            title: '支付产品名称',
            key: 'payProductName',
            sortable: true,
          },
          {
            title: '渠道产品编号',
            key: 'channelProductCode',
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
                      path: "/payProductChannelAddDetail",
                      query: { id: params.row.id,routeType:"detail"}
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
                      "/payProductChannel/delete/" + params.row.id
                    );
                  }
                },
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/payProductChannel/grid',
        searchItems: [
          {
            label: '产品代码',
            type: 'input',
            name: 'payProductCode'
          },
          {
            label: '渠道产品代码',
            type: 'input',
            name: 'channelProductCode'
          },
        ],
        hannleItems: [

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
