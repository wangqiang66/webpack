/**
 * 终止对外暴露的文件
 */
import Vue from 'vue'
import Router from 'vue-router'
import { globalRouterListMap } from './router'

Vue.use(Router)

const router = new Router({
  routes: globalRouterListMap
})

export default router
