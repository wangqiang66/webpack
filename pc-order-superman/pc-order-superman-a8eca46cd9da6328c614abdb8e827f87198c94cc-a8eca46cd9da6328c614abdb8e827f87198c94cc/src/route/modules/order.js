/**
 * function: 收单管理
 * author  : wq
 * update  : 2018/9/19 10:43
 */
const LayoutView = () => import('@/views/layout/index')
const AccountListView = () => import('@/views/layout/index')

const accountRoute = {
  path: '/order',
  component: LayoutView,
  redirect: '/order/list',
  name: 'Order',
  meta: {
    title: '收单管理',
    icon: 'el-icon-menu',
    menu: true,
    sort: 10
  },
  children: [
    {
      path: '/order/list',
      component: AccountListView,
      name: 'AccountList',
      meta: {
        title: '收单记录',
        icon: 'el-icon-menu',
        menu: true,
        sort: 10
      }
    }
  ]
}

export default accountRoute
