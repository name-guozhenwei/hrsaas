// 审批
import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [
    // 审批默认首页
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals/index'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
