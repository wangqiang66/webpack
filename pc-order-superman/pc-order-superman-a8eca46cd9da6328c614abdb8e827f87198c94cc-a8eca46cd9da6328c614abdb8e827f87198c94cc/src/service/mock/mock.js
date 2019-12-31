/**
 * function: mock
 * author  : wq
 * update  : 2018/9/18 18:46
 */
import Mock from 'mockjs'
import { Login, UserInfo } from '../defined'

const mockApi = {}
const mockEnvSuccessOrFail = function () {
  const random = Math.random() * 100
  if (random >= 95) {
    return {
      statusCode: 403,
      headers: '',
      responseText: null
    }
  } else {
    return {
      statusCode: 200,
      headers: '',
      responseText: {}
    }
  }
}

const mockProtocolSuccessOrFail = function () {
  const random = Math.random() * 100
  if (random > 90) {
    return {
      code: '2',
      msg: 'error',
      success: false
    }
  } else {
    return {
      code: '200',
      msg: '成功',
      success: true,
      result: {}
    }
  }
}
export const loginByUsername = mockApi[Login] = mockApi[UserInfo] = () => {
  const envRet = mockEnvSuccessOrFail()
  if (envRet.statusCode !== 200) {
    return envRet
  }
  const protocolRet = mockProtocolSuccessOrFail()
  if (!protocolRet.success) {
    envRet.responseText = protocolRet
    return envRet
  }
  protocolRet.result = Mock.mock({
    'userId': '@integer(22)',
    'status': 0,
    'mobile': '135@integer(8)',
    'roles': ['admin'],
    'name': '@cname()',
    'token': '@word(22)'
  })
  envRet.data = protocolRet
  return envRet
}

export default mockApi
