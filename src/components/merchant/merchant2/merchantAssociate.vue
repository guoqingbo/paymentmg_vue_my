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
               :title="formTitle"
               json></modalForm>
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
            key: 'accType',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'useFlag',
            sortable: true,
          },
          {
            title: '商户来源',
            key: 'remark',
            sortable: true,
          },
          {
            title: '来源商户号',
            key: 'action',
            sortable: true,
          },
          {
            title: '创建时间',
            key: 'action',
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
                    this.mode = "done";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/product/parkInfo/del?id=" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: 'admin/sysRole/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'input',
            name: 'roleName'
          },
          {
            label: '商户编号',
            type: 'input',
            name: 'roleName'
          },
          {
            label: '商户来源',
            type: 'select',
            name: 'useFlag',
            data: this.$store.state.global.payProduct
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
            name: 'merchantOrigin',
            type: 'select',
            data: this.$store.state.global.payProduct,
            rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
          },
          {
            title: '来源商户号',
            name: 'merchantOriginNo',
            type: 'input',
            // rules: [{ required: true, message: '请输入来源商户号', trigger: 'blur' }]
          },
          {
            title: '支付中心商户号',
            name: 'payMerchantNo',
            type: 'input',
            rules: [{ required: true, message: '请输入支付中心商户号', trigger: 'blur' }]
          }
        ],
        formUrl: '/manage/admin/webApi/channelNotifyConfig/saveConfig'
      }
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {

    }
  }
</script>
