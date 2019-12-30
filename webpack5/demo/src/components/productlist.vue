<template>
  <div class="list-wrapper">
    <div class="list-block" v-for="(item,index) in productList" @click="goProduct(index)" :key="index">
      <img class="product-image" :src="item.productImgUrl" />
      <div class="product-content">
        <div class="product-name">{{item.productName}}</div>
        <div class="product-summary">{{item.productDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../util/util.js";
export default {
  data() {
    return {};
  },
  computed: {
    productList() {
      return this.$store.state.productList;
    }
  },

  methods: {
    goProduct(index) {
      // todo 将flag 置为 tab1
      this.$store.commit('setTabFlag', 'tab1')
      // 初始化order 和 customer
      var order = util.getDefaultData('order');
      order.productCode = this.productList[index].productCode;
      this.$store.state.order = order;
      var customer = util.getDefaultData('customer')
      customer.relationType = 'JKR'
      this.$store.state.customerIndex = -1;
      this.$store.state.customer = customer
      this.$store.commit('initOrderStatus')
      this.skipRouter('/customer')
    }
  }
}
</script>
<style lang="scss">
.list-wrapper {
  margin: 0 10dpx;
  font-size: 28dpx;
  .list-block {
    min-height: 170dpx;
    border-radius: 10dpx;
    margin-bottom: 15dpx;
    background: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 3px 3px 0 #888;
    .product-image {
      width: 100dpx;
      height: 100dpx;
      border: 1px solid #a1a1a1;
      border-radius: 10px;
      margin: 0 20dpx;
    }
    .product-content {
      margin-right: 20dpx;
      .product-name {
        font-weight: 700;
        margin-bottom: 8dpx;
      }
    }
  }
}
</style>
