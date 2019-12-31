import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'Admin-Token'

export function getToken() {
  try {
    if (store.state.user.token) {
      return store.state.user.token
    }
  } catch (e) {}
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
