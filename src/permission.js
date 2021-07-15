import router from '@/router'
import store from '@/store'
// 引入一份进度条
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 导航前置守卫
// 定义白名单 所有不受权限控制的页面
const whiteList = ['/login', '/404']
// 导航前置守卫
router.beforeEach(async(to, from, next) => {
  // console.log(to)
  NProgress.start()
  const token = store.getters.token
  // console.log(token)
  // 判断有无token
  if (token) {
    // 判断是不是去登录页
    if (to.path === '/login') {
      next('/') // 引导到首页
      NProgress.done()
    } else {
      // 如果当前vuex中已经有用户资料,就不需要在获取了
      if (!store.state.user.userInfo.userId) {
      // 没有id表示当前用户资料还没有获取过.就获取下一次
        await store.dispatch('user/getUserInfo')
        // console.log(res)
      }
      next() // 放行
    }
  } else {
    // 看在不在白名单中(免登陆即可访问的页面)
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => {
  NProgress.done()
})

