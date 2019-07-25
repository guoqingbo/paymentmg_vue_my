import * as api from '@/fetch/api'
// select下拉常量
import dic from '@/common/dic'
// 配置文件
import config from '@/config'
import {Message} from 'iview'
// 表单验证扩展
import validate from "@/validate";

const common = {
  // 导出excel表格方法
  exportData({url,params, callback,text}) {
    api.apiGetBlob(url,params).then(res=>{
      if(res){
        let url = window.URL.createObjectURL(res)
        let a = document.createElement('a')
        a.href = url
        a.download = text?text + '.xlsx':'下载.xlsx'
        $('body').append(a) // 修复firefox中无法触发click
        a.click()
        $(a).remove()
        callback()
      }else {
        Message.error('报表没有记录')
      }
    })
  },
  // 数组变对象（select下拉的数组）
  arrayTurnObj(arr){
    let obj = {}
    if(arr instanceof Array){
      arr.forEach(ele=>{
        obj[ele.value] = ele.label
      })
    }
    return obj
  },
  // 日期格式化
  formatDate(date, fmt) {
    if(typeof date == 'string' || typeof date == 'number'){
      date = new Date(date)
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
      }
    }
    return fmt;
  },

  changeLoading(obj) {
    obj.loading = false
    obj.$nextTick(() => {
      obj.loading = true
    })
  },
  // 此处'formItem'要改用变量传值，因为一个页面会有多个表单？？？modalName-form ref
  formPost(obj, options) {
    obj.$refs[options.modalName ? options.modalName : 'formItem'].validate(async (valid) => {
      if (valid) {
        let res = await api.apiPost(options.url, options.params)
        // console.log(res)
        if (res.success) {
          switch (options.mold) {
            case 'modal':
              obj.$refs.gridTable.loadpage()
              break;
            case 'page':

              break
          }
        } else if (res.status === 200) {
          switch (options.mold) {
            case 'modal':
              break
          }
        } else {
          obj.$Message.error(res.message)
          return this.changeLoading(obj)
        }
        options.callback(res)
      } else {
        if (options.mold === 'modal') {
          return this.changeLoading(obj)
        }
      }
    })
  },
  async listDelete(obj, options) {
    let res = await api.apiPost(options.url, options.params || {})
    options.callback(res)
  },
  async listDone(obj, options) {
    let res = await api.apiPost(options.url, options.params || {})
    options.callback(res)
  },
  columnsHandle(h, actions) {
    let array = []
    actions.forEach(element => {
      let obj = h('a', {
        // props: {
        //   type: 'primary',
        //   size: 'small'
        // },
        style: {
          margin: '5px',
          marginLeft: 0
        },
        on: {
          click: () => {
            element.action()
          }
        }
      }, element.title)
      array.push(obj)
    })
    return array
  },
  columnsItemRender(h, actions) {
    let array = []
    let obj = ''
    actions.forEach(element => {
      if(element.type =='Button'){
        obj = h('Button', {
          props: {
            type: 'primary',
            size: 'small',
            loading:element.loading
          },
          style: {
            margin: '5px',
            marginLeft: 0
          },
          on: {
            click: () => {
              element.action()
            }
          }
        }, element.title)
      }else if(element.type =='text'){
        obj = h('span', {
          style: {
            margin: '5px',
            marginLeft: 0
          },

        },element.title)
      }else if(element.type =='router'){
        obj = h('router-link', {
          props: {
            to: element.to,
          },
          style: {
            margin: '5px',
            marginLeft: 0
          },
        },element.title)
      }else if(element.type =='a'){
        obj = h('a', {
          style: {
            margin: '5px',
            marginLeft: 0
          },
          on: {
            click: () => {
              element.action()
            }
          }
        },element.title)
      }
      array.push(obj)
    })
    return array
  },
  validate,
  dic,
  config,
}
export default common
