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
            key: 'accType',
            sortable: true,
          },
          {
            title: '渠道名称',
            key: 'useFlag',
            sortable: true,
          },
          {
            title: '渠道性质',
            key: 'remark',
            sortable: true,
          },
          {
            title: '签约状态',
            key: 'remark',
            sortable: true,
          },
          {
            title: '创建时间',
            key: 'action',
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
                      path: "/merchantAdd?lookId=" + params.row.id
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchantAdd",
                      query: { editId: params.row.id }
                    });
                  }
                },
                {
                  title: "添加渠道产品",
                  action: () => {
                    this.$router.push({
                      path: "/channelProductAdd",
                      query: { id: params.row.id }
                    });
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: 'admin/sysRole/grid',
        searchItems:[],
        hannleItems: [
          {
            title: '新增渠道',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/channelAdd");
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
