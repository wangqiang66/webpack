/**
 * function: 权限控制
 * author  : wq
 * update  : 2018/9/17 15:47
 */
import router from './index'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'
import store from '@/store'

NProgress.configure({ showSpinner: false })

// 查看用户权限是否存在
function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = [ '/login' ]
/**
 * 如果Token不存在，表示用户没有登录过
 * 如果用户的Token存在并且用户存在，表示用户最近有登录，不需要重新登录
 * 如果用户的Token存在但是用户信息不存在，则表示用户页面存在刷新，需要重新通过Token获取用户信息
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: 'home' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(data => {
          const roles = data.roles
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true })
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next(`/login?redirect=${encodeURIComponent(to.path)}`)
          })
        })
      } else {
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } })
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) >= 0) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
