<!--
  function: 输入模块信息
  author  : wq
  update  : 2018/10/11 15:41
-->
<template>
  <div class="input-block-wrap">
    <div :class="['title', 'input-title', titleLine ? 'line-bottom' : '']">{{ title }}</div>
    <slot></slot>
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
      default: false
    }
  }
}
</script>

<style>
  .input-title {
    text-align: left;
  }
</style>