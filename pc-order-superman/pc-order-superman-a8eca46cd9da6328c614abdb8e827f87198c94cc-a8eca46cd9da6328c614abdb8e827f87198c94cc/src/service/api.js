/**
 * function: api
 * author  : wq
 * update  : 2018/9/5 9:29
 */
import wx from 'wx'
import Fly from 'fly'
import AppConfig from '@/config/index'
let request
if (AppConfig.debug) {
  const EngineWrapper = require('flyio/dist/npm/engine-wrapper')
  const mock = require('./mock').default
  const engine = EngineWrapper(mock)
  request = new Fly(engine)
} else {
  request = new Fly()
}

request.interceptors.request.use((request) => {
  if (!request.noLoading) {
    wx.showNavigationBarLoading()
  }
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    if (!response.request.noLoading) {
      wx.hideNavigationBarLoading()
    }
    const data = response.data || {}
    if (data.success && data.code !== '200') {
      if (!response.request.defineError) {
        wx.showToast({
          title: data.retMsg,
          icon: 'none'
        })
      }
      return promise.reject(data)
    }
    return promise.resolve(data.result)
  },
  (err, promise) => {
    if (!err.request.noLoading) {
      wx.hideNavigationBarLoading()
    }
    if (!err.request.defineError) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
    promise.reject({
      code: '-001',
      msg: '网络连接失败，请稍后重试'
    })
  }
)

export default request
