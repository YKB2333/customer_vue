import axios from '../libs/http'

// 根据渠道类型编码获取客户列表
export function getNcChannel() {
  // return axios.post(`/customer/base-info/getBaseInfosByChannelTypeCode`,data)
  return axios.get('/nc-base-info/channel')
}

// 根据渠道类型编码获取客户列表
export function getCustomerList(data) {
  return axios.post(`/customer/base-info/selectPage`, data)
}

// /wx/nc-base-info/orgs/closeMethod
// 获取结算方式
export function getCloseMethod() {
  return axios.get(`/nc-base-info/orgs/closeMethod`)
}