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
        <span class="detail-text"
              v-if="item.type=='text'||
              item.type=='inputText'||
              item.type=='textareaText'">
          {{item.value}}
        </span>
        <Divider v-if="item.type=='divider'"> {{item.title}}</Divider>
        <span class="detail-text"
              v-if="item.type=='selectText' ||
              item.type=='radioText'">
          {{item.value|selectFilter(item.data)}}
        </span>
        <Input v-if="item.type=='input'"
               :disabled="item.disabled"
               v-model="item.value"
               :placeholder="item.placeholder?item.placeholder:'请输入'+item.title"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    :placeholder="item.placeholder?item.placeholder:'请选择'+item.title"
                    v-model="item.value"
                    format="yyyy-MM-dd"></DatePicker>
        <Select v-if="item.type=='select'"
                :disabled="item.disabled"
                v-model="item.value"
                :placeholder="item.placeholder?item.placeholder:'请选择'+item.title"
                @on-open-change="item.onOpenChange?item.onOpenChange($event):''"
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
               :placeholder="item.placeholder?item.placeholder:'请输入'+item.title"
               :autosize="{minRows: 2,maxRows: 5}"></Input>
        <RadioGroup v-if="item.type=='radio'"
                    :disabled="item.disabled"
                    v-model="item.value">
          <Radio v-for="sitem in item.data"
                 :label="sitem.value"
                 :key="sitem.value">{{ sitem.label }}</Radio>
        </RadioGroup>
        <selectList v-if="item.type=='area'"
                     :disabled="item.disabled"
                     :fieldName="item.name"
                     @getQu="getQu"
                    v-model="item.value"
                    :span='8'></selectList>
        <span class="detail-text" v-if="item.type=='areaText'">
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
        <div class="upload-img-box" v-if="item.type=='uploadFileText'">
          <img v-if="item.value"  :src="item.value">
          <span v-else class="no-img">未上传</span>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import selectList from "@/components/global/selectList";
  import uploadFile from "@/components/global/uploadFile";
export default {
  components:{selectList,uploadFile},
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
    formItems: {　　　
      handler(newValue, oldValue) {
        newValue.forEach((element,index) => {
          // 如果是详情
          if(this.routeType=='detail'){
            element.rules = ''
          }

          if(typeof element.value == 'undefined'){
            // 作用是监听输入框value的变化，使表单验证起作用
            this.$set(element, 'value','')
          }
          if(element.name){
            // this.formItem[element.name] = element.value
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
      this.formItem[fieldName+"Obj"] = areaCode
    },
    uploadSuccess(fileUrl,fieldName){
      this.formItem[fieldName] = fileUrl
    }
  }
}
</script>
<style scoped>
  .detail-text{
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    background-color: #cccccc14;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 0 10px;
    height: 33px;
  }
  .upload-img-box img{
    width: 70px;
    height: 70px;
  }
  .no-img{
    display: inline-block;
    width: 70px;
    height: 70px;
    border: 1px dashed #e5e5e5;
    text-align: center;
    line-height: 70px;
    color: #999;
  }
</style>
