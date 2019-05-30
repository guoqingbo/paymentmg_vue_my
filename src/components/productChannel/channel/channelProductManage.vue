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
  import { apiGet, apiPost } from '@/fetch/api'
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
            title: '渠道编码',
            key: 'channelCode',
            sortable: true,
          },
          {
            title: '渠道产品编码',
            key: 'channelProductCode',
            sortable: true,
          },
          {
            title: '渠道产品名称',
            key: 'channelProductName',
            sortable: true,
          },
          {
            title: '渠道费率',
            key: 'feeRate',
            sortable: true,
          },
          {
            title: '渠道产品状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("status",params.row.status))
            }
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
                      path: "/productChannel/channel/channelProductAddEditDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/channel/channelProductAddEditDetail",
                      query: { id: params.row.id,channelId: params.row.channelId}
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
                      "/channelProduct/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/channelProduct/grid',
        searchItems: [
          {
            label: '渠道编码',
            type: 'input',
            name: 'channelCode'
          },
          {
            label: '渠道产品编码',
            type: 'input',
            name: 'channelProductCode'
          },
          {
            label: '渠道产品状态',
            type: 'select',
            name: 'status',
            data:this.common.dic.status
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
