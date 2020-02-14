import axios from 'axios'
import qs from 'qs'
import config from '@/config/index'
import VueCookies from 'vue-cookies'

axios.defaults.timeout = 5000
axios.defaults.baseURL = config.apiAdminPrefix;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request 拦截器
axios.interceptors.request.use(
  config => {
    config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
    config.timeout = 6000
    let token = VueCookies.get('token')
    if (token) {
      config.headers.token=token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response拦截
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // if(error.response.data.status==401){
    //   setCookies('userId','',-1)
    //   setCookies('token','',-1)
    //   // return  window.location.href='http://pms.sendinfo.com.cn/login'
    // }
    return Promise.reject(error)
  }
)

// function setCookies(cname, cvalue, exdays) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//   var expires = "expires=" + d.toUTCString();
//   console.info(cname + "=" + cvalue + "; " + expires);
//   document.cookie = cname + "=" + cvalue + "; " + expires;
// }

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function apiGet (url, params = {},apiPrefix) {
  if(!url){
   return
  }
  // 如果设置了前缀
  axios.defaults.baseURL = apiPrefix || config.apiAdminPrefix;

  return new Promise((resolve, reject) => {
    axios.get(url, {params:{...params}})
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPost (url, params = {},apiPrefix) {
  // 如果设置了前缀
  axios.defaults.baseURL = apiPrefix || config.apiAdminPrefix;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return new Promise((resolve, reject) => {
    params = qs.stringify(params)
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPostJson (url, params = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装DELETE方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiDelete (url, params = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装UPDATE方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPut (url, params = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装get blob方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiGetBlob (url, params = {},apiPrefix) {
  // 如果设置了前缀
  axios.defaults.baseURL = apiPrefix || config.apiAdminPrefix;
  return new Promise((resolve, reject) => {
    axios({
      method:'get',
      url:url,
      params,
      responseType:'blob'
    }) .then(response => {
      resolve(response.data)
    }).catch(err => {
        reject(err)
      })
  })
}
