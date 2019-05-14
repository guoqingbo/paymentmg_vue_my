let dateServer = (value) => {
  return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
}
let noFristArr = (arr) => {
  arr.splice(0, 1)
  return arr
}

let adType = (value) => {
  let text = ''
  switch (value) {
    case 'main_page_top':
      text = '首页顶部轮播'
      break
    case 'person_center_bg':
      text = '个人中心背景'
      break
    case 'pay_page_ad':
      text = '支付成功页广告'
      break
    case 'main_page_fix':
      text = '首页顶部横条'
      break
  }
  return text
}
let status = (value) => {
  let text = ''
  switch (value) {
    case 'main_page_top':
      text = '首页顶部轮播'
      break
    case 'person_center_bg':
      text = '个人中心背景'
      break
    case 'pay_page_ad':
      text = '支付成功页广告'
      break
    case 'main_page_fix':
      text = '首页顶部横条'
      break
  }
  return text
}
export {
  adType,
  status
}
