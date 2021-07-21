import { reqLogin, reqGetUserInfo, reqGetBaseInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'

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
  },
  // 删除token
  removeToken(state) {
    // 清除 vuex token的同时,同步到本地cookie中移除
    state.token = ''
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 发送请求获取token
  async login(context, loginForm) {
    // 发送请求,获取 token
    const { data } = await reqLogin(loginForm)
    // console.log(data)
    const newToken = data
    // console.log(newToken)
    // 提交mutation,将token存到state中
    context.commit('setToken', newToken)
    // 必须要return出去 ,否则报 undefined
    return data
  },
  // 获取用户资料
  async getUserInfo(context) {
    const { data: data1 } = await reqGetUserInfo() // data 就是用户基本资料
    const { data: data2 } = await reqGetBaseInfo(data1.userId) // 包含头像的资料
    const resultObj = {
      ...data1,
      ...data2
    }
    context.commit('setUserInfo', resultObj)
    // 将两次拿到的个人信息结果合并在一起

    // 必须要return出去 ,否则报 undefined
    return resultObj
  },
  // 实现退出功能
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除个人资料
    context.commit('removeUserInfo')
    // 重置理由
    resetRouter()
    // 重置 vuex 中的路由信息
    context.commit('permission/setRoutes', [], { root: true })
    // 清除主题色信息
    context.commit('settings/resetTheme', null, { root: true })
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
