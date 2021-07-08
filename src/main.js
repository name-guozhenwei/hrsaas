import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// import { imgerror, color } from '@/directives'
// Vue.directive('imgerror', imgerror)
// Vue.directive('color', color)
import * as directives from '@/directives'
// console.log(directives)
// for (const key in directives) {
//   Vue.directive(key, directives[key])
// }
// 批量注册全局的自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 将request方法,挂载到原型上
import request from '@/utils/request'
Vue.prototype.$request = request
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
