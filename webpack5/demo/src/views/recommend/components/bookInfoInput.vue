<!--
  function: 面签预约信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block-input title="预约信息">
    <wd-cell class="light-border">
      <p slot="left" class="l-label">客户预计用款日期<span class="must">*</span></p>
      <date-time type="date" placeholder="请选择用款日期" slot="right" class="r-value" v-model="loan.expectMoneyUseDateStr" @input="setExpectMoneyUseDate"></date-time>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">面签预约时间<span class="must" v-if="mustRuler">*</span></p>
      <date-time placeholder="请选择预约时间" slot="right" class="r-value" v-model="item.itemDateStr" @input="setItemDate"></date-time>
    </wd-cell>
    <wd-cell class="light-border">
      <p slot="left" class="l-label">面签预约地点<span class="must" v-if="mustRuler">*</span></p>
      <div slot="right" class="r-value" v-if="addressType === 'input'">
        <input type="text" slot="right" placeholder="请输入预约地点" class="i-input i-disabled" v-model="item.itemPlace">
      </div>
      <div slot="right" class="r-value" @click="openAppointQueryPlace" v-else-if="addressType === 'picker'">
        <p class="i-input">{{item.itemPlace || '请选择预约地点'}}</p>
      </div>
    </wd-cell>
  </list-block-input>
</template>

<script>
import ListBlockInput from '@/components/inputListBlock'
import DateTime from '@/components/form/datetime'
import {unFormatDate} from '@/util/util.js'

export default {
  name: 'bookInfo',
  components: {
    ListBlockInput,
    DateTime
  },
  props: {
    mustRuler: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    },
    loan: {
      type: Object,
      default: () => ({})
    },
    appointmentPlaces: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    addressType() {
      return this.appointmentPlaces.length > 0 ? 'picker' : 'input'
    }
  },
  methods: {
    openAppointQueryPlace() {
      let list = this.appointmentPlaces.map(item => {
        return item.appointAddress
      })
      let self = this
      this.$Picker({
        slots: [
          {
            type: 'data',
            flex: 1,
            values: list,
            textAlign: 'center',
            defaultValue: self.item.itemPlace || list[0]
          }
        ],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance          
        },
        onChange: (instance, changeInfo) => {
        },
        onConfirm: (instance, datas) => {
          self.item.itemPlace = datas.slot0
          instance.value = false
          this.__proto__.__proto__.pickerInstance = null          
        }
      })
    },
    /**
     * 设置预约用款时间
     */
    setExpectMoneyUseDate(value) {
      this.loan.expectMoneyUseDate = unFormatDate(value)
    },

    /**
     * 设置预约时间
     */
    setItemDate(value) {
      this.item.itemDate = unFormatDate(value)
    }
  }
}
</script>
