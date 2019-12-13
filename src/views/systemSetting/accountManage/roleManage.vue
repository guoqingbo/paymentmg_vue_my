<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :apiPrefix="apiPrefix"
          :params="params"
          @beforeSubmit="beforeSubmit"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :apiPrefix="apiPrefix"
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
        apiPrefix:this.common.config.apiUser,
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
          },
          {
            title: '角色说明',
            key: 'remark',
          },
          {
            title: '添加时间',
            key: 'createTime',
            sortable: 'custom',
          },
          {
            title: '操作',
            key: 'action',
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'dropdown',
                  data:[
                    {
                      label:'详情',
                      value:'1',
                    },
                    {
                      label:'编辑',
                      value:'2'
                    },
                    {
                      label:'删除',
                      value:'3'
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      // 详情
                      this.$router.push({
                        path: "/systemSetting/accountManage/roleAddEditDetail/detail",
                        query: { id: params.row.id,routeType:"detail"}
                      });
                    }else if(value == 2){
                      // 编辑
                      this.$router.push({
                        path: "/systemSetting/accountManage/roleAddEditDetail/edit",
                        query: {id: params.row.id}
                      });
                    }else if(value == 3){
                      // 删除
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm("/role/delete", {id:params.row.id},'get');
                    }
                  }
                }
              ]
              return this.common.columnsItemRender(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/role/grid',
        searchItems: [
          // {
          //   label: '商户名称',
          //   type: 'autoComplete',
          //   name: 'merchantName',
          //   data:[],
          //   search: (value)=>{
          //     let arrItem = this.common.getArrItem(this.searchItems,'merchantName')
          //     this.common.searchMerchantList(value,arrItem)
          //   }
          // },
          // {
          //   label: '开始日期',
          //   type: 'date',
          //   name: 'startDate',
          //   format:'yyyy-MM-dd 00:00:00',
          //   options:{},
          //   value: ''
          // },
          // {
          //   label: '结束日期',
          //   type: 'date',
          //   name: 'endDate',
          //   format:'yyyy-MM-dd 23:59:59',
          //   options:{},
          //   value: ''
          // },
        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/systemSetting/accountManage/roleAddEditDetail/add");
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
    created(){

    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){

      }
    }
  }
</script>
