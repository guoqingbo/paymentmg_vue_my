<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          @beforeSubmit="beforeSubmit"
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
            width:70,
            align:'center'
          },
          {
            title: '商户名称',
            key: 'merchantName',
          },
          {
            title: '商户号',
            key: 'merchantNo',
          },
          {
            title: '企业码',
            key: 'corpCode',
          },
          {
            title: '应用名称',
            key: 'appName',
          },
          {
            title: '应用来orderSource源',
            key: '',
            render: (h, params) => {

            }
          },
          {
            title: 'PAYID',
            key: 'payId',
          },
          {
            title: '应用状态',
            key: 'appStatus',
            render: (h, params) => {
              let array = []
              let color=''
              if(params.row.appStatus == 0){
                color='#f90'
              }else if(params.row.appStatus == 1){
                color='#f00'
              }else if(params.row.appStatus == 2){
                color='#2b85e4'
              }
              let style = {
                backgroundColor:color,
                fontSize:'16px',
                width:'10px',
                height:'10px',
                display:'inline-block',
                borderRadius:'10px',
                marginRight:'8px'
              }
              array.push(h('span', {style}))
              array.push(h('span', this.filter.turn("appStatus",params.row.appStatus)))
              return array
            }
          },
          {
            title: '功能状态',
            key: 'functionStatus',
            render: (h, params) => {
              let array = []
              let color=''
             if(params.row.functionStatus == 0){
               color='#f00'
              }else if(params.row.functionStatus == 1){
               color='#2b85e4'
              }
              let style = {
                backgroundColor:color,
                fontSize:'16px',
                width:'10px',
                height:'10px',
                display:'inline-block',
                borderRadius:'10px',
                marginRight:'8px'
              }
              array.push(h('span', {style}))
              array.push(h('span', this.filter.turn("functionStatus",params.row.functionStatus)))
              return array
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
          },
          {
            title: '操作',
            key: 'action',
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "管理",
                  marginRight:'30px',
                  auth:'applyManageDetail',
                  action: () => {
                    // this.$router.push({
                    //   path: "/merchant/applyManageDetail",
                    //   query: {id: params.row.id}
                    // });

                    // 新窗口打开
                    let href = this.$router.resolve({
                        path: "/merchant/applyManageDetail",
                        query: {id: params.row.id}
                    }).href;
                    window.open(href, '_blank');
                  }
                },
                {
                  title: "删除",
                  color:"#666",
                  auth:'applyDelete',
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/merchantApp/delete/" + params.row.id,
                      {},
                      'get'
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
        url: '/merchantApp/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantNo',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.searchItems,'merchantNo')
              this.common.searchMerchantList(value,arrItem)
            }
          },
          {
            label: '应用来源',
            type: 'select',
            name: 'orderSource',
            data: ''
          },
          {
            label: 'PAYID',
            type: 'input',
            name: 'payId',
          },
          {
            label: '应用状态',
            type: 'select',
            name: 'appStatus',
            data: this.common.dic.appStatus
          },
        ],
        hannleItems: [
          {
            title: '添加应用',
            auth:'applyAdd',auth:'applyAdd',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchant/applyAdd");
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
      // 获取应用来源
      this.getMerchantSource()
    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 获取应用来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = res
          this.common.setArrItem(this.searchItems,'orderSource',{data:res,})

          // 表格商户来源转换
          let source={}
          merchantSource.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.common.setArrItem(this.columns,'key=orderSource',{
            render:(h, params) => {
              return h('span', source[params.row.orderSource])
            }
          })
        })
      },
    }
  }
</script>
