// 工资
import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  children: [
    // 工资默认首页
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys/index'),
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
