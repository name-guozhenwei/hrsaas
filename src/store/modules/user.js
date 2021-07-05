import { reqLogin } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
}
const mutations = {
  // 设置token
  setToken(state, newToken) {
    state.token = newToken
    // 设置token 的同时,同步到本地cookies中
    setToken(newToken)
  }
}
const actions = {
  // 发送请求获取token
  login(context, data) {
    return new Promise((resolve, reject) => {
      // 发送登录请求,异步操作
      reqLogin(data).then(res => {
        // console.log(res)
        const newToken = res.data.data
        context.commit('setToken', newToken)
        // 成功
        resolve(res.data.data.message)
      }).catch(error => {
        // 失败
        reject(error)
      })
    })

    // const res = reqLogin(data)
    // console.log(res)
    // const newToken = res.data.data
    // // 提交mutation,将token粗存到state中
    // context.commit('setToken', newToken)
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
