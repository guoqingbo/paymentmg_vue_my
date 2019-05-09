<template>
  <div>
    <template v-if="isImg">
      <div class="demo-upload-list"
           v-for="(item,index) in uploadList"
           :key="index">
        <img :src="item">
        <div class="demo-upload-list-cover">
          <Icon type="ios-trash-outline"
                @click.native="handleRemove(index)"></Icon>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="demo-upload-list-box"
           v-for="(item,index) in uploadList"
           :key="index">
        <span style="vertical-align: middle; display:inline-block;">
          <Icon type="document"
                size="20"
                class="icon-music"></Icon>
          {{item}}
        </span>
        <span class="demo-upload-list-del"
              style="vertical-align: middle; margin-left:10px; display:inline-block; cursor: pointer;">
          <Icon type="trash-a"
                size="20"
                @click.native="handleRemove(index)"></Icon>
        </span>
      </div>
    </template>
    <Upload ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :on-exceeded-size="handleMaxSize"
            :on-format-error="handleFormatError"
            :format="defaultFormat"
            :max-size="2048"
            type="drag"
            action="/manage/admin/admin/ui/upload"
            style="display: inline-block;width:58px;"
            v-if="uploadList.length !== limitNum">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera"
              size="20"
              v-if="isImg"></Icon>
        <Icon type="ios-cloud-upload-outline"
              size="20"
              v-else></Icon>
      </div>
    </Upload>
  </div>

</template>
<script>
export default {
  data () {
    return {
      uploadList: [],
      defaultFormat: ['jpg', 'jpeg', 'png'],
      isImg: true
    }
  },
  props: {
    limitNum: {
      type: Number,
      default: 9
    },
    value: {
      type: String
    },
    format: {
      type: Array
    }
  },
  watch: {
    value: {
      handler (value) {
        this.defaultFormat = this.format || this.defaultFormat
        this.defaultFormat.forEach(element => {
          if (element === 'jpg' || element === 'jpeg' || element === 'png' || element === 'gif') {
            this.isImg = true
          } else {
            this.isImg = false
          }
        })
        if (value) {
          this.uploadList = value.split(',')
        }
      },
      immediate: true
    }
  },
  methods: {
    handleRemove (index) {
      this.uploadList.splice(index, 1)
      this.$emit('input', this.uploadList.join(','))
      this.$emit('on-remove')
    },
    handleSuccess (res, file) {
      if (res.status === 200) {
        this.uploadList.push(res.message)
        this.$emit('input', this.uploadList.join(','))
        this.$emit('on-success')
      } else {
        this.$Message.error('上传失败，请重新上传')
      }
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.limitNum
      if (!check) {
        this.$Message.error('上传的照片不能超过' + this.limitNum + '张')
      }
      return check
    },
    handleMaxSize (file) {
      this.$Message.error('照片  ' + file.name + ' 过大, 不能超过 2M')
    },
    handleFormatError (file) {
      this.$Message.error('文件  ' + file.name + ' 类型不正确!')
      // this.$Notice.warning({
      //   title: '文件类型不正确',
      //   desc: '文件  ' + file.name + ' 类型不正确!'
      // })
    }
  },
  mounted () { }
}
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
.demo-upload-list-box span .icon-music {
  margin-right: 10px;
  vertical-align: middle;
}
</style>
