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
            title: '渠道编码',
            key: 'chanelNo',
            sortable: true,
          },
          {
            title: '渠道产品编码吗',
            key: 'chanelProductNo',
            sortable: true,
          },
          {
            title: '渠道产品名称',
            key: 'chanelProductName',
            sortable: true,
          },
          {
            title: '渠道产品状态',
            key: 'chanelProductStatus',
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
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: 'admin/sysRole/grid',
        searchItems: [
          {
            label: '渠道编码',
            type: 'input',
            name: 'chanelNo'
          },
          {
            label: '渠道产品编码',
            type: 'input',
            name: 'chanelProductNo'
          },
          {
            label: '渠道产品状态',
            type: 'select',
            name: 'chanelProductStatus',
            data:[{label:'可用',value:1},{label:'不可用',value:0}]
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
