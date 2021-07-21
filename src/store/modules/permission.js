import { asyncRoutes, constantRoutes } from '@/router'
const state = {
// 路由表,标记当前用户所拥有的所有路由
  routes: constantRoutes || [] // 默认静态路由表
}
const mutations = {
  // otherRoutes 登入成功后,需要添加的新路由
  setRoutes(state, otherRoutes) {
    // 静态路基础上,累加其他权限路由
    state.routes =
    [
      ...constantRoutes,
      ...otherRoutes,
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
}
const actions = {
  // 筛选路由权限
  filterRoutes(context, menus) {
    const otherRoutes = asyncRoutes.filter(item => {
      // 如果路由模块的首页name,在menus数组中包含,就是对这个模块开放
      if (menus.includes(item.children[0].name)) {
        return true
      } else {
        return false
      }
    })
    context.commit('setRoutes', otherRoutes)
    return otherRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
