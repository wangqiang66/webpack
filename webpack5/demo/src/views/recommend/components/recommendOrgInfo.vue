<!--
  function: 推荐信息
  author  : wq
  update  : 2018/10/11 17:44
-->
<template>
  <list-block title="推荐信息">
    <div class="cell-content">
      <div class="c-item">
        <div class="c-label">客户姓名：</div>
        <div class="c-value">{{customerInfo.name}}</div>
      </div>
      <div class="c-item">
        <div class="c-label">身份证号：</div>
        <div class="c-value">{{customerInfo.certNo}}</div>
      </div>
      <template v-if="edit">
        <div class="c-item">
          <div class="c-label">联系电话：</div>
          <div class="c-value">
            <input v-model="customerInfo.phone" type="text" class="c-input" placeholder="请输入联系电话" />
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">婚姻状况：</div>
          <div class="c-value" @click="chooseFunc('marital')">
            <span v-if="customerInfo.marital" class>{{customerInfo.maritalLabel}}</span>
            <span v-else class="c-text">请选择</span>
            <img
              src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
              alt
              class="i-img"
            />
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款银行：</div>
          <div class="c-value" @click="chooseLoanOrg">
            <span v-if="loan.loanOrgName" class>{{loan.loanOrgName}}</span>
            <span v-else class="c-text">请选择</span>
            <img
              src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
              alt
              class="i-img"
            />
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款产品：</div>
          <div class="c-value" @click="chooseLoanProduct">
            <span v-if="loan.orgProductCode" class>{{loan.orgProductName}}</span>
            <span v-else class="c-text">请选择</span>
            <img
              src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
              alt
              class="i-img"
            />
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">借款人类型：</div>
          <div class="c-value radio-wrap">
            <wd-radiogroup 
              :listData="borrowerTypeList"
              name="group1"
              v-model="loan.newLoaneeType"
              class="radio-group"></wd-radiogroup>
          </div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款金额（万）：</div>
          <div class="c-value">
            <input
              v-model="orderDetail.applyAmount"
              type="text"
              class="c-input"
              placeholder="请输入贷款金额"
            />
          </div>
        </div>
        <!-- TODO 如果选择的贷款银行不支持tfb tfbysl 为 N，则下方数据隐藏 -->
        <template v-if="loan.tfbysl === 'Y'">
          <div class="c-item">
            <div class="c-label">用新贷款结清原贷款：</div>
            <div class="c-value">
              <div class="c-value radio-wrap">
                <wd-radiogroup 
                  :listData="newLoanCleanOriLoanList"
                  name="group2"
                  v-model="loan.newPayOri"
                  class="radio-group"></wd-radiogroup>
                
              </div>
            </div>
          </div>
          <template v-if="loan.newPayOri === 'Y'">
          <div class="c-item">
            <div class="c-label">原贷款借款人类型：</div>
            <div class="c-value">
              <div class="c-value radio-wrap">
                <wd-radiogroup 
                  :listData="oriBorrowerTypeList"
                  name="group3"
                  v-model="loan.loaneeType"
                  class="radio-group"></wd-radiogroup>
                
              </div>
            </div>
          </div>
          <div class="c-item">
            <div class="c-label">原贷款机构：</div>
            <div class="c-value">
              <div class="c-value radio-wrap">
                <wd-radiogroup 
                  :listData="oriLoanOrgTypeList"
                  name="group4"
                  v-model="houseInfo.mortgageOrg"
                  class="radio-group"></wd-radiogroup>
               
              </div>
            </div>
          </div>
          <div class="c-item">
            <div class="c-label">原贷款机构名称：</div>
            <div slot="right" class="c-value" @click.stop="openOldOrgChoose">
              <span v-if="!houseInfo || !houseInfo.mortgageOrgCode" class="c-text">请选择</span>
              <span v-else class="value-text">{{houseInfo.mortgageOrgName}}</span>
              <img
                v-if="this.type !== 'detail'"
                src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
                alt
                class="i-img"
              />
            </div>
          </div>
          </template>
        </template>
      </template>
      <template v-else>
        <div class="c-item">
          <div class="c-label">手机号：</div>
          <div class="c-value">{{customerInfo.phone}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">婚姻状态：</div>
          <div class="c-value">{{customerInfo.maritalLabel}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">借款人类型：</div>
          <!-- TODO dic -->
          <div class="c-value">{{loan.newLoaneeTypeLabel}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款银行：</div>
          <div class="c-value">{{loan.loanOrgName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">贷款金额：</div>
          <div class="c-value">{{Number(orderDetail.applyAmount).formatTenThousand(2, '')}}万元</div>
        </div>
        <div class="c-item">
          <div class="c-label">用新贷款结清原贷款：</div>
          <!-- TODO dic -->
          <div class="c-value">{{loan.newPayOriLabel}}</div>
        </div>
        <template v-if="loan.newPayOri === 'Y'">
          <div class="c-item">
            <div class="c-label">原贷款借款人类型：</div>
            <div class="c-value">{{loan.loaneeTypeLabel}}</div>
          </div>
          <div class="c-item">
            <div class="c-label">原贷款机构：</div>
            <div class="c-value">{{houseInfo.mortgageOrgLabel}}</div>
          </div>
          <div class="c-item">
            <div class="c-label">原贷款机构名称：</div>
            <div slot="right" class="c-value" @click.stop="openOldOrgChoose">
              <span v-if="!houseInfo || !houseInfo.mortgageOrgCode" class="c-text">请选择</span>
              <span v-else class="value-text">{{houseInfo.mortgageOrgName}}</span>
              <img
                v-if="this.type !== 'detail'"
                src="http://cdn.ddjf.com/static/images/miniprogram/arrow-r-gray.png"
                alt
                class="i-img"
              />
            </div>
          </div>
        </template>

        <div class="c-item">
          <div class="c-label">推荐人姓名：</div>
          <div class="c-value">{{orderDetail.agentName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">推荐人机构：</div>
          <div class="c-value">{{orderDetail.channelName}}</div>
        </div>
        <div class="c-item">
          <div class="c-label">推荐人联系方式：</div>
          <div class="c-value">{{orderDetail.agentPhone}}</div>
        </div>
      </template>
    </div>
  </list-block>
</template>

<script>
import ListBlock from "@/components/listBlock";
import { findItemByProp, simplePicker } from "@/util/util";
import { getDiscData } from "@/util/disc";
import { mapGetters } from "vuex";

export default {
  props: {
    type: String,
    edit: {
      type: Boolean,
      default: false
    }
  },
  name: "recommendOrgInfo",
  data() {
    return {
      // 原贷款借款人类型
      oldLoanBorrowerKindList: [],
      // 新贷款借款人类型
      newLoanBorrowerKindList: [],
      // y_n
      ynList: [],
      // mortgageOrg
      mortgageOrgList: [],
      // marital
      maritalList: [],
      // currentPickerList
      currentPickerList: [],
      currentPickerLabelList: [],
      // 小程序固定字典部分
      borrowerTypeList: [
        {
          value: "person",
          text: "个人"
        },
        {
          value: "company",
          text: "公司"
        }
      ],
      newLoanCleanOriLoanList: [
        {
          value: "Y",
          text: "是"
        },
        {
          value: "N",
          text: "否"
        }
      ],
      oriBorrowerTypeList: [
        {
          value: "person",
          text: "个人"
        },
        {
          value: "company",
          text: "公司"
        }
      ],
      oriLoanOrgTypeList: [
        {
          value: "BANK",
          text: "银行"
        },
        {
          value: "NOTBANK",
          text: "非银"
        }
      ]
    };
  },
  components: {
    ListBlock
  },
  watch: {
    orderDetail(val) {
      if (val && val.applyNo) {
        this.transLabelByValue();
      }
    },
    edit(val) {
      // 如果有贷款机构编号，则去获取到当前的机构以及机构列表
      if (val && this.orderDetail.loan.loanOrgCode) {
        this.$store
          .dispatch("getLoanBankList", {
            cityCode: this.orderDetail.organizationCityCode
          })
          .then(() => {
            const currentBank = this.loanBankList.find(item => item.bankCode === this.orderDetail.loan.loanOrgCode)
            if (currentBank) {
              this.$set(this.loan, "tfbysl", currentBank.tfbysl);
            }
          });
      }
      if(val) {
        const { orderDetail } = this
        orderDetail.applyAmount = orderDetail.applyAmount / 10000
        this.$store.commit('setReOrderDetail', orderDetail)
      }
    },
    $route(to, from) {
      if (from.name === 'OrgChoose') {
      }
    }
  },
  computed: {
    orderDetail() {
      const orderDetail = this.$store.state.reOrderDetail || {};
      return orderDetail
    },
    ...mapGetters({
      customerInfo: "firstCustomerInfo",
      houseInfo: "firstHouseInfo",
      loan: "loan",
      appointmentPlaces: "appointmentPlaces",
      loanBankList: "loanBankList",
      loanProductList: "loanProductList"
    })
  },
  methods: {
    // 打开原贷款机构选择
    openOldOrgChoose() {
      if (this.type === "detail") return;
      this.skipRouter({
        path: "/org_choose",
        query: { cityCode: this.orderDetail.organizationCityCode }
      });
    },
    transLabelByValue() {
      // 原贷款借款人类型
      this.queryOldLoanKind().then(data => {
        const oldLoanKind = findItemByProp(data, this.loan.loaneeType, "value");
        this.$set(this.loan, "loaneeType", oldLoanKind.value);
        this.$set(this.loan, "loaneeTypeLabel", oldLoanKind.label);
      });

      // 新贷款借款人类型
      this.queryNewLoanKind().then(data => {
        const newLoanKind = findItemByProp(
          data,
          this.loan.newLoaneeType,
          "value"
        );
        this.$set(this.loan, "newLoaneeType", newLoanKind.value);
        this.$set(this.loan, "newLoaneeTypeLabel", newLoanKind.label);
      });

      // YES_OR_NO
      this.queryYN().then(data => {
        const newPayOri = findItemByProp(data, this.loan.newPayOri, "value");
        this.$set(this.loan, "newPayOri", newPayOri.value);
        this.$set(this.loan, "newPayOriLabel", newPayOri.label);
      });

      // mortgageOrg
      this.queryMortgageOrg().then(data => {
        const mortgageOrg = findItemByProp(
          data,
          this.houseInfo.mortgageOrg,
          "value"
        );

        this.$set(this.houseInfo, "mortgageOrg", mortgageOrg.value);
        this.$set(this.houseInfo, "mortgageOrgLabel", mortgageOrg.label);
      });

      // marital
      this.queryMarital().then(data => {
        const marital = findItemByProp(
          data,
          this.customerInfo.marital,
          "value"
        );

        this.$set(this.customerInfo, "marital", marital.value);
        this.$set(this.customerInfo, "maritalLabel", marital.label);
      });
    },
    queryOldLoanKind: (function() {
      return function() {
        const list = this.oldLoanBorrowerKindList;
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list);
          });
        }
        return getDiscData("loaneeType").then(data => {
          return (this.oldLoanBorrowerKindList = data || []);
        });
      };
    })(),
    queryNewLoanKind: (function() {
      return function() {
        const list = this.newLoanBorrowerKindList;
        if (Array.isArray(list) && list.length > 0) {
          return new Promise(resolve => {
            resolve(list);
          });
        }
        return getDiscData("loaneeType").then(data => {
          return (this.newLoanBorrowerKindList = data || []);
        });
      };
    })(),
    queryYN: (function() {
      return function() {
        const list = this.ynList;
        if (Array.isArray(list) && list.length > 0) {
          return Promise.resolve(list);
        }

        return getDiscData("y_n").then(data => {
          return (this.ynList = data || []);
        });
      };
    })(),
    queryMortgageOrg: (function() {
      return function() {
        const list = this.mortgageOrgList;
        if (Array.isArray(list) && list.length > 0) {
          return Promise.resolve(list);
        }

        return getDiscData("mortgageOrg").then(data => {
          return (this.mortgageOrgList = data || []);
        });
      };
    })(),
    queryMarital: (function() {
      return function() {
        const list = this.maritalList;
        if (Array.isArray(list) && list.length > 0) {
          return Promise.resolve(list);
        }

        return getDiscData("marital").then(data => {
          return (this.maritalList = data || []);
        });
      };
    })(),
    /**
     * 选择贷款银行
     */
    chooseLoanOrg() {
      if (this.loanBankList && this.loanBankList.length) {
        this.chooseFunc("loanBank", "bankName");
        return;
      }
      if (!this.orderDetail.organizationCityCode) {
        // TODO error toast
        this.$MessageBox.alert({
          title: `系统错误，无城市编码`
        });
        return;
      }
      this.$store
        .dispatch("getLoanBankList", {
          cityCode: this.orderDetail.organizationCityCode
        })
        .then(() => {
          this.chooseFunc("loanBank", "bankName");
        });
    },
    /**
     * 选择贷款产品
     */
    chooseLoanProduct() {
      if (this.loanProductList && this.loanProductList.length) {
        this.chooseFunc("loanProduct", "name");
        return;
      }
      // 前置条件需要有以选择的贷款银行
      if (!this.loan || !this.loan.loanOrgCode) {
        this.$MessageBox.alert({
          title: `请先选择贷款银行`
        });
        return;
      }
      //  此处是肯定会有贷款产品了，无需再请求。
      //  。。。还是加上去
      this.$store
        .dispatch("getLoanProductList", {
          loanOrgCode: this.loan.loanOrgCode
        })
        .then(() => {
          this.chooseFunc("loanProduct", "name");
        });
    },

    /**
     * 设置贷款产品
     */
    setLoanProduct(loanProduct = {}) {
      this.$set(this.loan, "orgProductCode", loanProduct.code);
      this.$set(this.loan, "orgProductName", loanProduct.name);
    },
    /**
     * 通用的选择方法
     */
    chooseFunc: (function() {
      let baseData = {};
      const map = new Map()
        .set("marital", function(marital) {
          // 这里之所以这样写而不是通过store的形式是因为customerList是一个数组，修改其值并触发页面更新这样是最方便的
          this.$set(this.customerInfo, "marital", marital.value);
          this.$set(this.customerInfo, "maritalLabel", marital.label);
        })
        .set("loanBank", function(loanBank) {
          this.currentLoanBank = loanBank;
          this.$set(this.loan, "loanOrgCode", loanBank.bankCode);
          this.$set(this.loan, "loanOrgName", loanBank.bankName);
          this.$set(this.loan, "tfbysl", loanBank.tfbysl);
          // 选择了一个贷款银行后，就自动选择一第一个贷款产品作为其贷款产品
          this.$store
            .dispatch("getLoanProductList", {
              loanOrgCode: this.loan.loanOrgCode
            })
            .then(() => {
              this.setLoanProduct(this.loanProductList[0]);
            });
        })
        .set("loanProduct", function(loanProduct) {
          this.setLoanProduct(loanProduct);
        });
      return function(type, labelAttr = "label") {
        this.currentPickerList = [...this[`${type}List`] || []];
        this.currentPickerLabelList = [...this.currentPickerList.map(
          item => item[labelAttr]
        )];
        simplePicker.call(this, this.currentPickerLabelList).then(index => {
          let current = this.currentPickerList[index];
          map.get(type) && map.get(type).call(this, current);
        });
      };
    })()
  }
};
</script>

<style lang="scss">
.cell-content {
  .c-item {
    align-items: center;
    .c-label {
    }

    .c-value {
      display: flex;
      align-items: center;
      .c-text {
        color: #888;
      }

      .c-input {
        color: #000;
        opacity: 1;
        border: none;
        font-size: 28px;
        outline: none;
        background: transparent;
        width: 240px;
        text-overflow: ellipsis;
      }

      .i-img {
        display: inline-block;
        vertical-align: middle;
        height: 26px;
        width: 16px;
        padding-left: 10px;
      }
    }

    .radio-wrap {
      .radio-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .radio-label {
          padding: 0 10px;
        }
      }

      .radio-group {
        margin-top: 0;
        .wd-radiogroup-list {
          display: flex;
          padding-left: 0;
          li {
            height: auto;
            line-height: 1;
            border: none;
            margin-right: 10px;
            .wd-radio {
              /* 它组件的那个大小也太cha了 */
              transform: scale(.8);
            }
            .wd-radiogroup-text {
              margin: 0;
              padding-left: 10px;
              font-size: 28px;
              flex: 1;
              display: inline-block;
            }
          }
        }
      }
    }

    .choose-text {
      color: #888;
    }

    .value-input {
      border: none;
      outline: none;
    }
  }
}
</style>

