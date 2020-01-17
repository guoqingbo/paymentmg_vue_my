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
            sortable: true,
          },
          {
            title: '支付中心商户号',
            key: 'merchantNo',
          },
          {
            title: '功能',
            key: 'merchantType',
            sortable: true,
            render: (h, params) => {
              let arr = []
              let typeMap = params.row.typeMap
              if(typeMap){
                Object.keys(typeMap).forEach(ele=>{
                  arr.push(h('span', {
                    style: {
                      display:'inline-block',
                      borderRadius:'20px',
                      border:'1px solid #ccc',
                      padding:'0 10px',
                      marginRight:'5px'
                    },
                    on: {
                      // click: () => {
                      //
                      // }
                    }
                  },this.filter.turn("funType",ele)+'('+typeMap[ele]+')'))
                })
              }
              return arr
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
                        query: { id: params.row.merchantNo,routeType:"detail"}
                      });
                    }else if(value == 2){
                      // 编辑
                      this.$router.push({
                        path: "/merchant/merchantFunAddEditDetail/edit",
                        query: {id: params.row.merchantNo,routeType:"edit"}
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
          // sort:'modifyTime',
          // order:'desc'
        },
        url: '/configMerchantChannel/grid',
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
    computed:{

    },
    mounted () {

    },
    created(){

    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
    }
  }
</script>
