// import * as api from '@/fetch/api'
// select下拉常量
import dic from '@/common/dic'
// 配置文件
import config from '@/config'
import {Message} from 'iview'
// 表单验证扩展
import validate from "@/validate";
// app实例
import App from '@/main'
import store from '../store'
const common = {
  // 数字格式化
  formatNumber(number, decimals, dec_point, thousands_sep) {
  /*
  　　 * 参数说明：
  　　 * number：要格式化的数字
  　　 * decimals：保留几位小数
  　　 * dec_point：小数点符号
  　　 * thousands_sep：千分位符号
  　　 * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  // 获取小数的位数
  let pointLength = 0
  if(number.includes(".")){
    pointLength = number.split('.')[1].length;
  }
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? pointLength : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ', ' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while(re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
},
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
    if(store.state.list.params.merchantNo){
      delete store.state.list.params.merchantNo
    }
    if(store.state.list.params.merchantCode){
      delete store.state.list.params.merchantCode
    }
    if(store.state.list.params.merchantName){
      delete store.state.list.params.merchantName
    }

    if(keyword){
      let newValueArr = keyword.split("(");
      let params = {
        vagueMerchantMark: newValueArr[0],
        columnType:2,// 1 商户号模糊查询 2 商户名模糊查询
      }
      let url = '/merchant/queryMerchantListByVagueMerchantMark'
      App.apiPost(url,params).then(res=>{
        if(res.success){
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
          store.state.global.searchMerchantList = searchMerchantList
        }else{
          Message.error(res.message||'无响应')
        }
      })
    }
  },
  // 判断是否有权限
  auth(authName){
    // authName 如果为布尔值，直接判断权限
    if(typeof authName == 'string'){
      let authList = JSON.parse(sessionStorage.getItem('authList'))
      return authList.includes(authName)
    }else{
      return authName || true
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
      let searchMerchantList = store.state.global.searchMerchantList
      let merchant = searchMerchantList[params[merchantCodeField]] ||
        searchMerchantList[params[merchantNameField]] ||
        searchMerchantList[params[merchantNameField]+"("+params[merchantCodeField]+")"]
      if(merchant){
        params[merchantNameField] = merchant.merchantName
        params[merchantCodeField] = merchant.merchantCode
      }else{
        let newValueArr = []
        if(params[merchantNameField]){
          newValueArr = params[merchantNameField].split("(")
        }else if(params[merchantCodeField]){
          newValueArr = params[merchantCodeField].split("(");
        }
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
    console.log(url)
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
      'H+': date.getHours(),
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
  authList:[],
  // 菜单列表转为树形结构
  menuToTree(menuList){
    // 最多三级结构
    // memuObj过度层，目标结构为 {一级索引:{二级索引:[]}}
    // 以id为key值
    let memuObj = {}
    // 一二级关联
    let memuObj12 = {
      // 1:[4,5,6]
    }
    // 二三级关联
    let memuObj23 = {
      // 1:[4,5,6]
    }
    // 一二三级关联
    let memuObj123 = {}
    let menuTree = []
    menuList.forEach((ele,index)=>{
      common.authList.push(ele.tag)
      memuObj[ele.id] = ele
      // 获取一二级关联
      if(ele.deep == 2){
        if(!memuObj12[ele.parentId]){
          memuObj12[ele.parentId]=[ele.id]
        }else{
          memuObj12[ele.parentId].push(ele.id)
        }
      }
      // 获取二三级关联
      if(ele.deep == 3){
        if(!memuObj23[ele.parentId]){
          memuObj23[ele.parentId]=[ele.id]
        }else{
          memuObj23[ele.parentId].push(ele.id)
        }
      }
    })
    // 123及关联
    Object.keys(memuObj12)
      .forEach(ele=>{
        if(memuObj123[ele]){
          memuObj12[ele]
            .sort(common.menuSort(memuObj))
            .forEach(sele=>{
              memuObj123[ele][sele]= memuObj23[sele]
            })
        }else{
          memuObj123[ele] = {}
          memuObj12[ele]
            .forEach(sele=>{
                memuObj123[ele][sele]= memuObj23[sele]
            })
        }
    })
    // 生成树形结构
    Object.keys(memuObj123)
      .sort(common.menuSort(memuObj))
      .forEach(ele=>{
       let oneMenu = memuObj[ele]
        oneMenu.list = []
        Object.keys(memuObj123[ele])
          .sort(common.menuSort(memuObj))
          .forEach(sele=>{
            let twoMenu = memuObj[sele]
            twoMenu.list = []
            memuObj123[ele][sele]
              .sort(common.menuSort(memuObj))
              .forEach(ssele=>{
                let threeMenu = memuObj[ssele]
                twoMenu.list.push(threeMenu)
              })
            oneMenu.list.push(twoMenu)
          })
        menuTree.push(oneMenu)
      })
    return {menuTree}
  },
  // 检查是否有权限
  checkAuth(auth){
    let isAuth = false
    if(common.authList.include(auth)){
      isAuth = true
    }
    return isAuth
  },
  menuSort(memuObj23){
    return (a,b)=>{
      if(memuObj23[a].sort > memuObj23[b].sort){
        return 1
      }else if(memuObj23[a].sort == memuObj23[b].sort){
        return 0
      }else {
        return -1
      }
    }
  },
  columnsHandle(h, actions) {
    let array = []
    actions.forEach(element => {
      if(common.auth(element.auth)){
        let obj = h('a', {
          style: {
            color:element.color||'#2d8cf0',
            margin: '5px',
            marginLeft: 0,
            marginRight:element.marginRight||'5px'
          },
          on: {
            click: () => {
              element.action()
            }
          }
        }, element.title)
        array.push(obj)
      }
    })
    return array
  },
  columnsItemRender(h, actions) {
    let array = []
    let obj = ''
    actions.forEach(element => {
      if(typeof element.type == 'undefined'){
        element.type = 'a'
      }
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
      }
      else if(element.type =='text'){
        obj = h('span', {
          style: {
            margin: '5px',
            marginLeft: 0
          },

        },element.title)
      }
      else if(element.type =='router'){
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
      else if(element.type =='a'){
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
      else if(element.type =='dropdown'){
        let DropdownItem = []
        element.data.forEach(item => {
          if(common.auth(item.auth)){
            DropdownItem.push(h("DropdownItem",{
              props:{
                name:item.value
              }
            },item.label))
          }
        })
        let title =  h("a",{
          props:{
            href:"javascript:void(0)"
          }
        },[element.title,h('Icon',{props:{type:"ios-arrow-down"}})])
        let DropdownMenu = h("DropdownMenu",{slot:"list"},DropdownItem)
        obj = h('Dropdown', {
          on: {
            'on-click':(value)=>{
              element.onClick(value)
            }
          }
        },[title,DropdownMenu])
      }
      array.push(obj)
    })
    return array
  },
  async listDelete(obj, options) {
    let res = {}
    if(obj.method == "get"){
      res = await App.apiGet(options.url, options.params || {},options.apiPrefix)
    }else{
      res = await App.apiPost(options.url, options.params || {},options.apiPrefix)
    }

    options.callback(res)
  },
  async listDone(obj, options) {
    let res = await App.apiPost(options.url, options.params || {})
    options.callback(res)
  },
  validate,
  dic,
  config,
}
export default common
