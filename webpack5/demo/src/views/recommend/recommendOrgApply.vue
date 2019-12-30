<template>
  <div v-cloak class="re-container">
    <RecommendOrgInfo :edit="canEdit" />
    <div class="web-upload-wrap">
      <wd-button type="default" @click.native="uploadDataList" class="btn-item">资料上传</wd-button>
    </div>
    <div class="btn-wrap">
      <wd-button type="primary" class="btn-item" :disabled="isApply">
        <span @click="apply('first')" style="width: 100%; height: 100%;display: block;">发起</span>
      </wd-button>
      <wd-button type="default" @click.native="operateBusiness" class="btn-item btn-warn">终止业务</wd-button>
    </div>
    <popup-stop-business v-model="showStopBusiness"></popup-stop-business>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isNumEmpty } from "@/util/util.js";
import RecommendOrgInfo from "./components/recommendOrgInfo";
import PopupStopBusiness from "./components/popupStopBusiness";

export default {
  components: {
    PopupStopBusiness,
    RecommendOrgInfo
  },
  data() {
    return {
      showStopBusiness: false,
      canEdit: false
    };
  },
  created() {
    this.getData().then(() => {
      try {
        this.canEdit = this.orderDetail.attach.fieldVersion === "simple";
      } catch (err) {}
    });
  },
  beforeRouteEnter(to, from, next) {
    if (!to.meta.keepAlive) {
      to.meta.keepAlive = true;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name === "reProductList" ||
      to.name === "OrgChoose" ||
      to.name === "dataList"
    ) {
      from.meta.keepAlive = true;
    } else {
      if (this.$vnode && this.$vnode.data.keepAlive) {
        from.meta.keepAlive = false;
        if (
          this.$vnode.parent &&
          this.$vnode.parent.componentInstance &&
          this.$vnode.parent.componentInstance.cache
        ) {
          if (this.$vnode.componentOptions) {
            const key =
              this.$vnode.key == null
                ? this.$vnode.componentOptions.Ctor.cid +
                  (this.$vnode.componentOptions.tag
                    ? `::${this.$vnode.componentOptions.tag}`
                    : "")
                : this.$vnode.key;
            const cache = this.$vnode.parent.componentInstance.cache;
            const keys = this.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                const index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
              this.$destroy();
            }
          }
        }
      }
    }
    next();
  },
  computed: {
    ...mapGetters({
      customerInfo: "firstCustomerInfo",
      houseInfo: "firstHouseInfo",
      loan: "loan",
      appointmentPlaces: "appointmentPlaces"
    }),
    orderDetail() {
      return this.$store.state.reOrderDetail || {};
    },
    productInfo() {
      return this.orderDetail.chooseProductInfo || {};
    },
    isApply() {
      let msg = ''
      if (this.orderDetail && this.orderDetail.attach && this.orderDetail.attach.fieldVersion === 'simple') {
        msg = this.simpleValidation()
      } else {
        msg = this.validApply();
      }
      return msg !== true;
    }
  },
  methods: {
    /**
     * @description 申请方法校验
     */
    validApply() {
      const houseInfo = this.houseInfo || {};
      const loan = this.loan || {};
      if (
        loan.newPayOri === "Y" &&
        houseInfo.mortgageOrg === "NOTBANK" &&
        !houseInfo.mortgageOrgCode
      ) {
        return "请先选择原贷款机构";
      }
      return true;
    },

    apply(commitType = "first") {
      const orderDetail = this.orderDetail || {};
      // 默认是detailed
      const fieldVersion = orderDetail.attach.fieldVersion || "detailed";
      let msg;
      let data = {};
      // 原校验逻辑，不变
      if (fieldVersion === "detailed") {
        if ((msg = this.validApply()) !== true) {
          this.$MessageBox.alert({
            title: msg
          });
          return false;
        }
        data = {
          commitType,
          applyNo: orderDetail.applyNo,
          houseList: this.houseListHandler()
        };
      } else if (fieldVersion === "simple") {
        if ((msg = this.simpleValidation()) !== true) {
          this.$MessageBox.alert({
            title: msg
          });
          return false;
        }
        data = this.simpleOrderDetail();
      }
       // 防止二次错误弹窗
      data.defineError = true   
      const self = this;
      this.$store
        .dispatch("submitBusiness", data)
        .then(res => {
          let toast = this.$Toast({
            content: "发起成功",
            iconClass: "success",
            autoClose: false
          });
          this.$store.commit("setTfb", "");
          setTimeout(() => {
            toast.close();
            this.skipRouter({
              path: "/",
              query: { selectedTabId: "tab3" }
            });
          }, 1000);
        })
        .catch(e => {
          if (e.retCode === "3") {
            this.$MessageBox.confirm({
              title: "",
              text: e.retMsg,
              onConfirm(instance) {
                self.apply("recommit");
                instance.open = false;
              },
              onCancel(instance) {
                instance.open = false;
              }
            });
          } else {
            this.$MessageBox.alert({
              title: e.retMsg
            });
          }
        });
    },
    simpleOrderDetail() {
      const {orderDetail, customerInfo, loan, houseInfo} = this
      // 如果中间有切换贷款银行导致其tfbysl为N，则清空后面生成的数据
      let data = {
        applyNo: orderDetail.applyNo,
        applyAmount: orderDetail.applyAmount * 10000,
        loan: {...loan},
        customerList: [...orderDetail.customerList],
        attach: orderDetail.attach,
        houseList: [...orderDetail.houseList]
      }
      if (loan.tfbysl === 'N') {
        data.loan = {
          ...data.loan,
          newPayOri: 'N',
          loaneeType: ''
        }

        data.houseList[0] = {
          ...data.houseList[0],
          mortgageOrg: '',
          mortgageOrgCode: '',
          mortgageOrgName: ''
        }
      }

      if (loan.tfbysl === 'Y' && loan.newPayOri === 'N') {
        data.loan = {
          ...data.loan,
          loaneeType: ''
        }
        
        data.houseList[0] = {
          ...data.houseList[0],
          mortgageOrgCode: '',
          mortgageOrgName: ''
        }
      }

      return data
    },
    simpleValidation() {
      const {orderDetail, customerInfo, loan, houseInfo} = this
      const completeMsg = '请完善推荐信息再进行提交'
      if (!orderDetail) return `系统错误，订单详情获取失败`
      // 基础信息判断，必须要有：婚姻状况，贷款银行， 贷款产品， 借款人类型，贷款金额这几个
      if (!customerInfo.marital || !loan.loanOrgCode || !loan.orgProductCode || !loan.newLoaneeType || !orderDetail.applyAmount) return completeMsg
      // 如果选择了支持提放保的贷款银行，则需要判断 用新贷款结清原贷款，原贷款借款人类型， 原贷款机构这三个字段
      if (loan.tfbysl === 'Y') {
        if (!loan.newPayOri) return completeMsg
        if (loan.newPayOri === 'Y' && (!houseInfo.mortgageOrgCode || !loan.loaneeType || !houseInfo.mortgageOrg)) return completeMsg
      }
      return true
    },
    operateBusiness() {
      this.showStopBusiness = true;
    },
    // 资料上传
    uploadDataList() {
      this.skipRouter({
        path: "/dataList",
        query: {
          applyNo: this.applyNo,
          customerNo: this.customerInfo.customerNo,
          houseNo: this.houseInfo.houseNo,
          productIndex: this.productIndex
        }
      });
    },

    /**
     * 获取订单数据
     */
    getData() {
      const applyNo = (this.applyNo = this.$route.query.applyNo);
      return new Promise((resolve, reject) => {
        const orderDetail = this.orderDetail || {};
        if (
          typeof orderDetail !== "object" ||
          Object.keys(orderDetail).length <= 0
        ) {
          this.$store
            .dispatch("requestWillOrderDetail", {
              applyNo
            })
            .then(data => {
              resolve(data);
            });
        } else {
          resolve();
        }
      });
    },

    houseListHandler() {
      const houseList = this.orderDetail.houseList || [];
      houseList.map(item => {
        // 数据处理
        this.mortgageAmountRemain &&
          (item.mortgageAmountRemain = +this.mortgageAmountRemain * 10000);
      });
      return houseList || [];
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === "OrgChoose") {
        // 强制刷新缓存
        // this.$destroy();
      }
    }
  }
};
</script>
