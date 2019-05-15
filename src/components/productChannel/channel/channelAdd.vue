<template>
  <div class="merchantAdd">
    <formList :formItems="formList"
              :url="formListUrl"></formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";
  export default {
    components: {
      formList,
    },
    data () {
      return {
        formListUrl:"admin/sysRole/grid",
        formList: [
          {
            title: '渠道编码',
            name: 'chanelNo',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道编码', trigger: 'blur' },
              { max: 20, message: "渠道编码不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道名称',
            name: 'chanelName',
            type: 'input',
            rules: [
              { required: true, message: '请输入场景名称', trigger: 'blur' },
              { max: 20, message: "场景名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '渠道性质',
            name: 'chanelNature',
            type: 'select',
            data: [
              {label:"银行",value:"0"},
              {label:"支付公司",value:"1"},
              {label:"其它",value:"2"}
            ],
            rules: [{ required: true, message: '请选择渠道性质', trigger: 'change' }]
          },
          {
            title: '签约状态',
            name: 'signStatus',
            type: 'select',
            data: [
              {label:"已签约",value:"0"},
              {label:"已解约",value:"1"},
            ],
            rules: [{ required: true, message: '请选择签约状态', trigger: 'change' }]
          },
          {
            title: '业务联系人',
            name: 'contactName',
            type: 'input',
            rules: [{ max: 20, message: "业务联系人不超过20字符" ,trigger: 'blur'}]
          },
          {
            title: '业务联系人手机号',
            name: 'contactTel',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: false,
              trigger: "blur"
            }]
          },
          {
            title: '业务联系人邮箱',
            name: 'contactEmail',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: false, trigger: "blur"}
            ]
          },
          {
            title: '备注',
            name: 'sceneRemark',
            type: 'textarea',
            rules: [{ max: 100, message: "备注不超过100字符" ,trigger: 'blur'}]
          },
        ],
      }
    },
    watch: {

    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .merchantAdd {
    width: 70%;
    margin: 0 auto;
  }
</style>
