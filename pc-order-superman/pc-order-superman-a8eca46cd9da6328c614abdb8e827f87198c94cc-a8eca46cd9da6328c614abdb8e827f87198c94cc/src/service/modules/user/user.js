/**
 * function: user
 * author  : wq
 * update  : 2018/9/18 16:41
 */
import request from '../../api'
import { Login, UserInfo } from './defined'

// 登录
export const loginByUsername = (username, password) => {
  const data = {
    username,
    password
  }
  return request.post(Login, data, {
    definedUrl: Login
  })
}

// 登出
export const logout = (username, password) => {
  const data = {
    username,
    password
  }
  return request.post(Login, data)
}

// 通过Token获取用户信息
export const getUserInfo = (token) => {
  const data = {
    token
  }
  return request.post(UserInfo, data, {
    definedUrl: UserInfo
  })
}
