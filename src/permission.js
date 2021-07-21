import router from '@/router'
import store from '@/store'
// 引入一份进度条
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// import { asyncRoutes } from '@/router/index'

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
      // 调用获取信息的action
        const { roles: { menus }} = await store.dispatch('user/getUserInfo')
        // console.log(res)
        // 调用action同步到vuex中
        const otherRoutes = await store.dispatch('permission/filterRoutes', menus)
        // 拿到权限信息之后,应该根据权限信息,从动态路由模块中筛选出,需要追加的路由
        // 追加到routes规则中,addRoutes
        router.addRoutes(
          [...otherRoutes,
            { path: '*', redirect: '/404', hidden: true }
          ]
        )
        next({
          ...to, // next({...to}) 的目的,是保证路由添加完了在进行页面(可以理解为重新一次)
          replace: true // 重进一次,不保留重复历史
        })
        return
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

