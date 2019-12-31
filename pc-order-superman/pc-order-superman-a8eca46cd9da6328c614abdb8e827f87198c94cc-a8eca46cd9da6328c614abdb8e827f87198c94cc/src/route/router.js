/**
 * 路由文件
 */
import { Root, Login, Home } from './defined'
import Account from './modules/account'
import Module from './modules/module'
import Order from './modules/order'

const LoginView = () => import('@/views/login/index')
const LayoutView = () => import('@/views/layout/index')
const HomeView = () => import('@/views/layout/index')

export const globalRouterListMap = [
  {
    path: Root,
    redirect: Home,
    component: LayoutView,
    children: [
      {
        path: Home,
        name: 'home',
        component: HomeView
      }
    ]
  },
  {
    path: Login,
    name: 'login',
    component: LoginView
  }
]

export const asyncRouterMap = [
  Account,
  Module,
  Order
]
