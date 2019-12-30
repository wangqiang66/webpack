/**
 * function: 字典处理
 * author  : wq
 * update  : 2018/10/10 9:56
 */
import { requestDiscByType } from '@/service'

export const getDiscData = (function () {
  const discObj = {}
  // 缓存时间，超过时间重新获取
  const serverSaveTime = 24 * 3600 * 1000
  // 获取缓存中的数据
  function getSaveDisc (disc) {
    if (discObj[disc] && discObj[disc].length > 0) {
      return discObj[disc];
    } else {
      let data = localStorage.getItem(disc)
      if (data && (data = JSON.parse(data)).length > 1) {
        const time = new Date().getTime()
        const saveTime = data.splice(-1, 1)
        if (!isNaN(Number(saveTime)) && time - saveTime <= serverSaveTime) {
          return (discObj[disc] = data)
        } else {
          localStorage.removeItem(disc)
          return null
        }
      } else {
        return null
      }
    }
  }

  // 为了处理请求字典的错误信息，需要传递当前vue的对象
  return function (...args) {
    // 获取数组中那些字典没有被请求
    const saveObj = {}
    const unSaveKey = []
    let tmp, tmpData
    for (let i = 0, l = args.length; i < l; i++) {
      tmp = args[i]
      tmpData = getSaveDisc(tmp)
      if (tmpData === null) {
        unSaveKey.push(tmp)
      } else {
        saveObj[tmp] = tmpData
      }
    }
    return new Promise(function (resolve, reject) {
      function doOver () {
        if (args.length === 1) {
          resolve(saveObj[args[0]])
        } else {
          resolve(saveObj)
        }
      }
      if (unSaveKey.length > 0) {
        let requestNumber = unSaveKey.length
        unSaveKey.forEach(item => requestDiscByType({
          type: item
        }).then(data => {
          const list = discObj[item] = saveObj[item] = data || []
          if (list.length > 0) {
            localStorage.setItem(item, JSON.stringify([...list, new Date().getTime()]))
          }
          if (--requestNumber <= 0) {
            doOver()
          }
        }).catch(() => {
          reject()
        }))
      } else {
        doOver()
      }
    })
  }
}())
