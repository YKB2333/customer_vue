import axios from '../libs/http'
import { apiAgent } from '../config'

export function customerFavorite(data) { // 获取当前平台下，我的客户收藏分页
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/customer/customerFavorite`, params)
}

//我的客户
export function getMyCustomer(data) {
  console.log(data)
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/customer/myCustomer`, params)
}

//版本历史
export function getVersion(data) {
  return axios.post(`/version/customer/page`, data)
}
