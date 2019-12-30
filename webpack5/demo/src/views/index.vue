<template>
  <div class="order-list-box">
    <div class="warn-box" v-if="showWarn">
      请于24小时内联系渠道，确认客户需求，预约后续事宜。
    </div>
    <input type="search" placeholder="客户姓名/中介及联系人/处理状态" class="l-input" v-model="search" @search="doSearch">
    <div class="list-wrap">
      <scroll-view ref="scroll-view" :refresh="refresh" :loadmore="loadmore" @pullDown="doRefreshList" @pullUp="doNextList">
        <div v-if="recommendList.length>0" class="list-wrapper">
          <div class="recommendList-block" v-for="(item,index) in recommendList" @click="goRecommend(item)" :key="index">
            <div class="re-head">
              <div class="h-important">{{item.productName}}</div>
              <div class="h-date">{{item.applyTime}}</div>
              <div class="h-status" :class="item.processStatus === 'DCL' ? 'dcl' : item.processStatus === 'YCL' ? 'ycl' : 'yzz'">{{item.processStatusName}}</div>
            </div>
            <hr>
            <div class="re-content">
              <div class="c-item">
                <div class="c-i-label">客户姓名</div>
                <div class="c-i-value">{{item.customerName}}</div>
              </div>
              <div class="c-item">
                <div class="c-i-label">渠道</div>
                <div class="c-i-value">{{item.channelName}}</div>
              </div>
              <div class="c-item">
                <div class="c-i-label">渠道联系人</div>
                <div class="c-i-value">{{item.agentName}}</div>
              </div>
            </div>
          </div>
          <div v-if="!loadmore" class="end-tip">人家也是有底线的</div>
        </div>
        <div v-else class="empty-list">
          <img src="../../images/no_data.png" class="no-data"/>
          <div class="no-launch">暂无推荐</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import ScrollView from '@ddjf/scroll-view'
import { getQueryStr } from '@/util/util'
import { getDiscData } from '@/util/disc'

export default {
  name: 'order-home',
  components: {
    ScrollView
  },
  data () {
    return {
      refresh: true,
      loadmore: true,
      showWarn: true,
      search: '',
      pageNo: 1,
      pageSize: 10,
      type: 'recommended'
    }
  },
  computed: {
    recommendList () {
      return this.$store.state.recommendList
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.meta.isBack || !from.name) {
      // 后退
      to.meta.keepAlive = true
    } else {
      // 前进
      to.meta.keepAlive = false
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = true
    next()
  },
  created () {
    const sessionKey = decodeURIComponent(getQueryStr('sessionKey'))
    const type = getQueryStr('type')
    if (sessionKey) {
      localStorage.setItem('intentionSession', sessionKey)
    }
    if (type) {
      localStorage.setItem('intentionType', type)
    }
    this.queryDictionary()
    this.requestWillOrderList()
  },
  methods: {
    queryDictionary () {
      const disc = [
        'channelForm', 'dingCusType', 'dingRelationType', 'dingCertType', 'dingTfbProduct', 'yes_no',
        'channelForm',
        'dingCusType',
        'dingRelationType',
        'dingCertType'
      ]
      getDiscData(...disc)
    },
    requestWillOrderList () {
      const {
        type, pageNo, pageSize, search
      } = this
      if (pageNo === 1) {
        const scrollView = this.$refs['scroll-view']
        scrollView && scrollView.refreshScroll()
      }
      return this.$store.dispatch('requestWillOrderList', {
        type,
        pageNo,
        pageSize,
        'searchStr': search
      }).then(data => {
        this.showWarn = data.some(item => {
          return item.processStatus === 'DCL'
        })
        return data
      })
    },
    doSearch () {
      this.pageNo = 1
      this.requestWillOrderList().then((data) => {
        this.loadmore = data.length >= this.pageSize
        return data
      }).catch(() => {
      })
    },
    // 刷新列表
    doRefreshList (func) {
      this.pageNo = 1
      this.requestWillOrderList().then((data) => {
        func(true, data.length >= this.pageSize)
        this.loadmore = data.length >= this.pageSize
        return data
      }).catch(() => {
        func(false, true)
      })
    },
    // 下一页
    doNextList (func) {
      this.pageNo++
      this.requestWillOrderList().then((data) => {
        func(true, data.length >= this.pageSize)
        this.loadmore = data.length >= this.pageSize
        return data
      }).catch(() => {
        func(false, true)
      })
    },
    goRecommend(item) {
      if (item.channelType === 'QPO') {
        this.skipRouter({path: '/evaluateRecommendDetail', query: {applyNo: item.applyNo, channelType: item.channelType}})
      } else if (item.processStatus === 'DCL') {
        // 九金所订单列表直接跳转至申请页面
        if (item.channelType === 'JJS') {
          this.$store.dispatch('removeOrder')
          this.skipRouter({path: '/recommendApply', query: {applyNo: item.applyNo}})
          return
        } else if (item.channelType === 'TFB') {
          this.$store.dispatch('removeOrder')
          this.skipRouter({path: '/recommendOrgApply', query: {applyNo: item.applyNo}})
          return
        }
        this.skipRouter({path: '/recommend', query: {applyNo: item.applyNo}})
      } else {
        if (item.channelType === 'TFB') {
          this.skipRouter({path: '/recommendOrgDetail', query: {applyNo: item.applyNo}})
          return
        }
        this.skipRouter({path: '/recommendDetail', query: {applyNo: item.applyNo}})
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../css/var';

  .order-list-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .warn-box {
      font-size: $font_small;
      padding: 10px;
      text-align: center;
      background: rgba($color: #333, $alpha: .5);
      color: #efeff4;
    }
    .l-input {
      text-align: center;
      font-size: 28px;
      display: block;
      width: 680px;
      margin: 10px auto;
      height: 60px;
      padding-left: 10px;
      outline: none;
      border: 1px solid #aaa;
      border-radius: 15px;
    }
    .list-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .list-wrapper {
      margin: 0 10px;
    }

    .end-tip {
      text-align: center;
      height: 48px;
      line-height: 48px;
      color: #666;
    }
    .recommendList-block {
      margin-bottom: 10px;
      padding: 10px;
      background: #fff;
      .re-head {
        display: flex;
        align-items: center;
        padding: 8px 0;
        div {
          padding: 0 5px;
        }
        .h-important {
          font-size: 32px;
          font-weight: bolder;
        }
        .h-date {
          font-size: 24px;
          color: #666;
          align-self: flex-end;
          line-height: 32px;
        }
        .h-status {
          flex: 1;
          text-align: right;
          font-size: 30px;
        }
        .dcl {
          color: #126ae4;
        }
        .ycl {
          color: #5dc800;
        }
        .yzz {
          color: #989898;
        }
      }
      hr {
        margin: 3px 0;
        border-top: 0;
        border-left: 0;
      }
      .re-content {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .c-item {
          line-height: 40px;
          text-align: center;
          padding: 20px;
          .c-i-label {
            color: #666;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
</style>
