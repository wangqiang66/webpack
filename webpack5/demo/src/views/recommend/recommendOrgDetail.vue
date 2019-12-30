<template>
  <div v-cloak class="re-container">
    <RecommendOrgInfo type="detail"/>    
  </div>
</template>

<script>
import RecommendOrgInfo from './components/recommendOrgInfo'

import { mapGetters } from 'vuex'
import { findItemByProp } from '@/util/util'

export default {
  components: {
    RecommendOrgInfo
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

<style lang="scss" scoped>
.re-container {
  background: #fff;
  min-height: 100vh;
}
</style>
