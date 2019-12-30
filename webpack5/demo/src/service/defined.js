/**
 * function: defined
 * author  : wq
 * update  : 2018/9/19 9:14
 */
const preUrl = location.origin + '/core'; // core前缀
const preToolsUrl = location.origin + '/tools' // tool前缀
const preBaseUrl = location.origin + '/base'
const preBusinessUrl = location.origin + '/business'

// 根据类型获取字典列表
export const getdictbytype = preUrl + '/api/core/dict/getdictbytype'
// 根据单id获取到订单信息
export const getOrderById = preUrl + ''
// 获取省份列表
export const getprovincelist = preUrl + '/api/core/area/getprovincelist'
// 获取城市列表
export const getcitylist = preUrl + '/api/core/area/getcitylist'
// 获取区域列表
export const getarealist = preUrl + '/api/core/area/getarealist'
// 获取产品列表
export const productlist = preUrl + '/api/core/area/getarealist'
// 获取意向单列表
export const willorderlist = preBusinessUrl + '/api/business/dingtalk/order/list'
// 意向单详情
export const willorderdetail = preBusinessUrl + '/api/business/dingtalk/order/detail'
// 操作意向单
export const operationorder = preBusinessUrl + '/api/business/dingtalk/order/submit'
// 获取配置信息
export const getdingtalkconfig = preUrl + '/api/core/login/getdingtalkconfig'
// 获取会话键值
export const getdingtalksession = preUrl + '/api/core/login/getdingtalksession'
// 获取客户唯一编号
export const getuniqueno = preUrl + '/api/core/common/getuniqueno'
// 获取图片上传权限
export const getuploadauth = preUrl + '/api/core/dingtalkfiles/getuploadauth'
// 从钉钉端下载到影像系统
export const downloadfrom = preUrl + '/api/core/dingtalkfiles/downloadfrom'
// 获取图片从钉钉下载后推送到影像系统的情况
export const downloadstatus = preUrl + '/api/core/dingtalkfiles/downloadstatus'
// 身份证解析
export const idcardidentified = preUrl + '/api/core/dingtalkfiles/idcardidentified'
// 获取全部省市区
export const getallarealist = preUrl + '/api/core/area/getallarealist'
// 获取空间ID
export const getspaceid = preUrl + '/api/core/login/getspaceid'
// 获取原贷款机构列表
export const orglist = preBusinessUrl + '/api/business/source/bpms/mortgageOrgList'
// 获取楼盘列表
export const projectlist = preToolsUrl + '/api/tools/property/projectlist'
// 获取楼栋列表
export const buildinglist = preToolsUrl + '/api/tools/property/buildinglist'
// 获取楼层列表
export const floorlist = preToolsUrl + '/api/tools/property/floorlist'
// 获取房号列表
export const houselist = preToolsUrl + '/api/tools/property/houselist'
// 获取合作保险机构列表
export const landedinsurancelist = preBusinessUrl + '/api/business/source/bpms/landedinsurancelist'
// 查询可选放款节点列表
export const loannodelist = preBusinessUrl + '/api/business/source/bpms/loannodelist'
// 图片上传
export const UPLOAD_IMAGE = preUrl + '/filehandle/file/upload'
// 图片删除
export const DELETE_IMAGE = preUrl + '/filehandle/file/delete'
// 图片更新
export const UPDATE_IMAGE = preUrl + '/filehandle/file/change'
// 获取预约地点列表
export const GET_APPOINT_PLACE = preBusinessUrl + '/api/business/source/bpms/appointSignPlaceList'
// 终止订单
export const END_BUSINESS = preBusinessUrl + '/api/business/dingtalk/order/end'
// 获取贷款银行列表
export const GET_LOAN_BANK_LIST = preBusinessUrl + '/api/business/source/bpms/tfbLandedBankList'
// 获取贷款银行产品列表
export const GET_LOAN_PRODUCT_LIST = preBusinessUrl + '/api/business/tfb/order/orgProduct/list'
// 更新订单状态
export const UPDATE_ORDER_STATUS = preBusinessUrl + '/api/business/dingtalk/order/processStatus/switch'
