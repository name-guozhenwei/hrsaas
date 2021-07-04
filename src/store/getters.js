// 配了一些全局的getters方便访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device
}
export default getters
