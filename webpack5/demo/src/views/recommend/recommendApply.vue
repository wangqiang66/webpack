<template>
  <div v-cloak class="re-container">
    <div class="cell">
      <recommend-info :order-detail="orderDetail"></recommend-info>
      <product-info-show title="已选产品" :product-info="productInfo" :showMatchTfb="false"></product-info-show>
      <template v-if="isShowMore">
        <customer-info :customerInfo="customerInfo"></customer-info>
        <house-info :house-info="houseInfo"></house-info>
        <tfb-trial-result title="提放保初审结果" :tfb-result="productInfo.tfbResult" :rule-list="productInfo.tfbHitRuleList || []" v-if="productInfo.isMatchTfb === 'Y'" style="padding: 0 20px;"></tfb-trial-result>
      </template>
      <div class="hide-wrap" @click="() => { isShowMore = !isShowMore }">
        <span class="hide-text">{{ isShowMore ? '收起' : '更多' }}</span> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-down-green.png" alt="" :class="['icon', isShowMore ? 'hide-icon' : '']">
      </div>
    </div>
    <tfb-info-input v-if="productInfo.tfbResult === 'Y'" @triggle="setRedemptionAmount"></tfb-info-input>
    <mortgage-info-input v-if="productInfo.isSupportRemortgage === 'Y'" @triggle="setMortgageValue"></mortgage-info-input>
    <house-info-input class="margin-short-t" :must-ruler="houseInfoRuler"></house-info-input>
    <book-info-input
      v-show="orderDetail.tfbProductCode && orderDetail.tfbProductCode !== 'NULL'"
      class="margin-short-t" 
      :must-ruler="addressMustRule"
      :item="orderDetail.item"
      :loan="orderDetail.loan"
      :appointment-places="appointmentPlaces"></book-info-input>
    <div class="web-upload-wrap">
      <wd-button type="default" @click.native="uploadDataList" class="btn-item">资料上传</wd-button>
    </div>
    <div class="btn-wrap">
      <wd-button type="primary" class="btn-item" :disabled="isApply"><span @click="apply('first')" style="width: 100%; height: 100%;display: block;">发起</span></wd-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RecommendInfo from './components/recommendInfo'
import ProductInfoShow from './components/productInfoShow'
import TfbInfoInput from './components/tfbInfoInput'
import MortgageInfoInput from './components/mortgageInfoInput'
import BookInfoInput from './components/bookInfoInput'
import HouseInfoInput from './components/houseInfoInput'
import ListBlockInput from '@/components/inputListBlock'
import tfbTrialResult from './components/tfbTrialResult'
import { isNumEmpty } from '@/util/util.js'
import CustomerInfo from './components/customerInfo'
import HouseInfo from './components/houseInfo'


