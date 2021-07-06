import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// 创建一个axios的实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// 添加请求拦截器
request.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.getters.token
  // 有token 注入token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  const res = response.data
  const { message, success } = res
  // 判断 如果success不是true,则提示错误信息
  if (!success) {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message)) // 此时已经错误了,应该进catch
  }
  return res
}, function(error) {
  // 对响应错误做点什么
  // 服务器错误. 400 404, 500
  console.dir(error) // 便于后期调试
  Message.error(error.message) // 便于错误消息
  return Promise.reject(error)
})

export default request // 导出axios实例

