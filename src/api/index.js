import axios from '../libs/http'

export function statBaseInfo() {
  return axios.get(`/customer/statBaseInfo`)
}

export function getNotice(data) {
  return axios.post(`/customer/notices`,data)
}

export function getEcologyUserByWorkCode(workCode) {
  return axios.get(`/ecology-user/getEcologyUserByWorkCode/${workCode}`)
}

export function getBusinessUnit() {
  return axios.get(`/customer/base-info/getBusinessUnit`)
}