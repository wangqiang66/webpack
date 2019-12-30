<!--
  function: 提放保内容模块
  author  : wq
  update  : 2018/10/15 10:00
-->
<template>
  <list-block-input title="">
    <wd-cell class="light-border">
      <p slot="left" class="l-label">搭配提放保<span class="must">*</span></p>
      <div slot="right" class="r-value" @click.stop="openTfbChoose">
        <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled
               v-model="orderDetail.tfbProductName"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
    </wd-cell>
    <wd-cell class="light-border" v-for="(item, index) in tfbKindList" :key="`tfb_kind_choose_${index}`">
      <p slot="left" class="l-label">{{item.name}}<span class="must">*</span></p>
      <div slot="right" class="r-value" @click="openFilter(item.method, item, ...arguments)">
        <input type="text" slot="right" placeholder="请选择" :class="['i-input', 'i-disabled', item.className||'']"
               disabled v-model="item.value"> <img
         src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
      </div>
    </wd-cell>
    <template v-if="tfbProductCode && tfbProductCode != 'NULL'">
      <wd-cell class="light-border" v-if="tfbProductCode && tfbProductCode === 'TFB_YSL_NJY_ISR'">
        <p slot="left" class="l-label">赎楼金额<span class="must">*</span></p>
        <div slot="right" class="r-value">
          <input type="number" slot="right" placeholder="请输入赎楼金额" class="i-input i-disabled"
                 v-model="redemptionAmount"> <span class="i-unit">万元</span>
        </div>
      </wd-cell>
      <wd-cell class="light-border">
        <p slot="left" class="l-label">合作保险<span class="must">*</span></p>
        <div slot="right" class="r-value" @click.stop="openInsurance">
          <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled
                 v-model="orderDetail.landedInsuranceName"> <img
           src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
        </div>
      </wd-cell>
      <wd-cell class="light-border" v-if="orderDetail.landedInsuranceCode">
        <p slot="left" class="l-label">放款节点<span class="must">*</span></p>
        <div slot="right" class="r-value" @click.stop="openLoanNode">
          <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled
                 v-model="orderDetail.loanNodeName"> <img
           src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
        </div>
      </wd-cell>
      <wd-cell class="light-border">
        <p slot="left" class="l-label">是否先审批<span class="must">*</span></p>
        <div slot="right" class="r-value" @click.stop="openApprovalFirst">
          <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled v-model="orderDetail.isApprovalFirstName">
          <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
        </div>
      </wd-cell>
      <template v-if="tfbProductCode && tfbProductCode!== 'NULL'">
          <template v-if="tfbProductCode === 'TFB_YSL_NJY_ISR'">
            <wd-cell class="light-border">
              <p slot="left" class="l-label">原贷款机构<span class="must">*</span></p>
              <div slot="right" class="r-value" @click.stop="openOldOrgChoose">
                <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled :value="houseInfo.mortgageOrgName">
                <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
              </div>
            </wd-cell>
            <wd-cell class="light-border">
              <p slot="left" class="l-label">原贷款借款人类型<span class="must">*</span></p>
              <div slot="right" class="r-value" @click.stop="openOldLoanKind">
                <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled :value="loan.loaneeTypeLabel">
                <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
              </div>
            </wd-cell>
          </template>
          <wd-cell class="light-border">
            <p slot="left" class="l-label">新贷款借款人类型<span class="must">*</span></p>
            <div slot="right" class="r-value" @click.stop="openNewLoanKind">
              <input type="text" slot="right" placeholder="请选择" class="i-input i-disabled" disabled v-model="loan.newLoaneeTypeLabel">
              <img src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png" alt="" class="i-img">
            </div>
          </wd-cell>
      </template>
    </template>
  </list-block-input>
</template>

<script>
import ListBlockInput from '@/components/inputListBlock'
import { mapGetters } from 'vuex'
import { getDiscData } from '@/util/disc'
import { getLandedInsuranceList, getLoanNodeList } from '@/service'
import { findItemByProp } from '@/util/util'

