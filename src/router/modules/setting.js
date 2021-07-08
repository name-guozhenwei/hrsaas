// 公司设置
import Layout from '@/layout'

export default {
  path: '/setting',
  component: Layout,
  children: [
    // 公司设置默认首页
    {
      path: '',
      name: 'setting',
      component: () => import('@/views/setting/index'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
