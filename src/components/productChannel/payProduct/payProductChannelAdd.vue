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
            title: '支付产品名称',
            name: 'payProductName',
            type: 'input',
            disabled:true,
            value:'个人网银',
          },
          {
            title: '渠道产品编码',
            name: 'channelProductNo',
            type: 'input',
            rules: [
              { required: true, message: '请输入渠道产品编码', trigger: 'blur' },
              { max: 20, message: "支付产品名称不超过20字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '说明',
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
