<!--
  function: 推荐信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block title="客户信息">
    <div class="cell-content">
      <div class="c-item">
        <div class="c-label">客户姓名：</div>
        <div class="c-value" v-if="!isEditName">{{customerInfo.name}}</div>
        <input v-else class="c-input c-value" v-model="customerInfo.name" />
        <img v-if="canEditInfo && !isEditName" class="icon-edit" :src="editIcon" @click="clickEditName" />
      </div>
      <div class="c-item">
        <div class="c-label">联系电话：</div>
        <div class="c-value"><a :href="'tel:'+customerInfo.phone" style="color: #126ae4;">{{customerInfo.phone}}</a></div>
      </div>
      <div class="c-item">
        <div class="c-label">证件号码：</div>
        <div v-if="!isEditCertNo" class="c-value">{{customerInfo.certNo}}</div>
        <input v-else class="c-input c-value" v-model="customerInfo.certNo" />
        <img v-if="canEditInfo && !isEditCertNo" class="icon-edit" :src="editIcon" @click="clickEditCertNo"/>
      </div>
      <div class="c-item">
        <div class="c-label">客户类型：</div>
        <div class="c-value">{{customerInfo.employeeType}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">所属行业：</div>
        <div class="c-value">{{customerInfo.industry}}</div>
      </div>
    </div>
  </list-block>
</template>

<script>
import ListBlock from '@/components/listBlock'

export default {
  name: 'recommendInfo',
  components: {
    ListBlock
  },
  props: {
    customerInfo: {
      type: Object,
      default: () => ({})
    },
    canEditInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEditName: false,
      isEditCertNo: false,
      editIcon: require('../../../../images/edit.png')
    }
  },
  methods: {
    clickEditName() {
      this.isEditName = true
    },
    clickEditCertNo() {
      this.isEditCertNo = true
    }
  }
}
</script>
