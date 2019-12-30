<template>
  <div v-cloak class="re-container">
    <div class="cell">
      <recommend-info :orderDetail="orderDetail"></recommend-info>
      <customer-info :customerInfo="customerInfo"></customer-info>
      <house-info :house-info="houseInfo"></house-info>
    </div>
    <div class="cell margin-short-t">
      <product-info-show :product-info="productInfo"></product-info-show>
      <book-info :order-detail="orderDetail"></book-info>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findItemByProp } from '@/util/util'
import RecommendInfo from './components/recommendInfo'
import CustomerInfo from './components/customerInfo'
import HouseInfo from './components/houseInfo'
import ProductInfoShow from './components/productInfoShow'
import BookInfo from './components/bookInfo'

export default {
  components: {
    RecommendInfo,
    CustomerInfo,
    HouseInfo,
    ProductInfoShow,
    BookInfo
  },
  computed: {
    ...mapGetters(
      {
        customerInfo: 'firstCustomerInfo',
        houseInfo: 'firstHouseInfo'
      }
    ),
    orderDetail () {
      return this.$store.state.reOrderDetail || {}
    },
    productInfo () {
      let productList = this.orderDetail.productInternalList
      if (!productList || !productList.length) {
        return {}
      }
      let code = this.orderDetail.productCodeInternal
      let productInfo = productList.find(item => item.productCodeInternal === code)
      return productInfo || {}
    }
  },
  mounted () {
    const applyNo = this.$route.query.applyNo
    this.$store.dispatch('requestWillOrderDetail', {applyNo})
  }
}
</script>
