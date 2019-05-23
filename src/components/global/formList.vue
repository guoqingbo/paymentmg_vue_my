<template>
  <div class="form-list" >
    <myForm ref='myForm'
            :formItems='formItems'
            :routeType="routeType"
    ></myForm>
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
    },
    watch: {
      // formItems: {
      //   handler(newValue, oldValue) {
      //     console.log(newValue)
      //     console.log(oldValue)
      //     // this.formItems.forEach((element,index) => {
      //     //   // 如果是详情
      //     //   // if(this.routeType=='detail'){
      //     //   //   element.disabled = true
      //     //   //   element.type = 'text'
      //     //   // }
      //     // })
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
            let res = await this[saveMethod](this.url, this.$refs.myForm.formItem)
            if (res.status == 200) {
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
