<!--
  function: 推荐信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block title="推荐信息">
    <div class="cell-content">
      <div class="c-item">
        <div class="c-label">渠道：</div>
        <div class="c-value">{{orderDetail.channelName}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">借款类型：</div>
        <div class="c-value">{{orderDetail.borrowingType}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">联系人：</div>
        <div class="c-value">{{orderDetail.agentName}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">申请金额：</div>
        <div class="c-value">{{Number(orderDetail.applyAmount).formatTenThousand(2, '')}}万元</div>
      </div>
      <div class="c-item">
        <div class="c-label">联系方式：</div>
        <div class="c-value"><a :href="'tel:'+orderDetail.agentPhone" style="color: #126ae4;">{{orderDetail.agentPhone}}</a>
        </div>
      </div>
      <div class="c-item">
        <div class="c-label">最高可贷额度：</div>
        <div class="c-value">{{Number(orderDetail.maxQuota).formatTenThousand(2, '')}}万元</div>
      </div>
    </div>
  </list-block>
</template>

<script>
import ListBlock from '@/components/listBlock'

export default {
  name: 'recommendInfo',
  components: {
    ListBlock
  },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
