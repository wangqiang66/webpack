<!--
  function: 二押内容模块
  author  : dcp
  update  : 2019/1/14 10:00
-->
<template>
  <list-block-input title="">
    <wd-cell class="light-border">
      <p slot="left" class="l-label">是否申请二押<span class="must">*</span></p>
      <div slot="right" class="r-value" @click.stop="openMortgage">
        <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled
               v-model="loan.isApplyMortgageSecondName"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
    </wd-cell>
    <div class="mort-block" v-if="mortgageCode == 'Y'">
      <wd-cell class="light-border">
        <p slot="left" class="l-label">在押机构类型<span class="must">*</span></p>
        <div slot="right" class="r-value" @click.stop="openMortOrg">
          <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled
                 v-model="houseInfo.mortOrgName"> <img
           src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
        </div>
      </wd-cell>

      <wd-cell class="light-border">
        <p slot="left" class="l-label">在押余额<span class="must">*</span></p>
        <div slot="right" class="r-value">
          <input type="text" slot="right" placeholder="请输入在押余额" class="i-input i-disabled"
                 v-model="mortgageAmountRemain"> <span class="i-unit">万元</span>
        </div>
      </wd-cell>
    </div>
  </list-block-input>
</template>

<script>
import ListBlockInput from '@/components/inputListBlock'
import { mapGetters } from 'vuex'
import { getDiscData } from '@/util/disc'
import { findItemByProp } from '@/util/util'

export default {
  name: 'mortgageInfoInput',
  components: {
    ListBlockInput
  },
  data() {
    return {
      mortgageAmountRemain: ''
    }
  },
  computed: {
    ...mapGetters({
      houseInfo: 'firstHouseInfo',
      loan: 'loan'
    }),
    orderDetail() {
      return this.$store.state.reOrderDetail || {}
    },
    mortgageCode() {
      return (this.loan || {}).isApplyMortgageSecond
    },
    mortgageOrg() {
      return (this.houseInfo || {}).mortgageOrg
    }
  },

  watch: {
    mortgageAmountRemain(value) {
      this.$emit('triggle', value)
    },
    mortgageCode(value) {
      if (value) {
        const mortgageName = (this.houseInfo || {}).mortgageName
        if (!mortgageName) {
          this.queryMortgage().then(data => {
            const mortgageObj = findItemByProp(data, value, 'value') || {}
            this.$set(this.loan, 'isApplyMortgageSecondName', mortgageObj.label || '')
          })
        }
      }
    },
    mortgageOrg(value) {
      if (value) {
        const mortOrgName = (this.houseInfo || {}).mortOrgName
        if (!mortOrgName) {
          this.queryMortOrg().then(data => {
            const mortOrgObj = findItemByProp(data, value, 'value') || {}
            this.$set(this.houseInfo, 'mortOrgName', mortOrgObj.label || '')
          })
        }
      }
    }
  },

  mounted() {
    this.mortgageAmountRemain = Number(this.houseInfo.mortgageAmountRemain).formatTenThousand(2, '')
    if (this.mortgageCode) {
      this.queryMortgage().then(data => {
        const mortgageObj = findItemByProp(data, this.mortgageCode, 'value') || {}
        this.$set(this.houseInfo, 'mortgageName', mortgageObj.label || '')
      })
    }
    if (this.mortgageOrg) {
      this.queryMortOrg().then(data => {
        const mortOrgObj = findItemByProp(data, this.mortgageOrg, 'value') || {}
        this.$set(this.houseInfo, 'mortOrgName', mortOrgObj.label || '')
      })
    }
  },

  methods: {
    openMortgage() {
      this.queryMortgage().then(data => {
        const houseInfo = this.houseInfo || {}
        const mortgageName = houseInfo.mortgageName || ''
        this.openGeneralPicker(data.map(item => item.label), mortgageName, (name) => {
          const mortgageObj = findItemByProp(data, name, 'label')
          this.$set(this.loan, 'isApplyMortgageSecondName', mortgageObj.label)
          this.$set(this.loan, 'isApplyMortgageSecond', mortgageObj.value)
        })
      })
    },
    openMortOrg() {
      this.queryMortOrg().then(data => {
        const houseInfo = this.houseInfo || {}
        const mortOrgName = houseInfo.mortOrgName || ''
        this.openGeneralPicker(data.map(item => item.label), mortOrgName, (name) => {
          const mortOrgObj = findItemByProp(data, name, 'label')
          this.$set(this.houseInfo, 'mortOrgName', mortOrgObj.label)
          this.$set(this.houseInfo, 'mortgageOrg', mortOrgObj.value)
        })
      })
    },
    queryMortgage: (function () {
      return function () {
        const list = this.mortgageList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        else {
          return getDiscData('y_n').then(data => {
            return (this.mortgageList = data || [])
          })
        }
      }
    }()),
    queryMortOrg: (function () {
      return function () {
        const list = this.mortOrgList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        else {
          return getDiscData('mortgageOrg').then(data => {
            return (this.mortOrgList = data || [])
          })
        }
      }
    }()),

    // 打开下拉框
    openGeneralPicker(list, item, func) {
      if (!list || !list.length) {
        return
      }
      this.$Picker({
        slots: [
          {
            type: 'data',
            flex: 1,
            values: list,
            textAlign: 'center',
            defaultValue: item
          }
        ],
        onShow: instance => {
          this.__proto__.__proto__.pickerInstance = instance                    
        },
        onChange: (instance, changeInfo) => {
        },
        onConfirm: (instance, datas) => {
          try {
            func(datas.slot0)
          }
          catch (e) {

          }
          instance.value = false
          this.__proto__.__proto__.pickerInstance = null                              
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


