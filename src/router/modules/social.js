// 社保
import Layout from '@/layout'

export default {
  path: '/social',
  component: Layout,
  children: [
    // 社保默认首页
    {
      path: '',
      name: 'social',
      component: () => import('@/views/social/index'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
