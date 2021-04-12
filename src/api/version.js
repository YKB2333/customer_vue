import axios from '../libs/http'

//版本历史
export function getVersion(data) {
  return axios.post(`/version/customer/page`, data)
}

//三大中心-应用版本信息详情查询接口
export function getLatestVersion() {
  return axios.get(`/version/customer/get`)
}

//三大中心-应用版本信息详情查看接口
export function putLatestVersion(data) {
  return axios.put(`/version/customer/submit`, data)
}