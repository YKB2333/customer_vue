import axios from '../libs/http'

export function getBaseInfosByBusiness(params) {
  return axios.post(`/customer/base-info/getBaseInfosByBusiness`,params)
}
export function getCoopGoods(params) {
  return axios.post(`/customer/base-info/getCoopGoodsByBusiness`,params)
}