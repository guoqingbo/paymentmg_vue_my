<template>
<div>
      <Upload 
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :on-format-error="handleFormatError"
          :format="['mp3']"
          :max-size="10240"
          multiple
          :on-exceeded-size="handleMaxSize"
          action="/manage/admin/admin/ui/upload">
          <Button type="primary" :loading="loading">点击上传</Button>
      </Upload> 
 <div class="demo-upload-list-box" v-for="(item,index) in uploadList" :key="index">
        <span>
             <Icon type="ios-musical-notes" class="icon-music"></Icon>
            {{item}}
            </span>
        <div class="demo-upload-list-del">
            <Icon type="ios-close-empty" @click.native="handleRemove(index)"></Icon>
        </div>
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
        loading:false
    };
  },
  props: {
    uploadList: {
      type: Array,
      default: []
    },
    limitNum: {
      type:Number,
      default: 9
    },
    // uploadName:{
    //    type: Array,
    //   default: []
    // }
  },
  methods: {
    handleRemove(index) {
      this.uploadList.splice(index,1)
    //   this.uploadName.splice(index,1)
      this.$emit("getImgUrl", this.uploadList)
    },
    handleSuccess(res, file) {
      if (res.status ==200) {
        this.uploadList.push(res.message)
        // this.uploadName.push(file.name)
        this.$emit("getImgUrl", this.uploadList)
        this.loading=false
      } else {
        this.$Message.warning("上传失败，请重新上传")
      }
    },
    handleBeforeUpload() {
        this.loading=true
      const check = this.uploadList.length < this.limitNum;
      if (!check) {
        this.$Notice.warning({
          title: "上传的文件不能超过" + this.limitNum + "张"
        });
      }
      return check;
    },
   handleMaxSize (file) {
        this.$Notice.warning({
        title: '上传的文件过大',
        desc: '文件  ' + file.name + ' 过大, 不能超过 10M'
    });
    },
     handleFormatError(file){
         this.loading=false
        this.$Notice.warning({
        title: '不支持此文件格式',
        desc: '不支持 ' + file.name + ' 文件格式'
      })
    },

  },
  mounted() {}
};
</script>
<style>
.ivu-upload-list{
    width:50%;
}
.demo-upload-list-box {
  display: inline-block;
  width:50%;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-top: 10px;
  padding-left:10px;
}
.demo-upload-list-box span .icon-music{
margin-right:10px;
}
.demo-upload-list-del {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
}
.demo-upload-list-box:hover {
  background: #f3f3f3;
}
.demo-upload-list-box:hover .demo-upload-list-del{
  display: block;
}
.demo-upload-list-del i {
  color:#495060;
  font-size: 20px;
  cursor: pointer;
  margin-right:5px;
}
</style>