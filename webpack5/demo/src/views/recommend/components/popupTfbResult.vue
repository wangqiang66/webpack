<!--
  function: 弹出产品的提示信息
  author  : wyh
  update  : 2019/04/10
-->
<template>
  <wd-dialog :value="value" @input="doInput" class="dialog">
    <tfb-trial-result title="提放保初审结果" :rule-list="item.tfbHitRuleList" :tfb-result="item.tfbResult"></tfb-trial-result>
  </wd-dialog>
</template>

<script>
import tfbTrialResult from './tfbTrialResult'

export default {
  data() {
    return {
      
    }
  },
  name: 'popupTfbResult',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Array,
      default: () => ({})
    },
    title: String
  },
  methods: {
    doInput(value) {
      this.$emit('input', value)
    }
  },
  components: {
    tfbTrialResult
  }
}
</script>

<style lang="scss" scope>
  .dialog {
    font-size: 26px;
    .d-head {
      font-size: 30px;
      text-align: center;
      border-bottom: 1px solid #aaa;
      padding: 10px;
    }
    .cell-content {
      padding: 0;
      .c-label {
        min-width: 100px !important;
      }
    }
    .detail-content {
      max-height: 550px;
      overflow: auto;
    }
    
  }
</style>