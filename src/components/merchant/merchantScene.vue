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
    <modalForm v-model="formShow"
               :formItems="formItems"
               @beforeSave="beforeSave"
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
              let arrItem = this.common.getArrItem(this.searchItems,'merchantName')
              this.common.searchMerchantList(value,arrItem)
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
            title: '商户名称',
            name: 'merchantName',
            data: [],
            type: 'autoComplete',
            rules: [
              { required: true, message: '请输入商户号', trigger: 'blur' },
              // { max: 20, message: "商户名称不超过20字符" }
            ],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.formItems,'merchantName')
              this.common.searchMerchantList(value,arrItem)
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
      // 谭宽保存之前
      beforeSave(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params,this.formItems)
      },
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params,this.searchItems)
      },
    }
  }
</script>
