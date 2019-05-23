<template>
  <div>
    <Form :model="formItem"
          label-position="right"
          :label-width="150"
          ref="formRef">
      <FormItem v-for="(item,index) in formItems"
                :key="item.name"
                :label="item.title+'：'"
                :prop="item.name"
                :rules="item.rules||{}"
                v-if="item.type">
        <span v-if="item.type=='text'||item.type=='inputText'||item.type=='textareaText'">
          {{formItem[item.name]}}
        </span>
        <span v-if="item.type=='selectText' ||item.type=='radioText'">
          {{formItem[item.name]|selectFilter(item.data)}}
        </span>
        <Input v-if="item.type=='input'"
               :disabled="item.disabled"
               v-model="formItem[item.name]"
               :placeholder="'请输入'+item.title"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    confirm
                    :placeholder="'请选择'+item.title"
                    v-model="formItem[item.name]"
                    @on-change="formItem[item.name]=$event"
                    format="yyyy-MM-dd"></DatePicker>
        <Select v-if="item.type=='select'"
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
                    :disabled="item.disabled"
                    v-model="formItem[item.name]">
          <Radio v-for="sitem in item.data"
                 :label="sitem.value"
                 :key="sitem.value">{{ sitem.label }}</Radio>
        </RadioGroup>
        <select-item v-if="item.type=='area'"
                     :disabled="item.disabled"
                     ref='area'
                     :data-name="item.name"
                     @getProvince="getProvince"
                     @getCity="getCity"
                     @getQu="getQu"
                    :addrCode="item.areaCode"
                    :span='8'></select-item>
        <div v-if="item.type=='uploadFile'">
          <uploadFile :limitNum="item.limitNum||1"
                      :disabled="item.disabled"
                      :format="item.format"></uploadFile>
          <p>{{item.tip}}</p>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import selectItem from "@/components/global/selectList";
  import uploadFile from "@/components/global/uploadFile";
export default {
  components:{selectItem,uploadFile},
  data () {
    return {
      formItem: {
      },
    }
  },
  props: {
    formItems: {
      type: Array
    },
    routeType:{
      // 区分是详情，新增，编辑
      type: String,
      default: 'add'
    },
  },
  filters:{
    selectFilter(value,data){
      let label = ''
      if(data instanceof Array){
        data.forEach(function (ele) {
          if(ele.value == value){
            label = ele.label
          }
        })
      }
      return label
    }
  },
  watch: {
    // value: {
    //   handler (value) {
    //     this.formItems.forEach(element => {
    //       // 如果是详情
    //       // if(this.routeType=='detail'){
    //       //   element.disabled = true
    //       //   element.type = 'text'
    //       // }
    //       this.$set(this.formItem, element.name, element.value)
    //     })
    //   },
    //   immediate: true
    // },
    formItems: {　　　
      handler(newValue, oldValue) {
        this.formItems.forEach((element,index) => {
          // 如果是详情
          // if(this.routeType=='detail'){
          //   element.disabled = true
          //   element.type = 'text'
          // }
          this.$set(this.formItem, element.name, element.value)
        })
      },　　　　
      deep: true,
      immediate: true　
    }

  },
  methods: {
    validate(cb){
      this.$refs.formRef.validate(cb)
    },
    resetFields(){
      this.$refs.formRef.resetFields()
    },
    getAreaCode(){
      if(this.$refs.area){
        let areaCode = this.$refs.area.getArea()
        let name = this.$refs.area.dataset.name
        this.formItem[name] = areaCode
        return areaCode
      }else{
        return false
      }
    },
    getProvince(sheng, e) {
      //省

    },
    getCity(city, e) {
      //市
    },
    getQu(qu, e) {
      if(this.$refs.area){
        let areaCode = this.$refs.area.getArea()
        let name = this.$refs.area.dataset.name
        this.formItem[name] = areaCode
      }
    },
  }
}
</script>
