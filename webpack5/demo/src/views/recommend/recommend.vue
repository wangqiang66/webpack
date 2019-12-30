<template>
  <div v-cloak class="re-container padding-short">
    <div class="cell padding-short-b padding-short">
      <recommend-info :orderDetail="orderDetail"></recommend-info>
      <template v-if="isShowMore">
        <customer-info :customerInfo="customerInfo" :can-edit-info="productInfo && productInfo.length > 0"></customer-info>
        <house-info :house-info="houseInfo"></house-info>
      </template>
      <hr class="no-margin">
      <div class="hide-wrap" @click="() => { isShowMore = !isShowMore }">
        <span class="hide-text">{{ isShowMore ? '收起' : '更多' }}</span> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-down-green.png" alt="" :class="['icon', isShowMore ? 'hide-icon' : '']">
      </div>
    </div>
    <template v-if="productInfo && productInfo.length > 0">
      <div class="c-head">推荐产品</div>
      <div
         :class="['cell', index === currentIndex ? 'cell-choose' : '']"
         v-for="(item, index) in productInfo"
         :key="index"
         @click="chooseReProduct(index)">
        <product-info :item="item" :focus="index === currentIndex" @showTip="showDialog(item)" @showDetail="showTFBResult(item)"></product-info>
      </div>
      <div class="btn-wrap">
        <wd-button type="default" @click.native="operateBusiness" class="btn-item btn-warn">终止业务</wd-button>
        <wd-button type="default" @click.native="goReApply" class="btn-item" :disabled="nextStep">下一步</wd-button>
      </div>
      <popup-product-tip v-model="dialog.visible" :item="dialog.data"></popup-product-tip>
      <popup-tfb-result v-model="tfbDialog.visible" :item="tfbDialog.data" :title="tfbDialog.title"></popup-tfb-result>
    </template>
    <template v-else-if="productInfo">
      <p class="warn">终止原因：{{(orderDetail.judgeInfo || {}).judgeRefuseReason || '该客户暂无合适的放款机构，建议终止业务'}}</p>
      <div class="btn-wrap">
        <wd-button type="default" @click.native="operateBusiness" class="btn-item btn-warn">终止业务</wd-button>
      </div>
    </template>
    <popup-stop-business v-model="showStopBusiness"></popup-stop-business>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RecommendInfo from './components/recommendInfo'
import CustomerInfo from './components/customerInfo'
import HouseInfo from './components/houseInfo'
import ProductInfo from './components/productInfo'
import PopupStopBusiness from './components/popupStopBusiness'
import PopupProductTip from './components/popupProductTip'
import PopupTfbResult from './components/popupTfbResult'

export default {
  components: {
    RecommendInfo,
    CustomerInfo,
    HouseInfo,
    ProductInfo,
    PopupStopBusiness,
    PopupProductTip,
    PopupTfbResult
  },
  data () {
    return {
      applyNo: '',
      isShowMore: false,
      currentIndex: '', // 当前选择的项
      dialog: {
        visible: false,
        data: {}
      },
      tfbDialog: {
        visible: false,
        data: [],
        title: ''
      },
      confirmBox: null,
      showStopBusiness: false,
      hasNextStep: false
    }
  },
  computed: {
    ...mapGetters(
      {
        customerInfo: 'firstCustomerInfo',
        houseInfo: 'firstHouseInfo',
        productInfo: 'productInfo'
      }
    ),
    orderDetail () {
      return this.$store.state.reOrderDetail || {}
    },
    nextStep () {
      const currentIndex = this.currentIndex
      const customerInfo = this.customerInfo || {}
      const hasNextStep = this.hasNextStep
      if ((currentIndex || currentIndex === 0) && customerInfo.name && customerInfo.certNo && !hasNextStep) {
        return false
      }
      return true
    }
  },
  created () {
    this.applyNo = this.$route.query.applyNo
    this.getRecommendDetail()
  },
  beforeRouteEnter (to, from, next) {
    if (to.meta.isBack || !to.meta.notFirstEntry) {
      // 后退
      to.meta.keepAlive = true
    } else {
      // 前进
      to.meta.keepAlive = false
    }
    to.meta.notFirstEntry = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = true
    next()
  },
  methods: {
    isNumber (num) {
      if (num === false || num === '' || num === undefined || num === null) {
        return false
      }
      return !isNaN(Number(num))
    },
    getRecommendDetail () {
      var applyNo = this.applyNo
      this.$store.dispatch('requestWillOrderDetail', {applyNo})
    },
    chooseReProduct (index) {
      if (this.currentIndex === index) {
        this.currentIndex = ''
        this.$store.commit('setChooseProductInfo', {})
      } else {
        this.currentIndex = index
        this.$store.commit('setChooseProductInfo', this.productInfo[index])
      }
    },
    operateBusiness () {
      this.showStopBusiness = true
    },
    showDialog (item) {
      this.dialog.visible = true
      Object.assign(this.dialog.data, item)
    },
    showTFBResult(item) {
      this.tfbDialog.visible = true
      this.tfbDialog.title = item.tfbResult
      Object.assign(this.tfbDialog.data, item)
    },  
    goReApply () {
      this.hasNextStep = true
      const customerInfo = this.customerInfo || {}
      this.skipRouter({path: '/recommendApply', query: { applyNo: this.applyNo, productIndex: this.currentIndex, name: customerInfo.name, certNo: customerInfo.certNo }})
      setTimeout(() => { this.hasNextStep = false }, 3000)
    }
  },
  beforeDestroy () {
    if (this.confirmBox) {
      this.confirmBox.onCancel()
    }
  }
}
</script>

<style lang="scss">
  @import "../../css/var";

  .re-container {
    height: 100%;
    background-color: #efeff4;
    .cell {
      margin-bottom: 10px;
      background: #fff;
      border-radius: 10px;

      .no-margin {
        margin: 0;
        border-bottom: none;
      }
    }
    .c-head {
      font-size: 32px;
      font-weight: bolder;
      margin-top: 20px;
      padding: 5px;
      height: 50px;
      line-height: 50px;
    }
    .cell-choose {
      background: #5dc800 !important;
      color: #fff;
    }
    .warn {
      color: #ff9200;
      font-size: 30px;
      min-height: 50px;
      line-height: 50px;
    }

    h2.title {
      font-size: 28px;
      line-height: 80px;
      color: #666
    }

    .btn {
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      border-radius: 5px;
    }

    .btn-assist {
      border: 2px solid rgb(161, 205, 225)
    }

    .btn-primary {
      border: 2px solid #E51C23;
      color: #E51C23;
    }

    .btn-primary:focus {
      background-color: #E51C23;
    }
  }
</style>
