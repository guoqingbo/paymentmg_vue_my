<template>
  <div>
    <Form :model="formItem"
          ref="formRef">
      <FormItem v-for="(item,index) in formItems"
                label-position="right"
                :key="item.name"
                :label-width="item.type!=='divider'?150:0"
                :label="item.type!=='divider'?item.title+'：':''"
                :prop="item.name"
                :rules="item.rules||{}"
                v-if="item.type">
        <span v-if="item.type=='text'||
        item.type=='inputText'||
        item.type=='textareaText'">
          {{item.value}}
        </span>
        <Divider v-if="item.type=='divider'"> {{item.title}}</Divider>

        <span v-if="item.type=='selectText' ||item.type=='radioText'">
          {{item.value|selectFilter(item.data)}}
        </span>
        <Input v-if="item.type=='input'"
               :disabled="item.disabled"
               v-model="item.value"
               :placeholder="'请输入'+item.title"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    :placeholder="'请选择'+item.title"
                    v-model="item.value"
                    format="yyyy-MM-dd"></DatePicker>
        <Select v-if="item.type=='select'"
                :disabled="item.disabled"
                v-model="item.value"
                :placeholder="'请选择'+item.title"
                @on-change="item.onChange?item.onChange($event):''"
                style="width:220px">
          <Option v-for="sitem in item.data"
                  :value="sitem.value"
                  :selected="sitem.value == item.value"
                  :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
        <Input v-if="item.type=='textarea'"
               :disabled="item.disabled"
               v-model="item.value"
               type="textarea"
               :placeholder="'请输入'+item.title"
               :autosize="{minRows: 2,maxRows: 5}"></Input>
        <RadioGroup v-if="item.type=='radio'"
                    :disabled="item.disabled"
                    v-model="item.value">
          <Radio v-for="sitem in item.data"
                 :label="sitem.value"
                 :key="sitem.value">{{ sitem.label }}</Radio>
        </RadioGroup>
        <select-item v-if="item.type=='area'"
                     :disabled="item.disabled"
                     :fieldName="item.name"
                     @getQu="getQu"
                    :addrCode="item.addrCode"
                    :span='8'></select-item>
        <span v-if="item.type=='areaText'">
          {{item.areaText}}
        </span>
        <div v-if="item.type=='uploadFile'">
          <uploadFile v-model="item.value"
                      :limitNum="item.limitNum||1"
                      :disabled="item.disabled"
                      :format="item.format"
                      :fieldName="item.name"
                      @on-success="uploadSuccess"></uploadFile>
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
          // this.formItem[element.name] = element.value
          if(element.name){
            this.$set(this.formItem, element.name, element.value)
          }
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
    // getAreaCode(){
    //   if(this.$refs.area){
    //     let areaCode = this.$refs.area.getArea()
    //     let name = this.$refs.area.dataset.name
    //     this.formItem[name] = areaCode
    //     return areaCode
    //   }else{
    //     return false
    //   }
    // },
    // getProvince(sheng, e) {
    //   //省
    //
    // },
    // getCity(city, e) {
    //   //市
    // },
    getQu(areaCode,fieldName) {
      this.formItem[fieldName] = areaCode
    },
    uploadSuccess(fileUrl,fieldName){
      this.formItem[fieldName] = fileUrl
    }
  }
}
</script>
