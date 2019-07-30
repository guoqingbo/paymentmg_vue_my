<template>
  <div>
    <script type="text/plain"
            ref="script"
            :id="id"></script>
  </div>
</template>
<script>
import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.js'
import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor/ueditor.parse.min.js'
export default {
  name: 'UE',
  data () {
    return {
      editor: null,
      initValue: '',
      status: 0,
      id: 'editor_' + Math.random().toString(16).slice(-6)
    }
  },
  props: {
    config: {
      type: Object
    },
    value: {
      type: String
    }
  },
  watch: {
    value: {
      handler (value) {
        switch (this.status) {
          case 0:
            this.status = 1
            this.initValue = value
            this.$refs.script ? this._initEditor() : this.$nextTick(() => this._initEditor())
            break
          case 1:
            this.initValue = value
            break
          case 2:
            this._setContent(value)
            break
          default:
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    _initEditor () {
      // this.$refs.script.id = this.id = 'editor_' + Math.random().toString(16).slice(-6)
      this.editor = window.UE.getEditor(this.id,     Object.assign(
        {
          toolbars: [
            [
              "undo", //撤销
              "redo", //重做
              "bold", //加粗
              "italic", //斜体 'underline', //下划线
              "strikethrough", //删除线
              "subscript", //下标
              "time", //时间
              "date", //日期
              "cleardoc", //清空文档
              "fontfamily", //字体
              "fontsize", //字号
              "forecolor", //字体颜色
              "simpleupload", //单图上传
              //'insertimage', //多图上传
              //'emotion', //表情
              "justifyleft", //居左对齐
              "justifyright", //居右对齐
              "justifycenter", //居中对齐
              "justifyjustify", //两端对齐
              "indent", //首行缩进
              "touppercase", //字母大写
              "tolowercase" //字
            ]
          ]
        },
        this.config
      ))
      this.editor.addListener('ready', () => {
        this.status = 2
        // this.$emit('ready', this.editor)
        this.editor.setContent(this.initValue)
        this._normalChangeListener()
      })
    },
    _normalChangeListener () {
      this.editor.addListener('contentChange', () => {
        this.$emit('input', this.editor.getContent())
      })
    },
    _setContent (value) {
      value === this.editor.getContent() || this.editor.setContent(value)
    }
  },
  beforeDestroy () {
    if (this.destroy && this.editor && this.editor.destroy) {
      this.editor.destroy()
    }
  }
}
</script>
