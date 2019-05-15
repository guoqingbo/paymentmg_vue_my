<template>
  <div>
    <Modal v-model="modal"
           :title="title"
           @on-ok="ok"
           @on-cancel="cancel"
           :loading="loading"
           width="750">
      <Form :model="formItem"
            label-position="right"
            :label-width="150"
            ref="formRef">
        <FormItem v-for="(item,index) in formItems"
                  :key="item.name"
                  :label="item.title+'：'"
                  :prop="item.rules?item.name:''"
                  :rules="item.rules||{}"
                  v-if="item.type">
          <Input v-if="item.type=='input'"
                 v-model="formItem[item.name]"
                 :placeholder="'请输入'+item.title"></Input>
          <DatePicker v-else-if="item.type=='date'"
                      type="date"
                      confirm
                      :placeholder="'请选择'+item.title"
                      v-model="formItem[item.name]"
                      @on-change="formItem[item.name]=$event"
                      format="yyyy-MM-dd"></DatePicker>
          <Select v-else-if="item.type=='select'"
                  v-model="formItem[item.name]"
                  :placeholder="'请选择'+item.title"
                  style="width:220px">
            <Option v-for="sitem in item.data"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
          <Input v-if="item.type=='textarea'"
                 type="textarea"
                 :placeholder="'请输入'+item.title"
                 :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal: false,
      loading: true,
      formItem: {
      }
    }
  },
  props: {
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
        this.formItem = {}
        this.formItems.forEach(element => {
          this.$set(this.formItem, element.name, element.value)
        })
      },
      immediate: true
    }
  },
  methods: {
    ok () {
      this.$refs.formRef.validate(async (valid) => {
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
          let res = await this[saveMethod](this.url, this.formItem)
          if (res.success || res.status === 200) {
            this.modal = false
            this.$emit('input', this.modal)
            this.$Message.info(res.message || '操作成功！')
            if (this.$parent.$refs.gridTable) {
              this.$parent.$refs.gridTable.loadpage()
            }
            this.$emit('on-success', res.data || res)
            this.$emit('input', this.modal)
            this.$refs.formRef.resetFields()
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
    cancel () {
      this.$refs.formRef.resetFields()
      this.$emit('input', this.modal)
    }
  }
}
</script>
