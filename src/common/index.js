import * as api from '@/fetch/api'
import dic from '@/common/dic'

const common = {
  // 导出excel表格方法
  exportData(text, url, callback, that) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob' // 返回类型blob
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.onload = function () {
      // 请求完成
      var blob = this.response
      var reader = new FileReader()
      reader.readAsDataURL(blob) // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        // 转换完成，创建一个a标签用于下载
        callback()
        var a = document.createElement('a')
        a.download = text + '.xlsx'
        if (e.target.result.length > 5) {
          a.href = e.target.result
          $('body').append(a) // 修复firefox中无法触发click
          a.click()
          $(a).remove()
        } else {
          that.$Message.error('报表没有记录')
        }
      }
    }
    // 发送ajax请求
    xhr.send()
  },
  formatDate(date, fmt) {
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
      let obj = h('Button', {
        props: {
          type: 'primary',
          size: 'small'
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
            size: 'small'
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
      }
      array.push(obj)
    })
    return array
  },
  validate: {
    telPhone: (rule, value, callback) => {
      let regexp = /^(0?1[358]\d{9})|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/
      if (value === '') {
        callback(new Error('请输入电话号码！'))
      } else if (!(regexp.test(value) || /^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('电话号码格式不正确！'))
      } else {
        callback()
      }
    },
    tel: (rule, value, callback) => {
      let regexp = /^(0?1[358]\d{9})|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/
      if (value === '') {
        callback(new Error('请输入电话号码！'))
      } else if (!(regexp.test(value))) {
        callback(new Error('电话号码格式不正确！'))
      } else {
        callback()
      }
    },
    phone: (rule, value, callback) => {
      if (!rule.require && !value) {
        // 非必填时
        callback()
        return
      }
      if (value === '') {
        callback(new Error('请输入手机号码！'))
      } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
        callback(new Error('手机号码格式不正确！'))
      } else {
        callback()
      }
    },
    email: (rule, value, callback) => {
      if (!rule.require && !value) {
        // 非必填时
        callback()
        return
      }
      let regexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (value === '') {
        callback(new Error('请输入邮箱！'))
      } else if (!(regexp.test(value))) {
        callback(new Error('邮箱格式不正确！'))
      } else {
        callback()
      }
    },
    integer: (rule, value, callback) => {
      if (!(/^[-\+]?\d+$/.test(value))) {
        callback(new Error('数据格式不正确！'))
      } else {
        callback()
      }
    },
    positiveInteger: (rule, value, callback) => {
      if (!(/^\+?[1-9][0-9]*$/.test(value))) {
        callback(new Error('数据格式不正确！'))
      } else {
        callback()
      }
    },
    floatNumber: (rule, value, callback) => {
      let regexp = /^(([1-9][0-9]*)|(([0]\.\d{1,7}|[1-9][0-9]*\.\d{1,7})))$/
      if (value === '') {
        callback(new Error('该项不能为空！'))
      } else if (!(regexp.test(value))) {
        callback(new Error('数据格式不正确！'))
      } else {
        callback()
      }
    },
    IdCodeValid: (rule, value, callback) => {
      if (!rule.require && !value) {
        // 非必填时
        callback()
        return
      }
      let city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)) {
        callback(new Error('身份证号格式错误!'))
      } else if (!city[value.substr(0, 2)]) {
        callback(new Error('身份证号地址编码错误！'))
      } else {
        // 18位身份证需要验证最后一位校验位
        if (value.length === 18) {
          value = value.split('')
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          // 校验位
          let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
          let sum = 0
          let ai = 0
          let wi = 0
          for (let i = 0; i < 17; i++) {
            ai = value[i]
            wi = factor[i]
            sum += ai * wi
          }
          if (parity[sum % 11] !== value[17].toUpperCase()) {
            callback(new Error('身份证号校验位错误!'))
          }
        }
      }
    }
  },
  dic,
  apiPrefix: '/api/admin'
}

export default common
