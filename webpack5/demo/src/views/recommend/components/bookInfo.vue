<!--
  function: 面签预约信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block title="面签预约信息">
    <div class="cell-content">
      <div class="c-item c-long">
        <div class="c-label">时间：</div>
        <div class="c-value">{{orderDetail.item.itemDateStr}}</div>
      </div>
      <div class="c-item c-long">
        <div class="c-label">地点：</div>
        <div class="c-value">{{orderDetail.item.itemPlace}}</div>
      </div>
    </div>
  </list-block>
</template>

<script>
import ListBlock from '@/components/listBlock'

export default {
  name: 'bookInfo',
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
