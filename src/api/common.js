import axios from '../libs/http'
import { apiAgent } from '../config'

export function favoriteCount () { // 获取当前平台下，我的收藏数
  return axios.post(`/customer/favorite/count`, {
    sysTag: apiAgent,
    favoriteType: 'customerCustInfo',
    pageIndex: 1,
    pageSize: 1,
  })
}

export function favoritePage (data) { // 获取当前平台下，我的收藏分页
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/customer/favorite/page`, params)
}

export function likeCount () { // 获取当前平台下，我的点赞数
  return axios.get(`/customer/like/count?agent=${apiAgent}`)
}