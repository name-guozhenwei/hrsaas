import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
// 全局组件
import Components from './components'
// 过滤器
import * as filters from '@/filters' // 引用工具类
import Print from 'vue-print-nb'
import '@/styles/element-variables.scss'
import i18n from '@/lang'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(Print)
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
// 批量注册全局的自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Vue.use(Components)
// 将request方法,挂载到原型上
import request from '@/utils/request'
Vue.prototype.$request = request
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
