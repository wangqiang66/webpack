import Vue from 'vue'
import Vuex from 'vuex'
import {
  requestWillOrderList,
  requestWillOrderDetail,
  requestCityList,
  requestOperaOrderBusiness,
  requestProjectList,
  requestBuildingInfo,
  requestFloorInfo,
  requestFamilyNoInfo,
  requestOrgList,
  uploadImage,
  deleteImage,
  updateImage,
  getAppointmentPlaces,
  endBusiness,
  getLoanBankList,
  getLoanProductList,
  updateOrderStatus
} from '@/service'
import { formatDate, handlerItemDate } from '../util/util'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    myList: [], // 我的列表
    recommendList: [],
    allRecommend: [],
    tabFlag: '', // 跳转标志
    // 意向单
    order: {
      applyNo: '',
      transAmount: '',
      operType: '',
      applyAmount: '',
      channelForm: 'CHL01',
      channelName: '',
      agentName: '',
      agentPhone: '',
      customerInfo: [],
      judgeInfo: {},
      deleteId: [],
      productCodeInternal: ''
    },
    customerIndex: -1,
    orderStatus: '',
    // 客户部分
    customer: {
      customerNo: '',
      name: '',
      certType: 'CER',
      certNo: '',
      relationType: '',
      employeeType: '010',
      companyAddress: '',
      companyAddressCode: '',
      address: '',
      addressCode: '',
      phone: '',
      creditRepNum: 0,
      batchNo: ''
    },
    reProduct: {},
    reOrderDetail: {
    },
    // 房产补充部分
    tfbValue: '',
    appointmentPlaces: [],
    oldOrgList: [],
    // 贷款银行列表
    loanBankList: [],
    // 贷款产品列表
    loanProductList: []
  },
  mutations: {
    initOrderStatus(state) {
      state.orderStatus = ''
    },
    setBatchNo(state, batchNo) {
      state.customer.batchNo = batchNo
    },
    setMyList(state, list) {
      state.myList = list
    },
    /**
     * 意向单二期内容
     * set 为设置全部list
     * change为修改当前的list
     */
    setRecommendList(state, list) {
      state.recommendList = list
    },
    // 放置意向单详情内容
    setReOrderDetail(state, detail) {
      state.reOrderDetail = detail
    },
    REMOVE_ORDER_DETAIL(state) {
      state.reOrderDetail = null
    },
    setTabFlag(state, flag) {
      state.tabFlag = flag
    },
    setTfb(state, val) {
      state.tfbValue = val
    },
    // 选择的产品信息
    setChooseProductInfo(state, product) {
      if (typeof product === 'object') {
        Vue.set(state.reOrderDetail, 'chooseProductInfo', product)
      }
    },
    // 贷款附加信息
    setLoan(state, name) {
      if (typeof name === 'object') {
        if (!state.reOrderDetail.loan) {
          Vue.set(state.reOrderDetail, 'loan', {...state.reOrderDetail.loan, name})
        } else {
          state.reOrderDetail.loan = {...state.reOrderDetail.loan, name}
        }
      }
    },
    setHouseInfo(state, name) {
      if (typeof name === 'object') {
        if (!state.reOrderDetail.houseInfo[0]) {
          Vue.set(state.reOrderDetail, 'houseInfo[0]', {...state.reOrderDetail.houseInfo[0], name})
        } else {
          state.reOrderDetail.houseInfo[0] =  {...state.reOrderDetail.houseInfo[0], name}
        }
      }
    },
    updateMarList(state, item) {
      const materialFileList = (state.reOrderDetail || {}).materialFileList || []
      state.reOrderDetail.materialFileList = [...materialFileList, item].sort((item1, item2) => {
        return item1.fileOrder - item2.fileOrder
      })
    },
    updateMarListAll(state, marFilter) {
      const materialFileList = state.reOrderDetail.materialFileList.filter(item => item.objectType !== marFilter.type)
      const list = marFilter.list || []
      state.reOrderDetail.materialFileList = [...materialFileList, ...(list.sort((item1, item2) => {
        return item1.fileOrder - item2.fileOrder
      }))]
    },
    setAppointmentPlaces(state, data) {
      state.appointmentPlaces = data
    },
    setMortgageOrg(state, data) {
      state.reOrderDetail.houseInfo[0].mortgageOrgCode = data.code
      state.reOrderDetail.houseInfo[0].mortgageOrgName = data.name
    },
    /**
     * 设置原贷款机构列表
     */
    setOldOrgList(state, data) {
      state.oldOrgList = data
    },
    /**
     * 设置贷款银行列表
     */
    setLoanBankList(state, data) {
      state.loanBankList = data
    },
    /**
     * 设置贷款银行产品列表
     */
    setLoanProductList(state, data) {
      state.loanProductList = data
    },
    /**
     * 设置loan信息
     */
    setLoanInfo(state, data) {
      state.reOrderDetail.loan = {
        ...state.reOrderDetail.loan,
        ...data
      }
    }
  },
  actions: {
    // 获取订单列表
    requestWillOrderList({ commit, state }, data) {
      return requestWillOrderList(data).then(data => {
        const list = (data || {}).list || []
        const page = data.pageNum || 1
        if (page === 1) {
          commit('setRecommendList', list)
        } else {
          commit('setRecommendList', [...state.recommendList, ...list])
        }
        /**
         * 前端数据组装处理
         */
        list.map(item => item.applyTime = formatDate(item.applyDate))
        return list
      })
    },
    // 获取订单详情
    requestWillOrderDetail({ commit, state }, data) {
      function setDefaultList(data) {
        const tmpData = data || {}
        !tmpData.productInternalList && (tmpData.productInternalList = [])
        !tmpData.customerList && (tmpData.customerList = [])
        if (!tmpData.houseList || !tmpData.houseList.length) {
          // 设定一个初始值
          tmpData.houseList = [{
            "houseNo": "",
            "mortgageOrg": "",
            "mortgageOrgCode": "",
            "mortgageOrgName": ""
          }]
        }
        tmpData.item = handlerItemDate(tmpData.item)
        !tmpData.loan && (tmpData.loan = {})
        tmpData.loan.expectMoneyUseDateStr = formatDate(tmpData.loan.expectMoneyUseDate)
        !tmpData.materialFileList && (tmpData.materialFileList = [])
        !tmpData.landedInsuranceCode && (tmpData.landedInsuranceCode = '')
        !tmpData.landedInsuranceName && (tmpData.landedInsuranceName = '')
        !tmpData.loanNode && (tmpData.loanNode = '')
        !tmpData.loanNodeName && (tmpData.loanNodeName = '')
        // 前端自定义数据
        tmpData.productInfo = tmpData.productInternalList
        tmpData.houseInfo = tmpData.houseList
        tmpData.customerInfo = tmpData.customerList
        return tmpData
      }
      return requestWillOrderDetail(data).then(data => {
        const tmpData = setDefaultList(data)
        commit('setReOrderDetail', tmpData)
        return tmpData
      }).catch(err => {
        const tmpData = setDefaultList({})
        commit('setReOrderDetail', tmpData)
        return err
      })
    },
    /**
     * 清除订单详情
     */
    removeOrder({commit, state}, data) {
      commit('REMOVE_ORDER_DETAIL')
    },
    // 提交业务（包含终止业务）
    submitBusiness({ commit, state }, data) {
      return requestOperaOrderBusiness(data)
    },
    endBusiness({ commit, state }, data) {
      return endBusiness(data)
    },
    // 请求城市列表
    requestCityList({ commit, state }, data) {
      return requestCityList(data).then(data => {
        localStorage.setItem('provinceList', JSON.stringify(data.provinceList))
        localStorage.setItem('cityList', JSON.stringify(data.cityList))
        localStorage.setItem('areaList', JSON.stringify(data.areaList))
        const now = new Date()
        localStorage.setItem('AddressTimePoint', `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`)
        return data
      })
    },
    // 请求楼盘列表
    requestProjectList({ commit, state }, data) {
      return requestProjectList(data)
    },
    // 请求楼栋信息
    requestBuildingInfo({ commit, state }, data) {
      return requestBuildingInfo(data)
    },
    // 请求楼层信息
    requestFloorInfo({ commit, state }, data) {
      return requestFloorInfo(data)
    },
    // 请求房号信息
    requestFamilyNoInfo({ commit, state }, data) {
      return requestFamilyNoInfo(data)
    },
    // 请求机构列表
    requestOrgList({ commit, state }, data) {
      return requestOrgList(data).then(res => {
        const list = res || []
        const pageNo = data.pageNo
        if (pageNo === 1) {
          commit('setOldOrgList', list)
        } else {
          commit('setOldOrgList', [...state.oldOrgList, ...list])
        }
        return list
      })
    },
    // 请求资料列表
    // 上传资料
    uploadImage({ commit, state }, data) {
      const progress = data.progress
      data.progress = undefined
      delete data.progress
      const formData = new FormData()
      Object.keys(data).forEach(item => {
        formData.append(item, data[item])
      })
      const req = uploadImage(formData)
      const engine = req.engine
      engine.upload.onprogress = function(event) {
        if (typeof progress === 'function') {
          progress(event)
        }
      }
      return req
    },
    // 删除图片
    deleteImage({ commit, state }, data) {
      return deleteImage(data)
    },
    // 更新图片信息，主要是排序
    updateImage({ commit, state }, data) {
      return updateImage(data)
    },
    getAppointmentPlaces({commit, state}, data) {
      return getAppointmentPlaces(data).then(result => {
        commit('setAppointmentPlaces', result)
      })
    },
    getLoanBankList({commit, state}, data) {
      return getLoanBankList(data).then(res => {
        commit('setLoanBankList', res)
      })
    },
    getLoanProductList({commit, state}, data) {
      return getLoanProductList(data).then(res => {
        commit('setLoanProductList', res.list)
      })
    },
    /**
     * 设置loan信息
     */
    setLoanInfo({commit, state}, data) {
      commit('setLoanInfo', data)
    },
    // 更新订单状态
    updateOrderStatus({ commit, state }, data) {
      return updateOrderStatus(data)
    }
  },

  getters: {
    // 根据订单详情获取第一条客户信息
    firstCustomerInfo(state) {
      if (!state.reOrderDetail || !state.reOrderDetail.customerInfo || !state.reOrderDetail.customerInfo[0]) return {}
      return state.reOrderDetail.customerInfo[0]
    },
    // 根据订单详情获取第一条房屋信息
    firstHouseInfo(state) {
      // 没有订单编号就不要进行下去咯
      if (!state.reOrderDetail || !state.reOrderDetail.applyNo) return
      const baseObj = {
        houseProvinceCode: '',
        houseProvinceName: '',
        houseCityCode: '',
        houseCityName: '',
        houseAreaCode: '',
        houseAreaName: '',
        fxtCityId: '',
        areaFxtId: ''
      }
      if (!state.reOrderDetail.houseInfo) {
        state.reOrderDetail.houseInfo = state.reOrderDetail.houseList = [{
          ...baseObj
        }]
      } else if (!state.reOrderDetail.houseInfo[0]) {
        state.reOrderDetail.houseInfo[0] = state.reOrderDetail.houseList[0] = {
          ...baseObj
        }
      }

      return state.reOrderDetail.houseInfo[0]
    },
    // 根据订单详情获取产品列表
    productInfo(state) {
      const productInfo = (state.reOrderDetail || {}).productInfo || []
      return productInfo
    },
    // 获取提放保产品信息
    loan(state) {
      if (!state.reOrderDetail) return {}
      return state.reOrderDetail.loan || {}
    },
    // 获取订单详情的资料信息
    materialFileList: (state, getters) => (type) => {
      const materialFileList = (state.reOrderDetail || {}).materialFileList || []
      return materialFileList.filter(item => item.objectType === type).sort((item1, item2) => item1.fileOrder - item2.fileOrder)
    },

    appointmentPlaces(state) {
      return state.appointmentPlaces || []
    },

    oldOrgList(state) {
      return state.oldOrgList || []
    },

    loanBankList(state) {
      return state.loanBankList || []
    },

    loanProductList(state) {
      return state.loanProductList || []
    }
  }
})

export default store
