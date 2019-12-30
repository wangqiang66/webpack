/**
 * 工具文件
 */
import Vue from '../main'

Number.prototype.formatNumber = function (n = 2, replace = '--') {
  const data = Number(this);
  if (isNaN(data)) {
    return replace;
  }
  // 处理toFixed方法处理双精度浮点数据的缺陷，对此要求后台返回的数据小数点的位数不能超过我们加的这个数的位数
  const tmpData = data + 0.000000000001;
  return tmpData.toFixed(n);
}

Number.prototype.formatTenThousand = function (n = 2, replace = '--') {
  const data = Number(this);
  if (isNaN(data)) {
    return replace;
  }
  return (data / 10000).formatNumber(n, replace)
}

export const getQueryStr = function (str, addr) {
  const rs = new RegExp('(^|\\?|\\&)' + str + '=([^&#]*)(#|&|$)', 'gi').exec(addr || String(window.document.location.href))
  let tmp
  if ((tmp = rs)) {
    return tmp[2]
  }
  return ''
}

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export function debounce (fn, delay) {

  // 定时器，用来 setTimeout
  var timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  执行间隔，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“节流”函数
 */

export function throttle(fn, threshhold) {

  // 记录上次执行的时间
  var last

  // 定时器
  var timer

  // 默认间隔为 250ms
  threshhold || (threshhold = 250)

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    var now = +new Date()

    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer)

      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)

      // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

// 根据一类属性找出匹配到的一类列表
export function findListByAttrs(list, attrList, val) {
  if (!list || !attrList || list.length <= 0 || attrList.length <= 0) {
    return []
  }
  return list.filter((item) => {
    for(var item2 of attrList) {
      if (item[item2].indexOf(val) > -1) {
        return item[item2].indexOf(val) > -1
      }
    }
  })
}

/**
 * 获取list中的某个对象
 * @param {*} list
 * @param {*} val
 * @param {*} attr
 */
export function findItemByProp (list, val, attr) {
  if (!list || list.length <= 0 || !val) {
    return {}
  }
  for (var item of list) {
    if (item[attr] === val) {
      return item
    }
  }
}

/**
 * 时间戳格式化
 */
export function formatDate(date, formate = '-') {
  if (!date) return ''
  date = new Date(date)
  return `${date.getFullYear()}${formate}${date.getMonth()+1}${formate}${date.getDate()}`
}

/**
 * date逆转换
 */
export function unFormatDate(dateStr, formate = '-') {
  let dateTime =  +new Date(dateStr)
  if (!dateTime) {
    // IOS 手机 dateStr特殊处理
    let dateStrArr = dateStr.split(' ')
    dateStrArr[0] && ( dateStrArr[0] = dateStrArr[0].split(formate).join('/'))
    dateStr = dateStrArr.join(' ')
    dateTime = +new Date(dateStr)
  }
  return dateTime
}

/**
 * 处理Item中的date
 */
export function handlerItemDate(item = {}) {
  !item && (item = {})
  item.itemDateStr = formatDate(item.itemDate)
  item.itemEndDateStr = formatDate(item.itemEndDate)
  return item
}

/**
 * 数值判空
 */
export function isNumEmpty(val) {
  if (val || val === 0) return true
  return false
}

/**
 * 展示简单picker
 * @description 注意这里要手动地将当前地上下文传入
 */
export function simplePicker(data = []) {
  return new Promise((resolve, reject) => {
    if (!data || !data.length) return
    Vue.prototype.pickerInstance = this.$Picker({
      slots: [{
        type: 'data',
        flex: 1,
        values: data,
        textAlign: 'center'
      }],
      onConfirm: (instance, datas) => {
        const index = data.findIndex(item => item === datas.slot0)
        instance.value = false
        Vue.prototype.pickerInstance = null
        resolve(index)
      }
    })
  })
}