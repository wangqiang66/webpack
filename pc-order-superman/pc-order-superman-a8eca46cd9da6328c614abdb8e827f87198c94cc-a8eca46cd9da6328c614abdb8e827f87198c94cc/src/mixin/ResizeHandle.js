/**
 * function: 拉缩的时候修改屏幕尺寸
 * author  : wq
 * update  : 2018/9/18 18:33
 */

export default {
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  method: {
    resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        // store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          // store.dispatch('closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
