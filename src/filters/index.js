import dic from '@/common/dic'

let turn = (type,value) => {
  let text = ''
  // 如果数据字典存在该类型的数据
  if(type && dic[type]){
    dic[type].forEach(item=>{
      if(item.value == value){
        text = item.label
      }
    })
  }else {
    text = '数据字典('+type+')不存在'
  }
  return text
}
export {
  turn
}
