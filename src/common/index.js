// import * as api from '@/fetch/api'
// select下拉常量
import dic from '@/common/dic'
// 配置文件
import config from '@/config'
// import {Message} from 'iview'
// 表单验证扩展
import validate from "@/validate";
// app实例
import App from '@/main'
const common = {
  // 日期转为时间戳，如果不带时分秒，则存在时差
  formateDateStr(str){
    if(str.length <19){
      str += ' 00:00:00'.substring(10-str.length)
    }
    return str
  },
  // 根据条件设置数组的某一项
  setArrItem(arr,condition,itemData){
    // condition 可以直接为value 或 key = value 自定义
    // 默认key
    let key = 'name'
    let value = ''
    let itemIndex = ''
    if (typeof condition === 'string'){
      let conditionArr = condition.split("=")
      if (conditionArr.length == 2) {
        key = conditionArr[0]
        value = conditionArr[1]
      }else{
        value =  conditionArr[0]
      }
    }
    for(let i = 0,length = arr.length;i<length;i++){
      if(arr[i][key] == value){
        itemIndex = i
        break
      }
    }
    // 合并数组的项
    arr[itemIndex] = Object.assign(arr[itemIndex],itemData)
  },
  // 根据条件获取数组的某一项
  getArrItem(arr,condition){
    // condition 可以直接为value 或 key = value 自定义
    // 默认key
    let key = 'name'
    let value = ''
    let itemIndex = ''
    if (typeof condition === 'string'){
      let conditionArr = condition.split("=")
      if (conditionArr.length == 2) {
        key = conditionArr[0]
        value = conditionArr[1]
      }else{
        value =  conditionArr[0]
      }
    }
    for(let i = 0,length = arr.length;i<length;i++){
      if(arr[i][key] == value){
        itemIndex = i
        break
      }
    }
    return arr[itemIndex]
  },
  // 商户信息模糊查询
  searchMerchantList(keyword,autoComplete){

    // 清空旧的搜索商户赋值
    if(App.$store.state.list.params.merchantNo){
      delete App.$store.state.list.params.merchantNo
    }
    if(App.$store.state.list.params.merchantCode){
      delete App.$store.state.list.params.merchantCode
    }
    if(App.$store.state.list.params.merchantName){
      delete App.$store.state.list.params.merchantName
    }

    if(keyword){
      let newValueArr = keyword.split("(");
      let params = {
        vagueMerchantMark: newValueArr[0],
        columnType:2,// 1 商户号模糊查询 2 商户名模糊查询
      }
      let url = '/merchant/queryMerchantListByVagueMerchantMark'
      App.apiPost(url,params).then(res=>{
        if(res.status == 200){
          let data = []
          // 用于匹配获取商户名商户号
          let searchMerchantList = {}
          if(res.data.length){
            res.data.forEach(ele=>{
              let label = ele.merchantName+"("+ele.merchantCode+")"
              searchMerchantList[label] = ele
              data.push({label,value:label})
            })
          }else{
            data = [{label:'暂无数据',value:''}]
          }
          autoComplete.data = data
          App.$store.state.global.searchMerchantList = searchMerchantList
        }
      })
    }
  },
  // 商户名，商户号拆分
  splitMerchant(params){
    let merchantCodeField = ''
    let merchantNameField = ''
    if(typeof params.parentMerchantCode != 'undefined'){
      merchantCodeField = 'parentMerchantCode'
      merchantNameField = 'parentMerchantName'
    }else if (typeof params.merchantCode != 'undefined'){
      merchantCodeField = 'merchantCode'
      merchantNameField = 'merchantName'
    }else if (typeof params.merchantNo != 'undefined'){
      merchantCodeField = 'merchantNo'
      merchantNameField = 'merchantName'
    }else if(typeof params.merchantName != 'undefined'){
      merchantCodeField = 'merchantCode'
      merchantNameField = 'merchantName'
    }
    if(params[merchantCodeField] || params[merchantNameField]){
      let searchMerchantList = App.$store.state.global.searchMerchantList
      let merchant = searchMerchantList[params[merchantCodeField]] ||
        searchMerchantList[params[merchantNameField]] ||
        searchMerchantList[params[merchantNameField]+"("+params[merchantCodeField]+")"]
      if(merchant){
        params[merchantNameField] = merchant.merchantName
        params[merchantCodeField] = merchant.merchantCode
      }else{
        let newValueArr = params[merchantNameField].split("(") || params[merchantCodeField].split("(");
        params[merchantNameField] = newValueArr[0]
        if(newValueArr[1]){
          let merchantCode = newValueArr[1].replace(/\)/g,'');
          params[merchantCodeField] = merchantCode
        } else {
          params[merchantCodeField] = ''
        }
      }
    }else{
      params[merchantNameField] = ''
      params[merchantCodeField] = ''
    }
    return params
  },
  // 导出excel表格方法
  exportData({url,params, callback,text}) {
    App.apiGetBlob(url,params).then(res=>{
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
        App.Message.error('报表没有记录')
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
        let res = await App.apiPost(options.url, options.params)
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
    let res = await App.apiPost(options.url, options.params || {})
    options.callback(res)
  },
  async listDone(obj, options) {
    let res = await App.apiPost(options.url, options.params || {})
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
