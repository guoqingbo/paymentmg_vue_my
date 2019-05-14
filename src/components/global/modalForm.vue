<template>
  <div>
    <Modal v-model="modal"
           :title="title"
           @on-ok="ok"
           @on-cancel="cancel"
           :loading="loading"
           width="750">
      <slot></slot>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'modalForm',
  data () {
    return {
      loading: true,
      modal: false
    }
  },
  props: {
    value: {
      type: Boolean
    },
    title: {
      type: String,
      default: '表单提交'
    },
    formAction: {
      type: String,
      required: true
    },
    formParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formRef: {
      type: Object
    },
    method: {
      type: String,
      default: 'post'
    },
    formModel: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        this.modal = value
      },
      immediate: true
    }
    // formParams: {
    //   handler (value) {
    //     console.log(value)
    //   },
    //   deep: true
    // }
  },
  methods: {
    ok () {
      this.formRef.validate(async (valid) => {
        if (valid) {
          let saveMethod = 'apiPost'
          switch (this.method) {
            case 'post':
              saveMethod = 'apiPost'
              break
            case 'get':
              saveMethod = 'apiGet'
              break
            case 'put':
              saveMethod = 'apiPut'
              break
          }
          let res = await this[saveMethod](this.formAction, this.formParams)
          if (res.success || res.status === 200) {
            this.modal = false
            this.$Message.info(res.message || '操作成功！')
            if (this.$parent.$refs.gridTable) {
              this.$parent.$refs.gridTable.loadpage()
            }
            this.$emit('on-success', res.data || res)
            this.$emit('input', this.modal)
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
          this.$emit('validateError')
        }
      })
    },
    cancel () {
      if (this.formRef) {
        this.formRef.resetFields()
      }
      this.$emit('on-cancel')
      this.$emit('input', this.modal)
    }
  }
}
</script>
