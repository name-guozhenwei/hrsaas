// 员工
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    // 员工默认首页
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/index'),
      meta: { title: '员工', icon: 'people' }
    }
  ]
}
