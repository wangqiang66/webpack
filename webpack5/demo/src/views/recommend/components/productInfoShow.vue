<!--
  function: 产品信息
  author  : wq
  update  : 2018/10/11 18:23
-->
<template>
  <list-block :title="title">
    <div class="cell-content">
      <div class="c-item">
        <div class="c-label">产品名称：</div>
        <div class="c-value">{{productInfo.productNameInternal}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">合作机构：</div>
        <div class="c-value">{{productInfo.loanOrgName}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">预估额度：</div>
        <div class="c-value">{{Number(productInfo.quota).formatTenThousand(2, '')}}万元</div>
      </div>
      <div class="c-item" v-if="showMatchTfb">
        <div class="c-label">是否搭配提放保业务：</div>
        <div class="c-value">{{productInfo.isMatchTfb == 'Y'?'是':'否'}}</div>
      </div>
    </div>
  </list-block>
</template>

<script>
import ListBlock from '@/components/listBlock'

export default {
  name: 'productInfoShow',
  components: {
    ListBlock
  },
  props: {
    productInfo: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '产品信息'
    },
    showMatchTfb: {
      type: Boolean,
      default: true
    }
  }
}
</script>
