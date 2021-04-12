import axios from '../libs/http'

export function selectPage(data) {
  return axios.post(`/cms/info/selectPage`, data)
}

export function getOne(id) {
  return axios.get(`/cms/info/getOne/${id}`)
}

export function getAttaById(id) {
  return axios.get(`/cms/attachment/getByInfoId/${id}`)
}