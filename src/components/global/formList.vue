<template>
  <div class="form-list" >
    <myForm ref='myForm'
            :formItems='formItems'
            :routeType="routeType">
      <template v-for="(item,index) in formItems">
        <template :slot="item.name+'Before'">
          <slot :name="item.name+'Before'"></slot>
        </template>
        <template :slot="item.name+'After'">
          <slot :name="item.name+'After'"></slot>
        </template>
      </template>
      <slot></slot>
    </myForm>
    <slot name="bottom"></slot>
    <div class="bottom-btn-box">
      <Button v-if="routeType!=='detail'"
              type="primary"
              @click="mySubmit"
              :loading="btnLoading">确认
      </Button>
      <Button @click='back' type="primary">关闭</Button>
    </div>
  </div>
</template>
<script>
  import myForm from './myForm'

  export default {
    components: {myForm},
    data() {
      return {
        btnLoading: false,
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      formItems: {
        type: Array
      },
      url: {
        type: String,
        default: ''
      },
      routeType:{
        // 区分是详情，新增，编辑
        type: String,
        default: 'add'
      },
      method: {
        type: String,
        default: 'post'
      },
      apiPrefix:{
        type: String,
      }
    },
    watch: {
      // formItems: {
      //   handler(newValue, oldValue) {
      //     newValue.forEach((element,index) => {
      //       if(typeof element.value == 'undefined'){
      //         // 作用是监听输入框value的变化，使表单验证起作用
      //         this.$set(element, 'value','')
      //       }
      //     })
      //   },
      //   deep: true,
      //   immediate: true
      // }
    },
    methods: {
      back() {
        this.$router.back()
      },
      mySubmit() {
        this.btnLoading = true
        this.$refs.myForm.validate(async valid => {
          if (valid) {
            let saveMethod = 'apiPost'
            switch (this.method) {
              case 'post':
                saveMethod = 'apiPost'
                if (this.json) {
                  saveMethod = 'apiPostJson'
                }
                break
              case 'get':
                saveMethod = 'apiGet'
                break
              case 'put':
                saveMethod = 'apiPut'
                break
            }
            if (this._events.beforeSave) {
              this.$emit("beforeSave", this.$refs.myForm.formItem)
            }
            let res = await this[saveMethod](this.url, this.$refs.myForm.formItem,this.apiPrefix)
            if (res.status == 200 && res.success) {
              this.$Message.success('保存成功!')
              if (this._events.afterSave) {
                this.$emit("afterSave")
              }else{
                this.$router.back()
              }
            } else {
              this.btnLoading = false
              this.$Message.warning(res.message)
            }
          } else {
            this.btnLoading = false
            // 滚动到错误地方
            // setTimeout(function () {
            //   $('#content').scrollTop(
            //     $('.ivu-form-item-error').offset().top -
            //     90 +
            //     $('#content').scrollTop()
            //   )
            // }, 500)
          }
        })
      },
      validateField(name){
        this.$refs.myForm.validateField(name)
      },
      getFormItem(){
        return this.$refs.myForm.formItem
      },
      setFormItem(name,value){
        return this.$refs.myForm.setFormItem(name,value)
      }
    }
  }
</script>
<style scoped>
  .bottom-btn-box {
    text-align: center;
  }
  .form-list {
    width: 70%;
    margin: 0 auto;
  }

</style>
