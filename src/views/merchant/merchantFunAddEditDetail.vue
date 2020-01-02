<template>
  <div>
    <Form :model="params"
          ref="formRef">
      <FormItem
        :label-width="150"
        label="商户名称:"
        prop="merchantNo"
        :rules="{}">
        <AutoComplete class="my-autoComplete"
                      v-model="params.merchantNo"
                      @on-search="searchMerchantList"
                      :clearable="true"
                      icon="ios-search"
                      placeholder="请输入商户名称">
          <Option v-for="(sitem,sindex) in autoComplete.data" :value="sitem.value" :key="sindex">{{ sitem.label }}</Option>
        </AutoComplete>
      </FormItem>
    </Form>
  </div>
</template>

<script>


  export default {
    components: {},
    name: "merchantFunAddEditDetail",
    data(){
      return {
        autoComplete:{
          data:[]
        },
        params:{
          merchantNo:''
        },
      }
    },
    methods:{
      searchMerchantList(value){
        this.common.searchMerchantList(value,this.autoComplete)
      }
    }
  }
</script>
<style scoped>
  .my-autoComplete .ivu-select-dropdown {
    left: 0 !important;
  }
  .my-autoComplete .ivu-select-dropdown-list{
    max-height: 280px;
    overflow: auto;
  }
</style>
