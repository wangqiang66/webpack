/**
 * function: account
 * author  : wq
 * update  : 2018/9/19 10:43
 */
const LayoutView = () => import('@/views/layout/index')
const AccountListView = () => import('@/views/account/list')

const accountRoute = {
  path: '/account',
  component: LayoutView,
  redirect: '/account/list',
  name: 'Account',
  meta: {
    title: '用户管理',
    icon: 'el-icon-menu',
    menu: true,
    sort: 10
  },
  children: [
    {
      path: '/account/list',
      component: AccountListView,
      name: 'AccountList',
      meta: {
        title: '用户列表',
        icon: 'el-icon-menu',
        menu: true,
        sort: 10
      }
    }
  ]
}

export default accountRoute
