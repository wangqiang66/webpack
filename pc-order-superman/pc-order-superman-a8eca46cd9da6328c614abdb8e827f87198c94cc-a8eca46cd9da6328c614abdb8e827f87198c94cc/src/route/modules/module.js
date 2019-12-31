/**
 * function: 模板管理
 * author  : wq
 * update  : 2018/9/19 10:43
 */
const LayoutView = () => import('@/views/layout/index')
const AccountListView = () => import('@/views/layout/index')

const accountRoute = {
  path: '/module',
  component: LayoutView,
  redirect: '/module/list',
  name: 'Module',
  meta: {
    title: '模板管理',
    icon: 'el-icon-menu',
    menu: true,
    sort: 10
  },
  children: [
    {
      path: '/module/list',
      component: AccountListView,
      name: 'AccountList',
      meta: {
        title: '模板列表',
        icon: 'el-icon-menu',
        menu: true,
        sort: 10
      }
    }
  ]
}

export default accountRoute
