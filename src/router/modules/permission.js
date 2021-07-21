// 权限管理
import Layout from '@/layout'

export default {
  path: '/permission',
  component: Layout,
  children: [
    // 权限管理默认首页
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permission/index'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
