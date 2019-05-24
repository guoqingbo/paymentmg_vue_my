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
            title: '商户号',
            key: 'merchantCode',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '商户类型',
            key: 'merchantType',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("merchantType",params.row.merchantType))
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
                      path: "/merchantAddEditDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchantAddEditDetail",
                      query: { id: params.row.id,routeType:"edit" }
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
                      "/merchant/merchant/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/merchant/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '商户号',
            type: 'input',
            name: 'merchantCode'
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'startTime',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endTime',
            value: ''
          },
        ],
        hannleItems: [
          {
            title: '添加商户',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchantAddEditDetail");
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
