<template>
<div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" v-if='index<limitNum' :key="index">
            <img :src="item">
            <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
            </div>
    </div>
    <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :format="['jpg','jpeg','png',]"
          :max-size="3072"
          multiple
          :on-exceeded-size="handleMaxSize"
          type="drag"
          action="/manage/admin/admin/ui/upload"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
          </div>
      </Upload>
</div>

</template>
<script>
export default {
  data() {
    return {
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
    }
  },
  methods: {
    handleRemove(index) {
      this.uploadList.splice(index,1)
      this.$emit("getImgUrl", this.uploadList)
    },
    handleSuccess(res, file) {
      if (res.status ==200) {
        this.uploadList.push(res.message)
        this.$emit("getImgUrl", this.uploadList)
      } else {
        this.$Message.warning("上传失败，请重新上传")
      }
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.limitNum;
      if (!check) {
        this.$Notice.warning({
          title: "上传的照片不能超过" + this.limitNum + "张"
        });
      }
      return check;
    },
   handleMaxSize (file) {
        this.$Notice.warning({
        title: '上传的照片文件过大',
        desc: '照片  ' + file.name + ' 过大, 不能超过 2M'
    });
    }

  },
  mounted() {}
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
