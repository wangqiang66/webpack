<!--
  function: 弹出产品的提示信息
  author  : wq
  update  : 2018/10/12 9:47
-->
<template>
  <wd-dialog :value="value" @input="doInput" class="dialog">
    <p class="d-head">{{item.productNameInternal}}</p>
    <div class="d-content">
      <div class="c-item">
        <div class="i-label">放款机构：</div>
        <div class="i-value">{{item.loanOrgName}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">承保机构：</div>
        <div class="i-value">{{item.insuranceOrgName}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">额度范围：</div>
        <div class="i-value">{{item.loanAmountRange}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">利率范围：</div>
        <div class="i-value">{{item.interestRange}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">期限：</div>
        <div class="i-value">{{item.loanTimeLimit}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">还款方式：</div>
        <div class="i-value">{{item.repayMethod}}</div>
      </div>
      <div class="c-item">
        <div class="i-label">业务流程：</div>
        <div class="i-value">{{item.serviceProcess}}</div>
      </div>
    </div>
  </wd-dialog>
</template>

<script>
export default {
  name: 'popupProductTip',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    doInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss">
  .dialog {
    font-size: 26px;
    .d-head {
      font-size: 30px;
      text-align: center;
    }
    .d-content {
      padding: 10px;
      .c-item {
        display: flex;
        padding: 5px;
        .i-label {
          flex: 1;
          text-align: right;
          color: #666;
        }
        .i-value {
          flex: 1;
        }
      }
    }
  }
</style>