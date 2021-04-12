import axios from '@/libs/http'
import { apiAgent } from '@/config'

export function getCustomerList (data) {
  return axios.post(`/customer/base-info/findAll`,data)
}

export function getCustomerInfoById (id) {
  return axios.get(`/customer/base-info/getBaseInfoById/${id}`)
}

export function getSkuRank(data) {
  return axios.post(`/customer/base-info/getSkuRank`, data)
}

export function getWeekSalesByCsCode(code) {
  return axios.get(`/customer/base-info/getWeekSales/${code}`)
}

export function getMonthSales(code) {
  return axios.get(`/customer/base-info/getMonthSales/${code}`)
}

export function getCoopGoodsCountByBrandCategory(id) {
  return axios.get(`/customer/base-info/getCoopGoodsCountByBrandCategory/${id}`)
}

export function getCoopGoods(data) {
  return axios.post(`/customer/base-info/getCoopGoods`, data)
}

export function getActivityPage(data) {
  return axios.post(`/customer/base-info/getActivityPage`, data)
}

export function getActivityDetailsById(id) {
  return axios.get(`/customer/base-info/getActivityDetails/${id}`)
}

//客户活动商品
export function getActivityGoodsPage(data) {
  return axios.post(`/customer/base-info/getActivityGoodsPage`,data)
}

export function getProductNewsPage(data) {
  return axios.post(`/customer/base-info/getProductNewsPage`, data)
}

export function getProjectPage(data) {
  return axios.post(`/customer/base-info/getProjectPage`, data)
}

export function getProjectDetailsById(id) {
  return axios.get(`/customer/base-info/getProjectDetails/${id}`)
}

export function getOperatePage(data) {
  return axios.post(`/customer/base-info/getOperatePage`, data)
}

export function getOperateDetailsById(id) {
  return axios.get(`/customer/base-info/getOperateDetails/${id}`)
}

export function getMonthTopSales(data) {
  return axios.post(`/customer/base-info/getMonthTopSales`, data)
}

export function getCoreSupplierAnalyze(id) { //竞品分析
  return axios.post(`/customer/base-info/getCoreSupplierAnalyze/${id}`)
}

export function getSupplierEvaluaterAtta(id) { //竞品分析附件
  return axios.post(`/customer/base-info/getSupplierEvaluaterAtta/${id}`)
}

export function getContractInfo(id) { //竞品分析附件
  return axios.post(`/customer/base-info/getContractInfo/${id}`)
}

export function getOperationgStatusInfo(id) { //经营状况
  return axios.post(`/customer/base-info/getOperationgStatusInfo/${id}`)
}

export function getShopInfo(id) { //店铺信息
  return axios.post(`/customer/base-info/getShopInfoById/${id}`)
}

export function getYearTarget(id) { //年度战略目标
  return axios.post(`/customer/base-info/getYearTarget/${id}`)
}

export function getActionInfo(id) { //根据年度战略目标get行动计划
  return axios.post(`/customer/base-info/getActionInfo/${id}`)
}

export function getProjectSpead(id) { //根据行动计划get项目进度列表
  return axios.post(`/customer/base-info/getProjectSpead/${id}`)
}
