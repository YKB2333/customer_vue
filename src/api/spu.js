import axios from '../libs/http'
import { apiAgent } from '../config'

export function spuSearch(data,num) { // 搜索spu
  return axios.post(`/customer/cooperation/getCoopGoods/${num}`, data)
}

export function spuSearch4Condition(data) {
  return axios.post(`/customer/cooperation/search4Condition`, data)
}

export function getSpuInfoById(spuId) { // 获取spu信息
  return axios.get(`/goods/spu/getOne/${spuId}`)
}

export function getSkuStockBySpuId(spuId) { // 根据spuId获取sku库存数据
  return axios.get(`/goods/spu/getSkuStockBySpuId/${spuId}`)
}

export function getSpuPager(data) {
  return axios.post(`/goods/spu/getSpuPager`, data)
}

export function getStockData(spuId) {
  return axios.get(`/goods/spu/getSkuStockBySpuId/${spuId}`)
}
//报价下载
export function exportSpu(data) {
  return axios.post(`/goods/spu/exportSpu?agent=${apiAgent}`,data)
}
// 获取报价
export function getReportAttachment(params) {
  return axios.get(`/goods/offerAttachment/getOfferAttachment`,params)
}
//获取销量
export function getSale(params) {
  return axios.post(`/goods/spu/report/orderSale?agent=${apiAgent}`,params)
}
//相似商品
export function getSpuRecommend(spuId,params) {
  return axios.post(`/goods/spu/getSpuRecommend/${spuId}`,params)
}