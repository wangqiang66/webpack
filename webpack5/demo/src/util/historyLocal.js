const historyList = []
let historyLength = 0
let isBack = false

export const addHistoryItem = (path) => {
  historyList.push(path)
}

export const getHistoryList = () => {
  return historyList
}

export const popLastHistoryItem = () => {
  historyList.splice(-1, 1)
}

export const setHistoryLength = (len) => {
  historyLength = len
}

export const getHistoryLength = () => {
  return historyLength
}

export const setIsBack = (_isBack) => {
  isBack = _isBack
}

export const getIsBack = () => {
  return isBack
}
