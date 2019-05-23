<template>
  <div>
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
            title: '支付产品代码',
            name: 'payProductCode',
            type: 'input',
            rules: [
              { required: true, message: '请输入支付产品代码', trigger: 'blur' },
              { max: 20, message: "支付产品代码不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '支付产品名称',
            name: 'payProductName',
            type: 'input',
            rules: [
              { required: true, message: '请输入支付产品名称', trigger: 'blur' },
              { max: 20, message: "支付产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '产品说明',
            name: 'productRemark',
            type: 'textarea',
            rules: [{ max: 100, message: "产品说明不超过100字符" ,trigger: 'blur'}]
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

</style>
