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
  import { apiGet, apiPost } from '@/fetch/api'
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index'
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
            title: '商户来源',
            key: 'source',
            sortable: true,
            render:''
          },
          {
            title: '来源商户号',
            key: 'sourceMerchantCode',
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
            render: (h, params) => {
              const actions = [
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/merchantRelation/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/merchantRelation/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '商户编号',
            type: 'input',
            name: 'merchantCode'
          },
          {
            label: '商户来源',
            type: 'select',
            name: 'source',
            data: ''
          },
        ],
        hannleItems: [
          {
            title: '添加关联商户',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
            }
          }
        ],

        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加关联商户",
        formShow: false,
        formItems: [
          {
            title: '商户来源',
            name: 'source',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '来源商户号',
            name: 'sourceMerchantCode',
            type: 'input',
            rules: [{ required: true, message: '请输入来源商户号', trigger: 'blur' },
              {max: 20, message: "来源商户号不超过20字符", trigger: 'blur'}]
          },
          {
            title: '支付中心商户号',
            name: 'merchantCode',
            type: 'input',
            rules: [{ required: true, message: '请输入支付中心商户号', trigger: 'blur' },
              {max: 20, message: "支付中心商户号不超过20字符", trigger: 'blur'}]
          }
        ],
        formUrl: '/merchantRelation/save'
      }
    },
    computed:{

    },
    created(){
      this.getMerchantSource()
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      getMerchantSource(){
        // 获取商户来源
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = this.$store.state.global.merchantSource
          this.formItems[0].data = this.searchItems[2].data = merchantSource

          // 表格商户来源转换
          let source={}
          merchantSource.forEach(ele=>{
            source[ele.value] = ele.label
          })
          console.log(source)
          this.columns[3].render = (h, params) => {
            return h('span', source[params.row.source])
          }
        })
      }
    }
  }
</script>
