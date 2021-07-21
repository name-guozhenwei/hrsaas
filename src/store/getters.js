// 配了一些全局的getters方便访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  routes: state => state.permission.routes, // 导出当前路由
  roles: state => state.user.userInfo.roles

}
export default getters
