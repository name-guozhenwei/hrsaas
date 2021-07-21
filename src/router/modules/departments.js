// 组织架构
import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout,
  children: [
    // 组织架构默认首页
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/index'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
