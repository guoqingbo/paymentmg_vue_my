<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :apiPrefix="apiPrefix"
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
            title: '商户名称',
            key: 'merchantName',
          },
          {
            title: '管理员账号',
            key: 'phone',
          },
          {
            title: '账号所有人',
            key: 'accName',
          },
          {
            title: '添加日期',
            key: 'createTime',
            sortable: 'custom',
          },
          {
            title: '状态',
            key: 'accStatus',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("accStatus",params.row.accStatus))
            }
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
                      auth:'merchantMemberDetail'
                    },
                    {
                      label:'编辑',
                      value:'2',
                      auth:'merchantMemberEdit'
                    },
                    {
                      label:'删除',
                      value:'3',
                      auth:'merchantMemberDelete'
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      // 详情
                      this.$router.push({
                        path: "/merchant/merchantMemberAddEditDetail/detail",
                        query: { id: params.row.id,routeType:"detail"}
                      });
                    }else if(value == 2){
                      // 编辑
                      this.$router.push({
                        path: "/merchant/merchantMemberAddEditDetail/edit",
                        query: {id: params.row.id}
                      });
                    }else if(value == 3){
                      // 删除
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm("/admin/delete",{id:params.row.id},'get');
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
        url: '/admin/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.searchItems,'merchantName')
              this.common.searchMerchantList(value,arrItem)
            }
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'beginDate',
            format:'yyyy-MM-dd 00:00:00',
            options:{},
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd 23:59:59',
            options:{},
            value: ''
          },
        ],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            auth:'merchantMemberAdd',
            callback: () => {
              this.$router.push("/merchant/merchantMemberAddEditDetail/add");
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
      // 日期限制
      this.checkDate()
    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.common.getArrItem(this.searchItems,'beginDate')
        let endDateItem = this.common.getArrItem(this.searchItems,'endDate')
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.common.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.common.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      },
    }
  }
</script>
