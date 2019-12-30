<!--
  function: 处理订单详情项目的每个模块的信息
  author  : wq
  update  : 2018/10/11 15:41
-->
<template>
  <div class="detail-block-wrap">
    <div :class="['title', titleLine ? 'line-bottom' : '']">{{ title }}</div>
    <div class="detail-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listBlock',
  props: {
    title: {
      type: String,
      default: ''
    },
    titleLine: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
  @import '../css/_var.scss';
  .detail-block-wrap {
    background: #fff;
  }
</style>