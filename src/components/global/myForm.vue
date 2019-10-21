<template>
  <div>
    <Form :model="formItem"
          ref="formRef">
      <template v-for="(item,index) in formItems">
        <slot :name="item.name+'Before'"></slot>
        <FormItem
          label-position="right"
          :key="item.name"
          :label-width="item.type!=='divider'?150:0"
          :label="(item.type!=='divider'&&item.type!=='btn')?item.title+'：':''"
          :prop="item.name"
          :rules="item.rules||{}"
          v-if="item.type">
          <span class="detail-text"
                :class="{'detail-textareaText':item.value.length>300}"
                v-if="item.type=='text'||
              item.type=='inputText'||
              item.type=='autoCompleteText'">
          {{item.value}}
        </span>
          <span class="detail-text detail-textareaText"
                v-if="item.type=='textareaText'">
          {{item.value}}
        </span>
          <!--<div v-if='item.clipboard' style="text-align: right;">-->
            <!--<Button type="primary"-->
                    <!--v-clipboard:copy="item.value"-->
                    <!--v-clipboard:success="onCopySuccess"-->
                    <!--v-clipboard:error="onCopyError">-->
              <!--{{item.clipboardText}}-->
            <!--</Button>-->
          <!--</div>-->
          <Divider v-if="item.type=='divider'"> {{item.title}}</Divider>
          <span class="detail-text"
                v-if="item.type=='selectText' ||
              item.type=='radioText'">
          {{item.value|selectFilter(item.data)}}
        </span>
          <Input v-if="item.type=='input'"
                 :disabled="item.disabled"
                 :on-change="item.onChange?item.onChange(item.value):''"
                 v-model="item.value"
                 :type="item.value.length>200?'textarea':'text'"
                 :autosize="{minRows: 2,maxRows: 5}"
                 :placeholder="item.placeholder?item.placeholder:'请输入'+item.title"></Input>
          <Input v-if="item.type=='textarea'"
                 :disabled="item.disabled"
                 v-model="item.value"
                 type="textarea"
                 :placeholder="item.placeholder?item.placeholder:'请输入'+item.title"
                 :autosize="{minRows: 2,maxRows: 5}"></Input>
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
          <AutoComplete class="my-autoComplete"
                        :disabled="item.disabled"
                        v-if="item.type=='autoComplete'"
                        v-model="item.value"
                        @on-search="item.search?item.search($event):''"
                        :clearable="true"
                        icon="ios-search"
                        :placeholder="'请输入'+item.title">
            <Option v-for="(sitem,sindex) in item.data" :value="sitem.value" :key="sindex">{{ sitem.label }}</Option>
          </AutoComplete>
          <RadioGroup v-if="item.type=='radio'"
                      :disabled="item.disabled"
                      v-model="item.value"
                      @on-change="item.onChange?item.onChange(item.value):''">
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
          <!--<div v-if="item.type=='btn'&&!item.disabled">-->
            <!--<Button type="primary"-->
                    <!--:disabled="item.disabled"-->
                    <!--@click="item.cb"-->
            <!--&gt;{{item.value}}-->
            <!--</Button>-->
            <!--<Icon v-if='item.desc' style="font-size: 20px;color: red;" type="ios-alert" />-->
            <!--<span style="color: red;vertical-align: middle;">{{item.desc}}</span>-->
          <!--</div>-->
          <div v-if="item.type=='uploadFile'">
            <uploadFile v-model="item.value"
                        :limitNum="item.limitNum"
                        :disabled="item.disabled"
                        :format="item.format"
                        :accept="item.accept"
                        :params ="item.params"
                        :fieldName="item.name"
                        :url="item.url"
                        :showUploadUrl="item.showUploadUrl"
                        @beforeUpload="(params)=>{item.beforeUpload?item.beforeUpload(params):''}"
                        @on-remove="onRemove"
                        @on-success="uploadSuccess"></uploadFile>
            <p>{{item.tip}}</p>
          </div>
          <div class="upload-img-box" v-if="item.type=='uploadFileText'">
            <!--如果是图片-->
            <template v-if="item.value">
              <img v-if="/[(.png)(.jpg)(.jpeg)(.gif)]$/.test(item.value)"  :src="item.value">
              <span v-else>{{item.showUploadUrl?item.value:'已上传'}}</span>
            </template>
            <span v-else class="no-img">未上传</span>
          </div>
        </FormItem>
        <slot :name="item.name+'After'"></slot>
      </template>
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
      autoSelected: false,
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
            // if(element.type == 'autoComplete'){
            //   return
            // }
            // this.formItem[element.name] = element.value
            let val = element.value
            if(typeof val == 'string'){
              val = val.replace(/(^\s*)|(\s*$)/g, "")
            }
            this.$set(this.formItem, element.name, val)
          }
        })
      },　　　　
      deep: true,
      immediate: true　
    }
  },
  methods: {
    // autoChange(val,item) {
    //   if(this.autoSelected){ // 判断是否是自动填充
    //     this.autoSelected = false;
    //     if(this.formItem.parentMerchantCode!=undefined){
    //       this.formItems.forEach(ele=>{
    //         if(ele.name=='parentMerchantCode'){
    //           ele.value = item.code;
    //         }
    //       });
    //       this.$set(this.formItem, "parentMerchantName", item.keyword)
    //     }
    //     if(this.formItem.merchantCode!=undefined){
    //       this.formItems.forEach(ele=>{
    //         if(ele.name=='merchantCode'){
    //           ele.value = item.code;
    //         }
    //       });
    //       this.$set(this.formItem, "merchantName", item.keyword)
    //     }
    //   }else{
    //     if(this.formItem.parentMerchantCode!=undefined){
    //       this.formItems.forEach(ele=>{
    //         if(ele.name=='parentMerchantCode'){
    //           ele.value = '';
    //         }
    //       });
    //       this.$set(this.formItem, "parentMerchantName", item.value)
    //     }
    //     if(this.formItem.merchantCode!=undefined){
    //       this.formItems.forEach(ele=>{
    //         if(ele.name=='merchantCode'){
    //           ele.value = '';
    //         }
    //       });
    //       this.$set(this.formItem, "merchantName", item.value)
    //     }
    //   }
    // },
    // autoSelect(val,item) {
    //   this.autoSelected = true;
    //   let newValue = val.match(/\(.+\)/g);
    //   if(newValue instanceof Array) {
    //     item.code = newValue[0];
    //     item.keyword = val.replace(/\(.+\)/g,'');
    //   }
    //   item.code = item.code.replace(/\(|\)/g,'');
    // },
    // onCopySuccess(){
    //   this.$Message.success("复制成功")
    // },
    // onCopyError(){
    //   this.$Message.error("复制失败")
    // },
    validate(cb){
      this.$refs.formRef.validate(cb)
    },
    resetFields(){
      this.formItems.forEach(ele=>{
        ele.value = '';
      });
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
      let arrItem = this.common.getArrItem(this.formItems,fieldName)
      arrItem.value = fileUrl
      this.formItem[fieldName] = fileUrl
    },
    onRemove(fileUrl,fieldName){
      let arrItem = this.common.getArrItem(this.formItems,fieldName)
      arrItem.value = fileUrl
      this.formItem[fieldName] = fileUrl
    }
  }
}
</script>
<style>
  .my-autoComplete .ivu-select-dropdown {
  left: 0 !important;
}
</style>
<style scoped>
  .detail-text{
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    background-color: #cccccc14;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 0 10px;
    min-height: 33px;
  }
  .detail-textareaText {
    word-break: break-all;
    overflow-y: auto;
    max-height: 99px;
    line-height: 1.7;
    padding: 7px;
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
  .my-autoComplete .ivu-select-dropdown-list{
    max-height: 280px;
    overflow: auto;
  }
</style>
