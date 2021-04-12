import axios from '../libs/http'
import { apiAgent } from '../config'

export function wxSignature(url) { // 微信签名
  return axios.get(`/createJsapiSignature?agent=${apiAgent}&url=${url}`)
}

export function currentUser() { // 获取微信用户
  return axios.get(`/user/getCurrentUser?agent=${apiAgent}`)
}

export function currentUserByUserId(userId) { // 获取微信用户
  return axios.get(`/user/getCurrentUserByUserId?agent=${apiAgent}&userId=${userId}`)
}

export function deptById(deptId) { // 获取微信用户的部门
  return axios.get(`/dept/getDeptById?agent=${apiAgent}&deptId=${deptId}`)
}

export function getByMobile(mobile) {
  return axios.put(`/user/getByMobile`,  {mobile})
}