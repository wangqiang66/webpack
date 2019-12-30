<!--
  function: 产品信息
  author  : wq
  update  : 2018/10/11 18:23
-->
<template>
  <div class="product-info-wrap" :class="focus ? 'product-focus': ''">
    <div class="title-wrap row">
      <span class="font-normal">
        {{item.productNameInternal}}
      </span>
      <span class="t-mode font-small">（{{item.productMode}}）</span>
      <span class="t-info" @click.stop="$emit('showTip')">
        <img :src="focus ? tipWhite : tipBlue">
      </span>
    </div>
    <div class="cell-content row">
      <div class="re-content p-content">
        <div class="c-item">
          <div class="c-label">放款机构</div>
          <div class="c-value">{{item.loanOrgName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">承保机构</div>
          <div class="c-value">{{item.insuranceOrgName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">预估额度</div>
          <div class="c-value">{{Number(item.quota).formatTenThousand(2, '')}}万元</div>
        </div>
        <div class="c-item">
          <div class="c-label">利率范围</div>
          <div class="c-value">{{item.interestRange}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">可搭配提放保业务</div>
          <div class="c-value detail-wrap" v-if="item.isMatchTfb === 'Y'">
            {{transTfbResult(item.tfbResult)}}
            <div class="value-detail" @click.stop="$emit('showDetail')">查看详情</div>
          </div>
          <div class="c-value" v-else>不可搭配</div>
        </div>
        <div class="c-item" v-if="isNumber(item.remortgageAmount)">
          <div class="c-label">二押可贷金额</div>
          <div class="c-value">{{Number(item.remortgageAmount).formatTenThousand(2, '')}}万元</div>
        </div>
      </div>
      <div class="re-icon">
        <img :src="unChecked" v-if="focus" class="success-icon">
        <img :src="checked" v-else class="success-icon gray-icon">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'productInfo',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tipWhite: require('../../../../images/re_info_white.png'),
      tipBlue: require('../../../../images/re_info_green.png'),
      unChecked: require('../../../../images/re_success_white.png'),
      checked: require('../../../../images/re_success_gray.png')
    }
  },
  methods: {
    isNumber (num) {
      if (num === false || num === '' || num === undefined || num === null) {
        return false;
      }
      return !isNaN(Number(num));
    },
    transTfbResult(value) {
      let map = new Map()
        .set('N', '初审否决')
        .set('Y', '初审通过')

      return map.get(value) || ''
    }
  }
}
</script>

<style lang="scss">
  .product-info-wrap {
    .title-wrap {
      height: 58px;
      padding-left: 50px;
      align-items: center;
      border-bottom: 1px solid #eee;
      .t-mode {
        font-size: 24px;
        flex: 1;
      }
      .t-info {
        width: 40px;
        height: 40px;
        padding: 0 10px;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
    .re-content {
      width: 500px;
    }
    .re-icon {
      align-self: center;
      flex: 1;
      text-align: center;
      .success-icon {
        width: 120px;
        height: 120px;
      }
      .gray-icon {
        filter: opacity(.5);
      }
    }
  }
  .product-focus {
    color: #fff;
    .c-label {
      color: #fff !important;
    }
    .c-value {
      color: #fff !important;
    }
  }
  .c-value.detail-wrap {
    position: relative;
    white-space: nowrap;
    .value-detail {
      display: inline-block;
      position: absolute;
      padding: 0 40px;
      color: #169BD5 !important;
    }
  }

  .p-content {
    .c-item {
      .c-label {
        position: relative;
        margin-right: 30px;
        &::after {
          content: ":";
          top: 5px;
          position: absolute;
          padding-left: 5px;
          margin-bottom: auto;
        }
      }
    }
  }
</style>