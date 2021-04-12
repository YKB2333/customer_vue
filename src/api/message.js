import axios from '../libs/http'
import { apiAgent } from '../config'

export function noticePage(data) {
  return axios.post(`/customer/msg/noticePage`, data)
}

export function noticeRead(id) {
  return axios.put(`/customer/msg/noticeRead/${id}`)
}

export function myMsgCount(data) {
  data['sysTag'] = apiAgent
  return axios.post(`/customer/msg/myMsgCount`, data)
}

export function myMsgPage(data) {
  return axios.post(`/customer/msg/myMsgPage`, data)
}

export function recMsgPage(data) {
  return axios.post(`/customer/msg/recMsgPage`, data)
}

export function msgAdd(data) {
  return axios.post(`/customer/msg/msgAdd`, data)
}

export function msgDetail(msgId) {
  return axios.get(`/customer/msg/msgDetail/${msgId}?agent=${apiAgent}`)
}

export function replyList(msgId) {
  return axios.get(`/customer/msg/replyList/${msgId}`)
}

export function replyAdd(data) {
  return axios.post(`/customer/msg/replyAdd`, data)
}

export function msgDelete(msgId) {
  return axios.delete(`/customer/msg/msgDelete/${msgId}`)
}

export function replyDelete(replyId) {
  return axios.delete(`/customer/msg/replyDelete/${replyId}`)
}

export function noticeCount(data) {
  data['sysTag'] = apiAgent
  return axios.put(`/customer/msg/noticeCount`, data)
}
