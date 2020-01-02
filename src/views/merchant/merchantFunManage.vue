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
            title: '应用来源',
            key: 'orderSource',
          },
          {
            title: '来源商户标识',
            key: 'merchantCode',
          },
          {
            title: '商户名称',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '功能',
            key: 'merchantType',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("merchantType",params.row.merchantType))
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
                      auth:'merchantFunDetail',// 权限校验
                    },
                    {
                      label:'编辑',
                      value:'2',
                      auth:'merchantFunEdit',// 权限校验
                    },
                    {
                      label:'删除',
                      value:'3',
                      auth:'merchantFunDelete',// 权限校验
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      // 详情
                      this.$router.push({
                        path: "/merchant/merchantFunAddEditDetail/detail",
                        query: { id: params.row.id,routeType:"detail"}
                      });
                    }else if(value == 2){
                      // 编辑
                      this.$router.push({
                        path: "/merchant/merchantFunAddEditDetail/edit",
                        query: {id: params.row.id}
                      });
                    }else if(value == 3){
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm(
                        "/merchant/delete/" + params.row.id
                      );
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
        url: '/merchant/grid',
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
            label: '应用来源',
            type: 'select',
            name: 'orderSource',
            data:[],
            render: (h, params) => {

            }
          },
          {
            label: 'PAYID',
            type: 'input',
            name: 'PAYID'
          },
        ],
        hannleItems: [
          {
            title: '添加功能',
            auth:'merchantFunAdd',// 权限校验
            icon: 'md-add',
            callback: () => {
              this.$router.push("/merchant/merchantFunAddEditDetail/add");
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
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
    }
  }
</script>
