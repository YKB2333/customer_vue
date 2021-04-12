import axios from '../libs/http'

export function selectPage(data) {
  return axios.post(`/customer/getOperatePage`, data)
}

export function getOne(id) {
  return axios.get(`/customer/getOperateDetails/${id}`)
}