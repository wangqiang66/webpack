/**
 * function: 钉钉内部的一些内容
 * author  : wq
 * update  : 2018/10/9 17:06
 */
import dd from 'dingtalk'

export class DingTalk {
  // 钉钉的配置是否完成
  DDConfig = false
  // 钉钉的企业配置信息
  ddCompanyConfig = null
  // 钉钉免登的code
  code = null
  // 设置右上角的菜单
  setRightMenu () {
    dd.ready(function () {
      dd.biz.navigation.setRight({
        show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: false, // 是否控制点击事件，true 控制，false 不控制， 默认false
        text: '更多', // 控制显示文本，空字符串表示显示默认文本
        onSuccess: function (result) {
        },
        onFail: function(err) {}
      })
    })
  }

  // 获取免登授权码
  getAuthCode (corpId) {
    return new Promise((resolve, reject) => {
      // 因为code的有效期是5分钟，避免多次获取，我将code存起来
      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId,
          onSuccess (result) {
            resolve(result)
          },
          onFail (err) {
            const rErr = err || {}
            reject({
              retCode: rErr.errroCode,
              retMsg: rErr.errroMessage
            })
          }
        })
      })
    })
  }
  // 获取钉钉的企业配置信息
  getDDCompanyConfig () {
    return this.ddCompanyConfig
  }
  // 保存钉钉的企业配置信息
  saveDDCompanyConfig (config) {
    this.ddCompanyConfig = config
  }

  getDDConfig () {
    return this.DDConfig
  }

  setDDConfig (config) {
    this.DDConfig = config
  }

  // 登录日志处理
  logOutput (msg) {
    console.log(msg)
  }

  // 设置钉钉的企业配置信息
  seDingTalkConfig (cfg) {
    const self = this
    return new Promise((resolve, reject) => {
      dd.config({
        agentId: cfg.agentid,
        corpId: cfg.corpId,
        timeStamp: cfg.timeStamp,
        nonceStr: cfg.nonceStr,
        signature: cfg.signature,
        jsApiList: [ 'runtime.info', 'biz.util.uploadAttachment', 'biz.contact.choose',
          'device.notification.confirm', 'device.notification.alert',
          'device.notification.prompt', 'biz.ding.post', 'biz.user.get',
          'biz.util.openLink', 'biz.util.previewImage',
          'biz.util.uploadImage', 'runtime.permission.requestAuthCode',
          'device.geolocation.get', 'biz.ding.create', 'runtime.permission'
        ]
      })
      dd.ready(function () { // 为啥设置设备的信息？
        self.setDDConfig(true)
        resolve(true)
      })
      dd.error(function (error) {
        self.logOutput('设置DDConfig认证有问题，具体原因：' + JSON.stringify(error))
        self.setDDConfig(false)
        const rErr = error || {}
        reject({
          retCode: rErr.errroCode,
          retMsg: rErr.errroMessage
        })
      })
    })
  }
}

export default new DingTalk()
