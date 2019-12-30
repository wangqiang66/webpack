<!--
  function: 终止业务弹出框
  author  : wq
  update  : 2018/10/12 9:13
-->
<template>
  <wd-popup dialogClass="stop-business-dialog" v-model="value">
    <div class="head-wrap">
      <h1 class="title">终止业务</h1>
      <i class="close" @click.stop="doCancelStopBusiness"></i>
    </div>
    <div class="stop-business-content">
      <h2 class="title">终止原因</h2>
      <div class="row font-normal padding-short-b padding-big-rl reason-row">
        <div
           v-for="item in reasonConfig.list"
           :key="`stop-reason-${item.key}`"
           class="flex1 row flex-middle flex-center">
          <label class="select-btn row"> <input type="radio" name="stopBusinessReason" v-model="reasonConfig.radioValue"
                                                :value="item.key" class="opacity0" /> <span
             class="select-btn-span flex1">{{item.name}}</span> </label>
        </div>
      </div>
      <h2 class="title">客户反馈</h2>
      <template
        v-for="dataItem in reasonConfig.list">
        <div
           v-if="dataItem.key === reasonConfig.radioValue"
           :key="`stop-reason-text-${dataItem.key}`"
           class="row font-normal padding-short-rl select-column">
          <div
             v-for="(item) in dataItem.children"
             :key="`stop-reason-${item.key}`"
             class="row flex-middle flex-center select-column-li">
            <label class="select-btn row"> <input
               type="checkbox" name="stopBusinessReasonSelect"
               v-model="item.value"
               :true-value="item.key"
               false-value=""
               class="opacity0"
            /><span class="select-btn-span flex1">{{item.name}}</span> </label>
          </div>
        </div>
      </template>
      <div class="other-reason-wrap column">
        <label class="text-right">{{reasonConfig.otherReason.length}}/20</label>
        <textarea rows="2" maxlength="20" placeholder="其他终止原因" v-model="reasonConfig.otherReason" />
      </div>
    </div>
    <div class="row btn-wrap">
      <div class="flex1 btn btn-assist" @click.stop="doCancelStopBusiness">取消</div>
      <div class="gap_bigest"></div>
      <div class="flex1 btn btn-primary" @click.stop="doSureStopBusiness">确定终止</div>
    </div>
  </wd-popup>
</template>

<script>
export default {
  name: 'popupStopBusiness',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      reasonConfig: {
        radioValue: 'cusCancel',
        checkboxValues: [],
        otherReason: '',
        list: [
          {
            key: 'cusCancel',
            name: '客户退单',
            children: [{
              key: '产品费用高',
              name: '产品费用高'
            }, {
              key: '没有合适期限',
              name: '没有合适期限'
            }, {
              key: '可贷金额不足',
              name: '可贷金额不足'
            }, {
              key: '流程繁琐，时效低',
              name: '流程繁琐，时效低'
            }, {
              key: '已无资金需求',
              name: '已无资金需求'
            }, {
              key: '已在其他渠道申请',
              name: '已在其他渠道申请'
            }]
          }, {
            key: 'agentCancel',
            name: '中介退单',
            children: [{
              key: '订单录入错误',
              name: '订单录入错误'
            }, {
              key: '重复订单',
              name: '重复订单'
            }, {
              key: '客户资质存在问题',
              name: '客户资质存在问题'
            }, {
              key: '返佣问题',
              name: '返佣问题'
            }]
          }
        ]
      }
    }
  },
  methods: {
    // 去掉弹出框
    doCancelStopBusiness () {
      this.$emit('input', false)
    },
    doSureStopBusiness () {
      const applyNo = this.$route.query.applyNo
      const config = this.reasonConfig
      // 获取终止原因
      const stopReason = config.radioValue
      // 获取客户反馈
      const stopFeedback = ((config.list.filter(item => stopReason === item.key)[0] || {}).children || [])
        .filter(item => !!item.value).map(item => item.value)
      const otherReason = config.otherReason
      if (otherReason) {
        stopFeedback.push(otherReason)
      }
      if (stopFeedback.length < 1) {
        this.$Toast({
          content: '请选择或者输入问题反馈'
        })
        return false
      }
      this.$store.dispatch('endBusiness', {
        applyNo,
        operReason: {
          type: stopReason,
          msg: stopFeedback
        }
      }).then(data => {
        this.doCancelStopBusiness()
        const toast = this.$Toast({
          content: '订单已终止',
          iconClass: 'success',
          autoClose: false
        })
        setTimeout(() => {
          toast.close()
          this.skipRouter({path: '/', query: {selectedTabId: 'tab3'}})
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../../../css/_var';
  .wd-popup {
    top: auto;
    bottom: 0;
    width: 100%;
    height: initial !important;
    border-radius: 12px 12px 0 0;
    i.close {
      position: absolute;
      top: 13px;
      right: 13px;
      width: 38px;
      height: 38px;
      z-index: 2;
    }
  }
  .stop-business-content {
    @include setPaddingRL($gap_normal);
    .reason-row {
      @include setPaddingTB($gap_normal);
      align-items: center;
    }
    .select-btn {
      min-width: 80%;
    }
    .select-btn-span {
      border: 3px solid #eee;
      text-align: center;
      @include setPadding($gap_short);
      border-radius: 8px;
    }
    input:checked + .select-btn-span {
      background-color: #2599f2;
      color: #fff;
      border: 3px solid #2599f2;
    }

    .select-column {
      flex-wrap: wrap;
    }
    .select-column-li {
      width: 50%;
      @include setPaddingTB($gap_short);
      @include setPaddingRL($gap_short);
      box-sizing: border-box;
      .select-btn {
        width: 100%;
      }
    }
  }
  .other-reason-wrap {
    @include setPadding($gap_normal, $gap_short);
    & > label {
      height: 40px;
      line-height: 40px;
    }
    & > textarea {
      @include setPadding($gap_short);
      height: 80px;
      line-height: 40px;
      border: 2px solid #cccc;
    }
  }
</style>
