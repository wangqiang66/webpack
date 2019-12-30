<template>
  <list-block :title="title">
    <div class="content" >
      <div class="c-item">
        <div class="c-label">初审结果:</div>
        <div class="c-value">{{tfbText}}</div>
      </div>
      <div v-for="(result, index) in ruleList" :key="index">
        <div class="c-item">
          <div class="c-label">命中规则{{index+1}}:</div>
          <div class="c-value">{{result.ruleName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">规则描述{{index+1}}:</div>
          <div class="c-value">{{result.hitMessage}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">提示信息{{index+1}}:</div>
          <div class="c-value">{{result.promptMessage}}</div>
        </div>
      </div>
     
    </div>
  </list-block>
</template>

<script>
import ListBlock from "@/components/listBlock";

export default {
  props: {
    title: String,
    tfbResult: String,
    ruleList: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    ListBlock
  },
  computed: {
    tfbText() {
      let map = new Map()
        .set('N', '初审否决')
        .set('Y', '初审通过')

      return map.get(this.tfbResult) || ''
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 0;
  .c-item {
    display: flex;
    margin-bottom: 10px;
    .c-label {
      text-align: right;
      padding-right: 20px;
      flex: 2;
      margin-bottom: auto;
      color: #999;
    }
    .c-label::after {
      position: absolute;
    }
    .c-value {
      flex: 3;
      text-align: left;
      color: #333;
    }
  }
}
</style>
