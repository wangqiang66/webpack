/**
 * function: index
 * author  : wq
 * update  : 2018/9/14 16:03
 */
import request, { newFly } from './api'
import AppConfig from '@/config'
import ddSingle from '@/dd'
import {
  getdingtalksession,
  getdingtalkconfig,
  getspaceid,
  getdictbytype,
  willorderlist,
  willorderdetail,
  getallarealist,
  projectlist,
  buildinglist,
  floorlist,
  houselist,
  operationorder,
  orglist,
  landedinsurancelist,
  loannodelist,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMAGE,
  GET_APPOINT_PLACE,
  END_BUSINESS,
  GET_LOAN_BANK_LIST,
  GET_LOAN_PRODUCT_LIST,
  UPDATE_ORDER_STATUS
} from './defined'

export const getUserSession = () => {
  const session = localStorage.getItem('intentionSession')
  if (session) {
    return new Promise((resolve) => {
      resolve(session)
    })
  }
  return getAuthCode().then(data => {
    const tmpData = data || {}
    const code = tmpData.code
    const type = localStorage.getItem('intentionType') || '01'
    return requestDingTalkSession(code, type)
  }).then(data => {
    if (data) {
      localStorage.setItem('intentionSession', data)
    }
  })
}

// 获取免登code
export const getAuthCode = () => {
  const ddCompanyConfig = ddSingle.getDDCompanyConfig()
  let corpId = null
  if (ddCompanyConfig) {
    corpId = ddCompanyConfig.corpId
  }
  if (corpId) {
    return ddSingle.getAuthCode(corpId)
  }
  else {
    return getCorpId('login').then(data => {
      const tmpData = data || {}
      ddSingle.saveDDCompanyConfig(tmpData)
      return ddSingle.getAuthCode(tmpData.corpId)
    })
  }
}

// 获取钉钉code
export const getCorpId = (type) => {
  if (type === 'login') {
    return getDingTalkConfig()
  }
  else if (type === 'upload') {
    return getUploadSpaceId()
  }
}

// 获取企业配置信息
export const getDingTalkConfig = () => {
  return newFly.get(getdingtalkconfig, {
    url: AppConfig.indexUrl,
    type: localStorage.getItem('intentionType') || '01'
  }, {
    definedUrl: getdingtalkconfig
  })
}

// 获取上传图片的空间ID
export const getUploadSpaceId = (data) => {
  return request.post(getspaceid, data, {
    definedUrl: getspaceid
  })
}

// 协议请求钉钉获取session
export const requestDingTalkSession = (code, type) => {
  return newFly.get(getdingtalksession, {
    code,
    type
  }, {
    definedUrl: getdingtalksession
  })
}

// 获取字典
export const requestDiscByType = (data) => {
  return request.get(getdictbytype, data, {
    definedUrl: getdictbytype
  })
}

// 获取订单列表
export const requestWillOrderList = (data) => {
  return request.get(willorderlist, data, {
    definedUrl: willorderlist
  })
}

// 获取订单详情
export const requestWillOrderDetail = (data) => {
  return request.get(willorderdetail, data, {
    definedUrl: willorderdetail
  })
}

// 获取合作保险机构列表
export const getLandedInsuranceList = (data) => {
  return request.get(landedinsurancelist, data, {
    definedUrl: landedinsurancelist
  })
}

// 获取放款节点列表
export const getLoanNodeList = (data) => {
  return request.get(loannodelist, data, {
    definedUrl: loannodelist
  })
}

// 操作意向单 包括终止
export const requestOperaOrderBusiness = (data) => {
  const defineError = data.defineError
  data.defineError = undefined
  delete data.defineError
  return request.post(operationorder, data, {
    definedUrl: operationorder,
    defineError: defineError
  })
}

// 请求城市列表
export const requestCityList = (data) => {
  return request.get(getallarealist, data, {
    definedUrl: getallarealist
  })
}

// 请求楼盘列表
export const requestProjectList = (data) => {
  return request.get(projectlist, data, {
    definedUrl: projectlist
  })
}

export const requestBuildingInfo = (data) => {
  return request.get(buildinglist, data, {
    definedUrl: buildinglist
  })
}

export const requestFloorInfo = (data) => {
  return request.get(floorlist, data, {
    definedUrl: floorlist
  })
}

export const requestFamilyNoInfo = (data) => {
  return request.get(houselist, data, {
    definedUrl: houselist
  })
}

export const requestOrgList = (data) => {
  return request.get(orglist, data, {
    definedUrl: orglist
  })
}

// 上传图片
export const uploadImage = (data) => {
  return request.post(UPLOAD_IMAGE, data, {
    definedUrl: UPLOAD_IMAGE
  })
}

// 删除图片
export const deleteImage = (data) => {
  return request.post(DELETE_IMAGE, data, {
    definedUrl: DELETE_IMAGE
  })
}

// 更新图片
export const updateImage = (data) => {
  return request.post(UPDATE_IMAGE, data, {
    definedUrl: UPDATE_IMAGE
  })
}

// 获取预约地点列表
export const getAppointmentPlaces = (data) => {
  return request.get(GET_APPOINT_PLACE, data, {
    definedUrl: GET_APPOINT_PLACE
  })
}

// 终止订单
export const endBusiness = (data) => {
  return request.post(END_BUSINESS, data, {
    definedUrl: END_BUSINESS
  })
}

// 获取贷款银行列表
export const getLoanBankList = (data) => {
  return request.get(GET_LOAN_BANK_LIST, data, {
    definedUrl: GET_LOAN_BANK_LIST
  })
}

// 获取贷款银行产品列表
export const getLoanProductList = (data) => {
  return request.get(GET_LOAN_PRODUCT_LIST, data, {
    definedUrl: GET_LOAN_PRODUCT_LIST
  })
}

// 更新订单状态
export const updateOrderStatus = (data) => {
  return request.post(UPDATE_ORDER_STATUS, data, {
    definedUrl: UPDATE_ORDER_STATUS
  })
}
