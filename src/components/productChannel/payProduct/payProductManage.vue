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
             mode="mode"></confirm>
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
            key: 'accType',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'useFlag',
            sortable: true,
          },
          {
            title: '客户类型',
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
                  title: "删除",
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/product/parkInfo/del?id=" + params.row.id
                    );
                  }
                }
              ];
              console.log(this.common)
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
            label: '商户号',
            type: 'input',
            name: 'roleName'
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
            title: '添加商户',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchantAdd");
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
