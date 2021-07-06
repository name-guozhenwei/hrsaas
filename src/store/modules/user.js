import { reqLogin, reqGetUserInfo, reqGetBaseInfo } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  // 获取token
  token: getToken() || '',
  // 获取用户信息
  userInfo: {}
}
const mutations = {
  // 设置token
  setToken(state, newToken) {
    state.token = newToken
    // 设置token 的同时,同步到本地cookies中
    setToken(newToken)
  },
  // 设置用户信息
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  }
}
const actions = {
  // 发送请求获取token
  async login(context) {
    // 发送请求,获取 token
    const { data } = await reqLogin(data)
    const newToken = data
    // 提交mutation,将token存到state中
    context.commit(setToken, newToken)
    // 必须要return出去 ,否则报 undefined
    return data
  },
  // 获取用户资料
  async getUserInfo(context) {
    const { data: data1 } = await reqGetUserInfo() // data 就是用户基本资料
    const { data: data2 } = await reqGetBaseInfo(data1.userId) // 包含头像的资料
    context.commit('setUserInfo', data1)
    // 将两次拿到的个人信息结果合并在一起
    const resultObj = {
      ...data1,
      ...data2
    }
    // 必须要return出去 ,否则报 undefined
    return resultObj
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
