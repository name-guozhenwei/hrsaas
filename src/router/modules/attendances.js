// 考勤
import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  children: [
    // 考勤默认首页
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances/index'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