export default {
  name: 'tfbInfoInput',
  components: {
    ListBlockInput
  },
  data() {
    return {
      // 提放保选项列表
      tfbList: [],
      // 提放保里面内容配置
      tfbKindList: [],
      // 落地保险列表
      landedInsuranceList: [],
      // 放款节点列表
      loanNodeList: [],
      // 原贷款借款人类型
      oldLoanBorrowerKindList: [],
      // 新贷款借款人类型
      newLoanBorrowerKindList: [],
      redemptionAmount: ''
    }
  },
  computed: {
    ...mapGetters({
      loan: 'loan',
      houseInfo: 'firstHouseInfo'
    }),
    orderDetail() {
      return this.$store.state.reOrderDetail || {}
    },
    tfbProductCode() {
      return (this.orderDetail || {}).tfbProductCode
    },
    landedInsuranceCode() {
      return (this.orderDetail || {}).landedInsuranceCode
    },
    loanNode() {
      return (this.orderDetail || {}).loanNode
    },
    isApprovalFirst() {
      return this.orderDetail.isApprovalFirst || ''
    }
  },
  watch: {
    redemptionAmount(value) {
      this.$emit('triggle', value)
    },
    tfbProductCode(value) {
      if (value) {
        this.$set(this.orderDetail, 'isApprovalFirst', '')
        const tfbProductName = (this.orderDetail || {}).tfbProductName
        if (!tfbProductName) {
          this.queryTfb().then(data => {
            const tfbObj = findItemByProp(data, value, 'value') || {}
            this.$set(this.orderDetail, 'tfbProductName', tfbObj.label || '')
          })
        }
      }
    },
    landedInsuranceCode(value) {
      if (value) {
        const landedInsuranceName = (this.orderDetail || {}).landedInsuranceName
        if (!landedInsuranceName) {
          this.queryInsurance().then(data => {
            const insuranceObj = findItemByProp(data, value, 'insuranceName') || {}
            this.$set(this.orderDetail, 'landedInsuranceName', insuranceObj.insuranceName || '')
          })
        }
      }
    },
    loanNode(value) {
      if (value) {
        const loanNodeName = (this.orderDetail || {}).loanNodeName
        if (!loanNodeName) {
          this.queryLoanNode().then(data => {
            const loanNodeObj = findItemByProp(data, value, 'loanNodeName') || {}
            this.$set(this.orderDetail, 'loanNodeName', loanNodeObj.loanNodeName || '')
          })
        }
      }
    },
    isApprovalFirst (value) {
      if (value) {
        const isApprovalFirstName = (this.orderDetail || {}).isApprovalFirstName
        if (!isApprovalFirstName) {
          this.queryApproval().then(data => {
            const approvalObj = findItemByProp(data, value, 'value') || {}
            this.$set(this.orderDetail, 'isApprovalFirstName', approvalObj.label || '')
          })
        }
      } else {
        this.$set(this.orderDetail, 'isApprovalFirstName', '')
      }
    }
  },
  methods: {
    openTfbChoose() {
      this.queryTfb().then(data => {
        const orderDetail = this.orderDetail || {}
        const tfbProductName = orderDetail.tfbProductName || ''
        this.openGeneralPicker(data.map(item => item.label), tfbProductName, (name) => {
          const tfbObj = findItemByProp(data, name, 'label')
          this.$set(this.orderDetail, 'tfbProductName', tfbObj.label)
          this.$set(this.orderDetail, 'tfbProductCode', tfbObj.value)
        })
      })
    },
    openInsurance() {
      this.queryInsurance().then(data => {
        const orderDetail = this.orderDetail || {}
        const landedInsuranceName = orderDetail.insuranceName || ''
        this.openGeneralPicker(data.map(item => item.insuranceName), landedInsuranceName, (name) => {
          const insuranceObj = findItemByProp(data, name, 'insuranceName')
          this.$set(this.orderDetail, 'landedInsuranceName', insuranceObj.insuranceName)
          this.$set(this.orderDetail, 'landedInsuranceCode', insuranceObj.insuranceId)
        })
      })
    },
    openLoanNode() {
      this.queryLoanNode().then(data => {
        const orderDetail = this.orderDetail || {}
        const loanNodeName = orderDetail.loanNodeName || ''
        this.openGeneralPicker(data.map(item => item.loanNodeName), loanNodeName, (name) => {
          const loanNodeObj = findItemByProp(data, name, 'loanNodeName')
          this.$set(this.orderDetail, 'loanNodeName', loanNodeObj.loanNodeName)
          this.$set(this.orderDetail, 'loanNode', loanNodeObj.loanNodeCode)
        })
      })
    },
    openApprovalFirst() {
      this.queryApproval().then(data => {
        const orderDetail = this.orderDetail || {}
        const approvalName = orderDetail.isApprovalFirst || ''
        this.openGeneralPicker(data.map(item => item.label), approvalName, (name) => {
          const ApprovalObj = findItemByProp(data, name, 'label')
          this.$set(this.orderDetail, 'isApprovalFirst', ApprovalObj.value)
          this.$set(this.orderDetail, 'isApprovalFirstName', ApprovalObj.label)
        })
      })
    },
    /**
     * 选择原贷款人类型
     */
    openOldLoanKind() {
      this.queryOldLoanKind().then(data => {
        this.openGeneralPicker(data.map(item => item.label), '', (name) => {
          const oldLoanKind = findItemByProp(data, name, 'label')
          this.$set(this.loan, 'loaneeType', oldLoanKind.value)
          this.$set(this.loan, 'loaneeTypeLabel', oldLoanKind.label)
        })
      })
    },
    /**
     * 选择新贷款人类型
     */
    openNewLoanKind() {
      this.queryNewLoanKind().then(data => {
        this.openGeneralPicker(data.map(item => item.label), '', (name) => {
          const newLoanKind = findItemByProp(data, name, 'label')
          this.$set(this.loan, 'newLoaneeType', newLoanKind.value)
          this.$set(this.loan, 'newLoaneeTypeLabel', newLoanKind.label)
        })
      })
    },
    queryOldLoanKind: (function() {
      return function() {
        const list = this.oldLoanBorrowerKindList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        return getDiscData('loaneeType').then(data => {
          return (this.oldLoanBorrowerKindList = data || [])
        })
      }
    })(),
    queryNewLoanKind: (function() {
       return function() {
        const list = this.newLoanBorrowerKindList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        return getDiscData('loaneeType').then(data => {
          return (this.newLoanBorrowerKindList = data || [])
        })
      }
    })(),
    queryApproval: (function() {
      return function() {
        const list = this.ApprovalList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        } else {
          return getDiscData('isApprovalFirst').then(data => {
            return (this.ApprovalList = data || [])
          })
        }
      }
    }()),
    // 获取合作机构选项列表
    queryInsurance: (function () {
      return function () {
        const list = this.landedInsuranceList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        else {
          const data = {
            city: this.orderDetail. organizationCityCode,
            bpmsProductId: this.tfbProductCode,
            loanOrgCode: this.orderDetail.chooseProductInfo.loanOrgCode
          }
          return getLandedInsuranceList(data).then(data => {
            return (this.landedInsuranceList = data || [])
          })
        }
      }
    }()),
    // 获取合作机构选项列表
    queryLoanNode: (function () {
      return function () {
        const list = this.loanNodeList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        else {
          const data = {
            city: this.orderDetail. organizationCityCode,
            bpmsProductId: this.tfbProductCode,
            loanOrgCode: this.orderDetail.chooseProductInfo.loanOrgCode,
            insuranceOrgCode: this.orderDetail.landedInsuranceCode
          }
          return getLoanNodeList(data).then(data => {
            return (this.loanNodeList = data || [])
          })
        }
      }
    }()),
    // 获取提放保选项列表
    queryTfb: (function () {
      return function () {
        const list = this.tfbList
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list)
          })
        }
        else {
          return getDiscData('dingTfbProduct').then(data => {
            return (this.tfbList = data || [])
          })
        }
      }
    }()),
    // 打开原贷款机构选择
    openOldOrgChoose() {
      this.skipRouter({ path: '/org_choose', query: { cityCode: this.orderDetail.organizationCityCode } });
    },
    // 打开配置拦截中转
    openFilter(name, ...args) {
      'function' === typeof this[name] && this[name].apply(this, args);
    },
    /**
     * picker
     * @list picker list
     * @item default value
     * @func callback fn
     */
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
    },

    /**
     * 转换详情Value值 --- > Label值
     */
    transLabelByValue() {
      // 转换原贷款借款人类型:
      this.queryOldLoanKind().then(data => {
        const oldLoanKind = findItemByProp(data, this.loan.loaneeType, 'value')
        this.$set(this.loan, 'loaneeType', oldLoanKind.value)
        this.$set(this.loan, 'loaneeTypeLabel', oldLoanKind.label)
      }) 

      this.queryNewLoanKind().then(data => {
        const newLoanKind = findItemByProp(data, this.loan.newLoaneeType, 'value')
        this.$set(this.loan, 'newLoaneeType', newLoanKind.value)
        this.$set(this.loan, 'newLoaneeTypeLabel', newLoanKind.label)
      })
    }
  },

  mounted() {
    this.redemptionAmount = Number(this.orderDetail.redemptionAmount).formatTenThousand(2, '')
    if (this.tfbProductCode !== 'NULL') {
      if (this.isApprovalFirst) {
        this.queryApproval().then(data => {
          const approvalObj = findItemByProp(data, this.isApprovalFirst, 'value') || {}
          this.$set(this.orderDetail, 'isApprovalFirstName', approvalObj.label || '')
        })
      }
    }
    this.transLabelByValue()
  }
}
</script>
