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
            key: 'merchantCode',
          },
          {
            title: '企业码',
            key: 'merchantCode',
          },
          {
            title: '应用名称',
            key: 'merchantCode',
          },
          {
            title: '应用来源',
            key: 'merchantCode',
            // render: (h, params) => {
            //   return h('span', this.filter.turn("merchantType",params.row.merchantType))
            // }
          },
          {
            title: 'PAYID',
            key: 'merchantCode',
          },
          {
            title: '应用状态',
            key: 'status',
            render: (h, params) => {
              return h('span', this.filter.turn("applyStatus",params.row.status))
            }
          },
          {
            title: '应用功能',
            key: 'status',
            render: (h, params) => {
              return h('span', this.filter.turn("applyStatus",params.row.status))
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
                  action: () => {
                    this.$router.push({
                      path: "/merchant/applyManageDetail",
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
              let arrItem = this.common.getArrItem(this.searchItems,'merchantName')
              this.common.searchMerchantList(value,arrItem)
            }
          },
          {
            label: '商户来源',
            type: 'select',
            name: 'source',
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
            name: 'source',
            data: this.common.dic.applyStatus
          },
        ],
        hannleItems: [
          {
            title: '添加应用',
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
      // 获取商户来源
      this.getMerchantSource()
    },
    components: {list,confirm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 获取商户来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = res
          this.common.setArrItem(this.searchItems,'source',{data:res,})

          // 表格商户来源转换
          // let source={}
          // merchantSource.forEach(ele=>{
          //   source[ele.value] = ele.label
          // })
          // this.common.setArrItem(this.columns,'key=source',{
          //   render:(h, params) => {
          //     return h('span', source[params.row.source])
          //   }
          // })
        })
      },
    }
  }
</script>
