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
             mode="mode"></confirm>
    <modalForm v-model="modalForm"
               :title="modalFormTitle"
               :formRef="$refs.formItem"
               :formAction="formAction"
               :formParams="formParams">
      <Form :model="formItem"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="ruleForm">
        <FormItem label="角色名称："
                  prop="roleName">
          <Input v-model="formItem.roleName"
                 placeholder="填写角色名称"></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="formItem.remark"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </modalForm>
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
            title: '商户号',
            key: 'accType',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'useFlag',
            sortable: true,
          },
          {
            title: '客户类型',
            key: 'remark',
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
                  title: "详情",
                  action: () => {
                    this.$router.push({
                      path: "/merchantAdd?lookId=" + params.row.id
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/merchantAdd",
                      query: { editId: params.row.id }
                    });
                  }
                },
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
              console.log(this.common)
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
          }
        ],
        hannleItems: [
          {
            title: '添加商户场景',
            icon: 'md-add',
            callback: () => {
              this.showModal('add')
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",

        formItem: {
          roleName: '',
          switch: true,
          remark: ''
        },
        ruleForm: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        },
        modalForm: false,
        modalFormTitle: '',
        formParams: {},
        formAction: ''
      }
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      showModal (type, row) {
        // this.modal = true
        this.modalForm = true
        if (type === 'add') {
          this.formItem.roleName = ''
          this.formItem.switch = true
          this.formItem.remark = ''
          this.modalFormTitle = '新增角色'
          this.formAction = '/admin/sysRole/saveRole'
        }
      },
    }
  }
</script>
