<template>
  <div v-cloak class="re-container column full-parent-height">
    <list-block class="flex1" title="推荐信息">
      <div class="cell-content">
        <div class="c-item">
          <div class="c-label">联系人：</div>
          <div class="c-value">{{customer.name}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">联系方式：</div>
          <div class="c-value"><a :href="'tel:'+customer.phone" style="color: #126ae4;">{{customer.phone}}</a>
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">渠道联系人：</div>
          <div class="c-value">{{detail.cusManagerName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">渠道联系方式：</div>
          <div class="c-value"><a :href="'tel:'+detail.cusManagerPhone" style="color: #126ae4;">{{detail.cusManagerPhone}}</a>
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">房产地址：</div>
          <div class="c-value">{{house.houseAddress}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">估值金额：</div>
          <div class="c-value">{{ Number(house.houseEvaluatePrice).formatTenThousand(2, '') }}万元</div>
        </div>
        <div class="c-item">
          <div class="c-label">预估额度：</div>
          <div class="c-value">{{ Number(detail.estimatedQuota).formatTenThousand(2, '') }}万元</div>
        </div>
        <div class="c-item">
          <div class="c-label">申请金额：</div>
          <div class="c-value">{{ Number(detail.applyAmount).formatTenThousand(2, '') }}万元</div>
        </div>
        <div class="c-item">
          <div class="c-label">联系结果：</div>
          <div class="c-value">{{ contactResultStatusMap[detail.contactResult] }}</div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款方式：</div>
          <div class="c-value">{{ mortgageTypeStatusMap[detail.mortgageType] }}</div>
        </div>
        <div class="c-item">
          <div class="c-label">房产状态：</div>
          <div class="c-value">{{ mortgageStatusMap[house.isMortgage] }}</div>
        </div>
      </div>
    </list-block>
    <div class="btn-wrap" v-if="detail.processStatus === 'DCL'">
      <wd-button type="primary" class="btn-item" :disabled="loading"><span @click="deal"
                                                                           style="width: 100%; height: 100%;display: block;">处理</span>
      </wd-button>
    </div>
  </div>
</template>

<script>
import ListBlock from '@/components/listBlock'

export default {
  components: {
    ListBlock
  },
  data() {
    return {
      detail: {},
      loading: false,
      mortgageStatusMap: {
        '1': '抵押中',
        '0': '红本在手'
      },
      contactResultStatusMap: {
        'Y': '有需求',
        'N': '无需求'
      },
      mortgageTypeStatusMap: {
        'ONE': '一押',
        'TWO': '二押'
      }
    }
  },
  computed: {
    house() {
      const detail = this.detail || {}
      const houses = detail.houses || {}
      let house = houses
      if (Array.isArray(houses)) {
        house = houses[0] || {}
      }
      return house
    },
    customer() {
      const detail = this.detail || {}
      const customers = detail.customers || {}
      let customer = customers
      if (Array.isArray(customers)) {
        customer = customers[0] || {}
      }
      return customer
    }
  },
  mounted() {
    const applyNo = this.$route.query.applyNo
    const channelType = this.$route.query.channelType
    this.$store.dispatch('requestWillOrderDetail', { applyNo, channelType })
      .then(data => {
        this.detail = data
        return data
      })
  },
  methods: {
    deal() {
      this.loading = true
      const applyNo = this.$route.query.applyNo
      const channelType = this.$route.query.channelType
      this.$store.dispatch('updateOrderStatus', { applyNo, channelType: channelType, statusCode: 'YCL' }).then(res => {
        let toast = this.$Toast({
          content: '操作成功',
          iconClass: 'success',
          autoClose: false
        })
        this.loading = false
        this.timer = setTimeout(() => {
          toast.close()
          this.$router.back()
        }, 1000)
        return res
      }).catch(err => {
        this.loading = false
        throw err
      })
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
    this.timer = null
  }
}
</script>
