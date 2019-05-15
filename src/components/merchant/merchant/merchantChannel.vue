<template>
  <div class="merchant-channel">
    <list ref="gridTable"
          :highlightRow="true"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"
             @sucessDone="sucessDone"></confirm>
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
          },
          {
            title: '商户编号',
            key: 'accType',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'useFlag',
            sortable: true,
          },
          {
            title: '支付产品名称',
            key: 'remark',
            sortable: true,
          },
          {
            title: '渠道产品名称',
            key: 'remark',
            sortable: true,
          },
          {
            title: '支付产品代码',
            key: 'remark',
            sortable: true,
          },
          {
            title: '渠道产品状态',
            key: 'remark',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.status(params.row.useFlag))
            }
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
                      path: "/merchantChannelAdd?lookId=" + params.row.id
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchantChannelAdd",
                      query: { editId: params.row.id }
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
                      "/product/parkInfo/del?id=" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: 'admin/sysRole/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'input',
            name: 'roleName'
          },
          {
            label: '支付产品名称',
            type: 'select',
            name: 'useFlag',
            data: this.$store.state.global.payProduct
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'orderStartTime',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'orderEndTime',
            value: ''
          },
        ],
        hannleItems: [
          {
            title: '添加渠道信息',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchantChannelAdd");
            }
          },
          {
            title: '设置优先路由',
            type: 'error',
            callback: () => {
              this.setFirstRoute()
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
      setFirstRoute () {
        let selection = this.$refs.gridTable.selection
        console.log(selection)
        if (selection && selection.id) {
          let id = selection.id
          this.mode = "done";
          this.sucessMsg = "设置优先路由成功！";
          this.content = "确定设置优先路？";
          this.$refs.confirmModel.confirm(
            "/product/parkInfo/del?id=" + id
          );
        } else {
          this.$Message.warning('请选择一条数据！')
        }
        // this.$refs.gridTable.clearCurrentRow();
      },
      sucessDone () {
        if(this.sucessMsg == "设置优先路由成功！"){
          this.$refs.gridTable.selection = ''
        }
      },
    }
  }
</script>
<style lang="scss">
  .merchant-channel{
    .btn-groups {
      .ivu-col{
        width: 150px;
      }
    }
  }
</style>
