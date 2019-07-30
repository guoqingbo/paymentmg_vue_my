<template>
  <div>
    <script :id="id" type="text/plain" ></script>
  </div>
</template>
<script>
import "../../../static/ueditor/ueditor.config.js";
import "../../../static/ueditor/ueditor.all.js";
import "../../../static/ueditor/lang/zh-cn/zh-cn.js";
import "../../../static/ueditor/ueditor.parse.min.js";
export default {
  name: "UE",
  props: {
    id: {
      type: String,
      default: "ue"
    },
    config: {
      type: Object,
      default: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      }
    },
    content: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    const _this = this;
    this.editor = window.UE.getEditor(_this.id, 
    Object.assign({toolbars:[[
          'undo', //撤销
	        'redo', //重做
	        'bold', //加粗
	        'italic', //斜体 'underline', //下划线
	        'strikethrough', //删除线
	        'subscript', //下标  
	        'time', //时间
	        'date', //日期
	        'cleardoc', //清空文档
	        'fontfamily', //字体
	        'fontsize', //字号
	        'forecolor',//字体颜色
	        'simpleupload', //单图上传
	        //'insertimage', //多图上传
	        //'emotion', //表情
	        'justifyleft', //居左对齐
	        'justifyright', //居右对齐
	        'justifycenter', //居中对齐
	        'justifyjustify', //两端对齐
	        'indent', //首行缩进
	        'touppercase', //字母大写
	        'tolowercase', //字
        ]]},_this.config));
    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.content);
    });
    this.editor.addListener("contentChange", function() {

    });
  },
  beforeDestroy() {
    let _this = this;
    window.UE.delEditor(_this.id);
  },
  methods: {
    getUEContent() {  
      return this.editor.getContent();
    },
    clearUEContent(){
      this.editor.execCommand('cleardoc');
      return true;
    }
  }
};
</script>