export default {
  components: {
    RecommendInfo,
    ProductInfoShow,
    TfbInfoInput,
    MortgageInfoInput,
    BookInfoInput,
    HouseInfoInput,
    ListBlockInput,
    tfbTrialResult,
    CustomerInfo,
    HouseInfo
  },
  data () {
    return {
      productIndex: '',
      // 选择产品的规则,当前为杭州银行时，房产信息需为必填项
      LOAN_ORG_RULER: 'BIZHZYHHZYH',
      mortgageAmountRemain: '', // 在押余额
      redemptionAmount: '', // 赎楼金额
      isShowMore: false
    }
  },
  created () {
    this.getData().then((data) => {
      this.getAppointmentPlaces()
      // 重新获取数据需重新setChooseProductInfo
      if (data) {
        const productIndex = this.productIndex = this.$route.query.productIndex || this.computedIndex()
        if (productIndex < 0) {
          return 
        }
        let productInfo = (data.productInfo || [])[productIndex] || {}
        this.$store.commit('setChooseProductInfo', productInfo)
      }
    })
  },
  beforeRouteEnter (to, from, next) {
    if (!to.meta.keepAlive) {
      to.meta.keepAlive = true
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'reProductList' || to.name === 'OrgChoose' || to.name === 'dataList') {
      from.meta.keepAlive = true
    } else {
      if (this.$vnode && this.$vnode.data.keepAlive) {
        from.meta.keepAlive = false
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            const key = this.$vnode.key == null
              ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
              : this.$vnode.key
            const cache = this.$vnode.parent.componentInstance.cache
            const keys = this.$vnode.parent.componentInstance.keys
            if (cache[key]) {
              if (keys.length) {
                const index = keys.indexOf(key)
                if (index > -1) {
                  keys.splice(index, 1)
                }
              }
              delete cache[key]
              this.$destroy()
            }
          }
        }
      }
    }
    next()
  },
  computed: {
    ...mapGetters(
      {
        customerInfo: 'firstCustomerInfo',
        houseInfo: 'firstHouseInfo',
        loan: 'loan',
        appointmentPlaces: 'appointmentPlaces'
      }
    ),
    orderDetail () {
      return this.$store.state.reOrderDetail || {}
    },
    productInfo () {
      return this.orderDetail.chooseProductInfo || {}
    },
    isApply () {
      const msg = this.validApply()
      return msg !== true
    },
    addressMustRule() {
      return this.orderDetail.isApprovalFirst === '0'
    },
    houseInfoRuler() {
      return this.productInfo.loanOrgCode === this.LOAN_ORG_RULER
    }
  },
  methods: {
    setMortgageValue(v) {
      this.mortgageAmountRemain = v
    },

    setRedemptionAmount(v) {
      this.redemptionAmount = v
    },

    /**
     * @description 申请方法
     */
    validApply () {
      const orderDetail = this.orderDetail
      const houseInfo = this.houseInfo || {}
      const {
        projectName, buildingName, floor, room
      } = houseInfo
      // 杭州银行规则（房产信息必填项）
      if (this.houseInfoRuler) {
        if (!houseInfo.houseAreaCode || !houseInfo.houseCityCode) {
          return '请先填写完整房产区域信息'
        }
        if (!projectName || !buildingName || !floor || !room) {
          return '请先填写完整房产信息'
        }
      }
      const productInfo = this.productInfo
      const loan = orderDetail.loan || {}

      // 抵押必填
      if (productInfo.isSupportRemortgage === 'Y') {
        if (!loan.isApplyMortgageSecond) {
          return '请先选择是否申请二押'
        }
        if (loan.isApplyMortgageSecond === 'Y' && !houseInfo.mortgageOrg) {
          return '请先选择在押机构'
        }
        if (loan.isApplyMortgageSecond === 'Y' && !isNumEmpty(this.mortgageAmountRemain)) {
          return '请先填写在押余额'
        }
      }
      if (productInfo.tfbResult === 'Y' && (!orderDetail.tfbProductCode)) {
        return '请先选择提放保信息'
      }
      // 选择提放保部位NULL的通用处理
      if (productInfo.tfbResult === 'Y' && orderDetail.tfbProductCode !== 'NULL') {
        // 处理审批
        const isApprovalFirst = orderDetail.isApprovalFirst
        // 审批规则：
        const item = orderDetail.item
        if (!isApprovalFirst) {
          return '请先选择是否先审批'
        }
        if (isApprovalFirst === '1') {
          if (!item.itemDate !== !item.itemPlace) {
            return '预约时间和预约地点需同时填写，请完善信息。'
          }
        }

        if (!houseInfo.mortgageOrgCode && !houseInfo.mortgageOrgName) {
          return '请先选择原贷款机构'
        }

        if (isApprovalFirst === '0') {
          if (!item.itemDate || !item.itemPlace) {
            return '请先完善预约信息'
          }
        }

        if (!loan.newLoaneeType) {
          return '请先选择新贷款借款人类型'
        }

        if (!orderDetail.landedInsuranceCode) {
          return '请先选择合作机构'
        }
        if (!orderDetail.loanNode) {
          return '请先选择放款节点'
        }

        if (!loan.expectMoneyUseDate) {
          return '请选择客户预计用款时间'
        }
      }
      // 提放保有赎楼
      if (productInfo.tfbResult === 'Y' && orderDetail.tfbProductCode === 'TFB_YSL_NJY_ISR') {
        const redemptionAmount = this.redemptionAmount
        if (!isNumEmpty(redemptionAmount)) {
          return '请先输入赎楼金额'
        }
        if (isNaN(Number(redemptionAmount))) {
          return '赎楼金额输入格式有误'
        }
        if (redemptionAmount < 0 || redemptionAmount > 2000) {
          return '赎楼金额不能大于2000万'
        }
        if (!loan.loaneeType) {
          return '请先选择原贷款借款人类型'
        }
      }
      return true
    },
    
    /**
     * 针对于特殊的校验规则
     * @description 特殊校验
     * 1、原贷款机构的特殊校验， 因为后端在JJS的单子中只传过来了mortgageOrgName 而没有 mortgageOrgCode
     */
    specialValidation() {
      const productInfo = this.productInfo
      const orderDetail = this.orderDetail
      const houseInfo = this.houseInfo
      // 原贷款机构的特殊校验， 因为后端在JJS的单子中只传过来了mortgageOrgName 而没有 mortgageOrgCode
      if (productInfo.tfbResult === 'Y' && orderDetail.tfbProductCode === 'TFB_YSL_NJY_ISR') {
        if (!houseInfo.mortgageOrgCode && houseInfo.mortgageOrgName) {
          return '原贷款机构编码不存在，请记住当前机构名称，再次选择'
        }
      }
      return true
    },

    apply (commitType = 'first') {
      let msg
      if ((msg = this.validApply()) !== true || (msg = this.specialValidation()) !== true) {
        this.$MessageBox.alert({
          title: msg
        })
        return false
      }
      
      const orderDetail = this.orderDetail || {}
      const loan = orderDetail.loan || {}
      const productCodeInternal = this.productInfo.productCodeInternal || []
      // 必传字段
      const data = {
        commitType,
        applyNo: orderDetail.applyNo,
        channelType: orderDetail.channelType,
        productCodeInternal,
        ...this.tfbRulesHandler(),
        houseList: this.houseListHandler(),
        item: this.appointmentHandler(),
        loan: this.loanHandler(),
        customerList: this.customerListHandler(),
        // 防止二次错误弹窗
        defineError: true
      }
      const self = this
      this.$store.dispatch('submitBusiness', data).then(res => {
        let toast = this.$Toast({
          content: '发起成功',
          iconClass: 'success',
          autoClose: false
        })
        this.$store.commit('setTfb', '')
        setTimeout(() => {
          toast.close()
          this.skipRouter({
            path: '/',
            query: {selectedTabId: 'tab3'}
          })
        }, 1000)
      }).catch(e => {
        if (e.retCode === '3') {
          this.$MessageBox.confirm({
            title: '',
            text: e.retMsg,
            onConfirm (instance) {
              self.apply('recommit')
              instance.open = false
            },
            onCancel (instance) {
              instance.open = false
            }
          })
        } else {
          this.$MessageBox.alert({
            title: e.retMsg
          })
        }
      })
    },
    // 资料上传
    uploadDataList() {
      this.skipRouter({path: '/dataList', query: { applyNo: this.applyNo, customerNo: this.customerInfo.customerNo, houseNo: this.houseInfo.houseNo, productIndex: this.productIndex }})
    },
    
    /**
     * 获取订单数据
     */
    getData() {
      const applyNo = this.applyNo = this.$route.query.applyNo
      return new Promise((resolve, reject) => {
        const orderDetail = this.orderDetail || {}
        if (typeof orderDetail !== 'object' || Object.keys(orderDetail).length <= 0) {
          this.$store.dispatch('requestWillOrderDetail', {
            applyNo
          }).then(data => {
            resolve(data)
          })
        } else {
          resolve()
        }
      })
    },

    /**
     * 计算当前产品的index
     */
    computedIndex() {
      let productList = this.orderDetail.productInternalList || []
      let productCodeInternal = this.orderDetail.productCodeInternal || ''
      return productList.findIndex(item => item.productCodeInternal === productCodeInternal)
    },

    /**
     * 提交信息时提放保规则处理
     */
    tfbRulesHandler() {
      let orderDetail = this.orderDetail || {}
      let tfbProductCode = orderDetail.tfbProductCode || ''
      if (tfbProductCode && tfbProductCode !== 'NUll') {
        return {
          tfbProductCode: orderDetail.tfbProductCode,
          tfbProductName: orderDetail.tfbProductName,
          isApprovalFirst: orderDetail.isApprovalFirst,
          loanNode : orderDetail.loanNode,
          loanNodeName : orderDetail.loanNodeName,
          landedInsuranceCode : orderDetail.landedInsuranceCode,
          landedInsuranceName : orderDetail.landedInsuranceName
        }
      }
      return {}
    },

    /**
     * 预约信息处理规则
     */
    appointmentHandler() {
      const item = this.orderDetail.item
      return item || {}
    },

    /**
     * 贷款信息处理规则
     */
    loanHandler() {
      const loan = this.orderDetail.loan || {}
      this.redemptionAmount && (loan.redemptionAmount = +this.redemptionAmount * 10000)
      
      return loan
    },
    houseListHandler() {
      const houseList = this.orderDetail.houseList || []
      houseList.map(item => {
        // 数据处理
        this.mortgageAmountRemain && (item.mortgageAmountRemain = +this.mortgageAmountRemain * 10000)
      })
      return houseList || []
    },
    customerListHandler() {
      const customerList = this.orderDetail.customerInfo 
      return customerList || []
    },
    /**
     * 获取预约地点列表
     */
    getAppointmentPlaces() {
      this.$store.dispatch('getAppointmentPlaces', {
        cityCode: this.orderDetail.organizationCityCode
      })
    }
  }
}
</script>
