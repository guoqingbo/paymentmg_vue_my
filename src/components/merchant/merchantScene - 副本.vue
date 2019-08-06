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
    <modalForm v-model="formShow"
               :formItems="formItems"
               :url="formUrl"
               :title="formTitle"></modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
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
            title: '场景编号',
            key: 'sceneNo',
            sortable: true,
          },
          {
            title: '场景名称',
            key: 'sceneName',
            sortable: true,
          },
          {
            title: '场景描述',
            key: 'description',
            sortable: true,
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width:90,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/merchantScene/delete/"+params.row.id
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
        url: '/merchantScene/grid',
        searchItems: [
          {
            label: '商户名称',
            name: 'merchantName',
            type: 'autoComplete',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,2)
            }
          },
          {
            label: '商户编号',
            type: 'merchantCode',
            name: 'roleName'
          }
        ],
        hannleItems: [
          {
            title: '添加商户场景',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
            }
          }
        ],

        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加场景",
        formShow: false,
        formItems: [
          {
            title: '商户号',
            name: 'merchantCode',
            rules: [{ required: true, message: '请输入商户号', trigger: 'blur' }]
          },
          {
            title: '商户名称',
            label: '商户名称',
            name: 'merchantName',
            data: [],
            type: 'autoComplete',
            rules: [
              { required: true, message: '请输入商户名称', trigger: 'blur' },
              // { max: 20, message: "商户名称不超过20字符" }
            ],
            search: (value)=>{
              this.searchMerchantListAdd(value,2,"formItems",1)
            },
            value: ""
          },
          {
            title: '场景名称',
            name: 'sceneName',
            type: 'input',
            rules: [{ required: true, message: '请输入场景名称', trigger: 'blur' }]
          },
          {
            title: '场景说明',
            name: 'description',
            type: 'textarea',
            rules: [{ required: true, message: '请输入场景说明', trigger: 'blur' }]
          },
        ],
        formUrl: '/merchantScene/save'
      }
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      // 商户信息模糊查询
      searchMerchantListAdd(keyword,columnType,form,index){
        if(keyword){
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
                  data.push({label:ele.merchantName+"("+ele.merchantCode+")",value:ele.merchantCode})
                })
              }else{
                data = [{label:'暂无数据',value:''}]
              }
              this[form][index].data = data
            }
          })
        }
      },
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
    }
  }
</script>
