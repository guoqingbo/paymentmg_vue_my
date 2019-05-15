<template>
  <div>
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
               :disabled="item.disabled"
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
                :disabled="item.disabled"
                v-model="formItem[item.name]"
                :placeholder="'请选择'+item.title"
                style="width:220px">
          <Option v-for="sitem in item.data"
                  :value="sitem.value"
                  :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
        <Input v-if="item.type=='textarea'"
               :disabled="item.disabled"
               v-model="formItem[item.name]"
               type="textarea"
               :placeholder="'请输入'+item.title"
               :autosize="{minRows: 2,maxRows: 5}"></Input>
        <RadioGroup v-if="item.type=='radio'"
                    v-model="formItem[item.name]">
          <Radio v-for="sitem in item.data"
                 :label="sitem.value">{{ sitem.label }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="mySubmit"
                :loading="btnLoading">确认</Button>
        <Button @click='back'>取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formItem: {
      },
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
    back () {
      this.$router.back()
    },
    mySubmit () {
      if(this._events.save){
        this.$emit("save",this.formItem)
        return
      }
      this.btnLoading = true
      this.$refs.formRef.validate(async valid => {
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
          if (res.status == 200) {
            this.$Message.success('保存成功!')
            this.$router.back()
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
