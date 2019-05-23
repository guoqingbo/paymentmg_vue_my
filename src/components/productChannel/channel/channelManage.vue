<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :params="params"
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
            type:'index',
            sortable: true,
          },
          {
            title: '渠道编码',
            key: 'channelCode',
            sortable: true,
          },
          {
            title: '渠道名称',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '渠道性质',
            key: 'channelType',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("channelType",params.row.channelType))
            }
          },
          {
            title: '签约状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("signStatus",params.row.status))
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
                      path: "/channelAddEditDetail",
                      query: { id: params.row.id,routeType:"detail"},
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/channelAddEditDetail",
                      query: { id: params.row.id },
                    });
                  }
                },
                {
                  title: "添加渠道产品",
                  action: () => {
                    this.$router.push({
                      path: "/channelProductAddEditDetail",
                      query: { channelId: params.row.id,channelName:params.row.channelName }
                    });
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/channel/grid',
        searchItems:[],
        hannleItems: [
          {
            title: '新增渠道',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/channelAddEditDetail");
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    created(){
      console.log($route.name)
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {

    }
  }
</script>
