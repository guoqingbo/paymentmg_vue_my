<template>
  <div class="merchant-channel">
    <list ref="gridTable"
          :highlightRow="true"
          :columns="columns"
          :url="url"
          :params="params"
          @beforeSubmit="beforeSubmit"
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
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '商户编号',
            key: 'merchantCode',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '支付产品名称',
            key: 'payProductName',
            sortable: true,
          },
          {
            title: '渠道产品名称',
            key: 'channelProductName',
            sortable: true,
            className:'channel-name',
            render: (h, params) => {
              let array = [
                h('span', params.row.channelProductName),
              ]
              if(params.row.priority > 0){
                array.push(h('span', {class: 'preferred'},'')
                )
              }
              return array
            }

          },
          {
            title: '支付产品代码',
            key: 'payProductCode',
            sortable: true,
          },
          {
            title: '渠道产品状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn('status',params.row.status))
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
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "详情",
                  action: () => {
                    this.$router.push({
                      path: "/merchant/merchantChannelAddEditDetail/detail",
                      query: { id: params.row.id,routeType:'detail'}
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchant/merchantChannelAddEditDetail/edit",
                      query: { id: params.row.id }
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
                      "/merchantChannel/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/merchantChannel/grid',
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
            label: '支付产品名称',
            type: 'select',
            name: 'payProductCode',
            data: ''
          },
          {
            label: '开始日期',
            type: 'date',
            format:'yyyy-MM-dd 00:00:00',
            name: 'startDate',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd 23:59:59',
            value: ''
          },
        ],
        hannleItems: [
          {
            title: '添加渠道信息',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchant/merchantChannelAddEditDetail/add");
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
    created(){
      // 获取支付产品
      this.getPayProduct()
      // 日期限制
      this.checkDate()
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 设置优先路由
      setFirstRoute () {
        let selection = this.$refs.gridTable.selection
        if (selection && selection.id) {
          this.mode = "done";
          this.sucessMsg = "设置优先路由成功！";
          this.content = "确定设置优先路？";
          this.$refs.confirmModel.confirm(
            "/merchantChannel/priority/high/" +  selection.id
          );
        } else {
          this.$Message.warning('请选择一条数据！')
        }
        // this.$refs.gridTable.clearCurrentRow();
      },
      // 弹框成功回掉
      sucessDone () {
        if(this.sucessMsg == "设置优先路由成功！"){
          this.$refs.gridTable.selection = ''
        }
      },
      // 获取支付产品
      getPayProduct(){
        this.$store.dispatch("getPayProduct").then(res=>{
          this.common.setArrItem(this.searchItems,'payProductCode',{
            data:res
          })
        })
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.common.getArrItem(this.searchItems,'startDate')
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
      }
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
    .channel-name{
      .ivu-table-cell{
        overflow:visible;
        position: relative;
        .preferred{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          /*background-color: #f00;*/
          background: url("../../assets/images/merchant/preferred1.png") no-repeat;
          background-size: 100% 100%;
          width: 45px;
          /*height: 20px;*/
          /*line-height: 20px;*/
          padding: 10px;
          text-align: right;
          color: #fff;
        }
      }
    }
  }
</style>
