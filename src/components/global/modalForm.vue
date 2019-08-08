<template>
  <div>
    <Modal v-model="modal"
           :title="title"
           @on-ok="ok"
           @on-cancel="cancel"
           :loading="loading"
           width="750">
      <myForm ref='myForm'
              :formItems='formItems'
              :routeType='routeType'
              :value="value"
      ></myForm>
      <div slot="footer">
        <div v-if='routeType!="detail"'>
          <Button
                  @click="cancel"
                  >取消
          </Button>
          <Button type="primary"
                  @click="ok"
                  >确定
          </Button>
        </div>
        <div v-else>
          <Button type="primary"
                  @click="cancel"
                  >关闭
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import myForm from './myForm'

  export default {
    components:{myForm},
    data() {
      return {
        modal: false,
        loading: true,
        formItem: {}
      }
    },
    props: {
      routeType:{
        // 区分是详情，新增，编辑
        type: String,
        default: 'add'
      },
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '弹出表单'
      },
      url: {
        type: String,
        default: ''
      },
      formItems: {
        type: Array
      },
      method: {
        type: String,
        default: 'post'
      },
      json: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
        handler (value) {
          this.modal = value
        },
        immediate: true
      }
    },
    methods: {
      ok() {
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
            if (res.success || res.status === 200) {
              this.modal = false
              this.$Message.info(res.message || '操作成功！')
              // 刷新列表
              if (this.$parent.$refs.gridTable) {
                this.$store.dispatch('getList')
                // this.$parent.$refs.gridTable.loadpage()
              }
              this.$emit('on-success', res.data || res)
              this.$emit('input', this.modal)
              this.$refs.myForm.resetFields()
            } else {
              this.$Message.error(res.message)
              this.loading = false
              this.$nextTick(() => {
                this.loading = true
              })
              this.$emit('on-error', res.data)
            }
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      },
      cancel() {
        this.$refs.myForm.resetFields()
        this.$emit('input', this.modal)
      }
    }
  }
</script>
<style>
.ivu-modal-footer {
  border-top: none !important;
}
</style>
