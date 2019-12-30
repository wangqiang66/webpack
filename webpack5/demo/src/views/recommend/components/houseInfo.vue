<!--
  function: 推荐信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block title="房产信息">
    <div class="cell-content">
      <div class="c-item">
        <div class="c-label long">房产所在城市：</div>
        <div class="c-value">{{`${houseInfo.houseProvinceName}${houseInfo.houseCityName}${houseInfo.houseAreaName}`}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">房产详细地址：</div>
        <div class="c-value">{{houseInfo.houseAddress}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">房产面积（m²）：</div>
        <div class="c-value">{{houseInfo.area}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">房产总价（万）：</div>
        <div class="c-value">{{Number(houseInfo.price).formatTenThousand(2, '')}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">竣工时间：</div>
        <div class="c-value">{{houseInfo.age}}年</div>
      </div>
      <div class="c-item">
        <div class="c-label long">房产类型：</div>
        <div class="c-value">{{houseInfo.purpose}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">共权人数量：</div>
        <div class="c-value">{{houseInfo.coownerNum}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">共权人情况：</div>
        <div class="c-value">{{houseInfo.coownerRelationType}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">有无其他住房：</div>
        <div class="c-value">{{houseInfo.hasOtherProperty}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">房产有无贷款：</div>
        <div class="c-value">{{houseInfo.isMortgage === '1' ? '有' : '无'}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">原贷款机构名称：</div>
        <div class="c-value">{{houseInfo.mortgageOrgName}}</div>
      </div>
      <div class="c-item">
        <div class="c-label long">在押余额（万）：</div>
        <div class="c-value">{{Number(houseInfo.mortgageAmountRemain).formatTenThousand(2, '')}}</div>
      </div>
    </div>
  </list-block>
</template>

<script>
import ListBlock from '@/components/listBlock'
import { mapGetters } from 'vuex'

export default {
  name: 'recommendInfo',
  components: {
    ListBlock
  },
  props: {
    houseInfo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters({
      loan: 'loan'
    })
  }
}
</script>
