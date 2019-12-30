/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import configRouter from './route-config'
import Toast from 'wdui/lib/toast'
import Picker from 'wdui/lib/picker'
import MessageBox from 'wdui/lib/message-box'
import Dialog from 'wdui/lib/dialog'
import Popup from 'wdui/lib/popup'
import Button from 'wdui/lib/button'
import Navbar from 'wdui/lib/navbar'
import Cell from 'wdui/lib/cell'
import Tabbar from 'wdui/lib/tabbar'
import TabItem from 'wdui/lib/tab-item'
import TabContainer from 'wdui/lib/tab-container'
import TabContainerItem from 'wdui/lib/tab-container-item'
import Switch from 'wdui/lib/switch'
import VueDND from 'awe-dnd'
import Radio from 'wdui/lib/radio'
import RadioGroup from 'wdui/lib/radio-group'

import './assets/reset.css'
import store from './store'
// import './assets/green.scss'
import './assets/blue.scss'
import { getQueryStr } from './util/util'
import ddSingle from '@/dd'
import './css/common.scss'
import './css/_var.scss'
import { getHistoryList, addHistoryItem, popLastHistoryItem, getHistoryLength, setHistoryLength, setIsBack, getIsBack } from '@/util/historyLocal'

var from = getQueryStr('from') || ''
if (!from) {
  // 隐藏订订右上角菜单
  ddSingle.setRightMenu()
}
Vue.use(VueDND)
Vue.$Picker = Vue.prototype.$Picker = Picker
Vue.$MessageBox = Vue.prototype.$MessageBox = MessageBox
Vue.$Toast = Vue.prototype.$Toast = Toast
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Navbar.name, Navbar)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Dialog.name, Dialog)
Vue.component(Switch.name, Switch)
Vue.component(Popup.name, Popup)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)

Vue.use(VueRouter)

const router = new VueRouter(configRouter)
Vue.prototype.skipRouter = function(options, ...args) {
  setIsBack(false)
  if (typeof options === 'object') {
    if (options.isBack === true) {
      setIsBack(true)
      options.isBack = undefined
      delete options.isBack
    }
  }
  router.push(options, ...args)
}
router.beforeEach((to, from, next) => {
  if (Vue.prototype.pickerInstance) {
    Vue.prototype.pickerInstance.value = false
    Vue.prototype.pickerInstance = null
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const routerList = getHistoryList()
  const routeLength = getHistoryLength()
  const len = history.length
  const isBack = getIsBack()
  // 后退或者替换
  if (len <= routeLength) {
    // 后退 替换 和 前进或者后退后又点击其他
    if (routerList.length && isBack) {
      popLastHistoryItem()
      to.meta.isBack = true
      // 前进
    } else if (routerList.length && routerList.indexOf(from.name) === routerList.length - 1) {
      to.meta.isBack = false
    } else {
      addHistoryItem(from.name || '/')
      to.meta.isBack = false
    }
    setHistoryLength(len)
  } else {
    addHistoryItem(from.name || '/')
    setHistoryLength(len)
    to.meta.isBack = false
  }
  setIsBack(true)
  next()
})

router.afterEach((to, from) => {
  setTimeout(() => {
    const len = history.length
    setHistoryLength(len)
  }, 50)
})

new Vue({
  el: '#app',
  router: router,
  store,
  render (h) {
    const keepAlive = this.$route.meta.keepAlive
    if (keepAlive) {
      return (
        <div id="app-box">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      )
    } else {
      return (
        <div id="app-box">
          <keep-alive>
          </keep-alive>
          <router-view></router-view>
        </div>
      )
    }
  }
})

export default Vue