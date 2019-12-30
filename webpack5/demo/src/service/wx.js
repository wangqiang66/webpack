/**
 * function: wx
 * author  : wq
 * update  : 2018/9/5 9:41
 */
import { Toast } from 'wdui'

const wx = {
  loading: null,
  loadingNum: 0,
  showNavigationBarLoading () {
    if (this.loading) {
      this.loadingNum++
    } else {
      this.loadingNum = 1
      this.loading = Toast({
        iconClass: 'loader',
        content: '加载中',
        autoClose: false
      })
    }
  },
  hideNavigationBarLoading () {
    if (--this.loadingNum <= 0) {
      this.loading && this.loading.close()
      this.loading = null
    }
  },
  showToast (msg) {
    if (typeof msg === 'object' && msg !== null) {
      msg = msg.title
    }
    Toast({
      content: msg,
      duration: 3000
    })
  }
}
export default wx
