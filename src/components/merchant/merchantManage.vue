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
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:60,
            align:'center'
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
            sortable: 'custom',
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
                      path: "/merchant/merchantAddEditDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchant/merchantAddEditDetail",
                      query: {id: params.row.id}
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
                      "/merchant/delete/" + params.row.id
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
        url: '/merchant/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,2)
            }
          },
          {
            label: '商户号',
            type: 'autoComplete',
            name: 'merchantCode',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,1)
            }
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'startDate',
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
            title: '添加商户',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchant/merchantAddEditDetail");
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
      // 商户信息模糊查询
      searchMerchantList(keyword,columnType){
        // columnType，1:code查询，2:name查询
        if(keyword && columnType){
          let params = {
            vagueMerchantMark:keyword,
            columnType,
          }
          let url = '/merchant/queryMerchantListByVagueMerchantMark'
          this.apiGet(url,params).then(res=>{
            if(res.status == 200){
              let data = []
              if(res.data.length){
                res.data.forEach(ele=>{
                  if(columnType == 1){
                    // 1:code查询
                    data.push({label:ele.merchantCode,value:ele.merchantCode})
                  }else{
                    // 2:name查询
                    data.push({label:ele.merchantName,value:ele.merchantName})
                  }

                })
              }else{
                data = [{label:'暂无数据',value:''}]
              }
              if(columnType == 1){
                this.searchItems[1].data = data
              }else{
                this.searchItems[0].data = data
              }
            }
          })
        }
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.searchItems[2]
        let endDateItem = this.searchItems[3]
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      },
      // 日期转为时间戳，如果不带时分秒，则存在时差
      formateDateStr(str){
        if(str.length <19){
          str += ' 00:00:00'.substring(10-str.length)
        }
        return str
      }
    }
  }
</script>
