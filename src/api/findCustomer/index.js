import axios from '@/libs/http'
import { apiAgent } from '@/config'

export function getCustomerList(data) {
  return axios.post(`/customer/base-info/findAll`, data)
}

export function getCustomerInfo(id) {
  return axios.get(`/customer/base-info/getBaseInfoById/${id}`)
}

export function getChannelList() {
  return axios.get(`/nc-base-info/channel`)
}

export function getAchievement(data) {
  return axios.post(`/customer/find/achievement`, data)
}

export function getSalesRank(data) {
  return axios.post(`/customer/find/count/salesRank`, data)
}

export function getChannelCount(data) {
  return axios.post(`/customer/find/count/channel`, data)
}

export function getChannelGrowth(data) {
  return axios.post(`/customer/find/count/channelGrowth`, data)
}

export function getCustomerGrowth(data) {
  return axios.post(`/customer/find/count/customerGrowth`, data)
}

export function getCustomerCount(data) {
  return axios.post(`/customer/find/count/customer`, data)
}

export function getOrgCount(data) {
  return axios.post(`/customer/find/count/org`, data)
}

export function getBrandCategoryCount(data) {
  return axios.post(`/customer/find/count/brandCategory`, data)
}

export function getCategoryCount(data) {
  return axios.post(`/customer/find/count/category`, data)
}

export function getBrandCount(data) {
  return axios.post(`/customer/find/count/brand`, data)
}

export function getSkuCount(data) {
  return axios.post(`/customer/find/count/sku`, data)
}

export function getInfoPage(data) {
  return axios.post(`/customer/info/selectPage?agent=${apiAgent}`, data)
}

export function getInfoDetails(id) {
  return axios.get(`/customer/info/getOne/${id}?agent=${apiAgent}`)
}

export function addClickInfo(id) {
  return axios.put(`/customer/info/addClick/${id}`)
}

export function addFavorite(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/customer/info/favorite`, params)
}

export function cancelFavorite(id) {
  return axios.put(`/customer/info/favorite/cancel/${id}?agent=${apiAgent}`)
}

export function addLike(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/customer/info/like`, params)
}

export function cancelLike(id) {
  return axios.put(`/customer/info/like/cancel/${id}?agent=${apiAgent}`)
}

// 发现客户首页—获取我的业务
export function getMyBusiness(cancelToken) {
  return axios.get(`/customer/find/myBusiness`, { cancelToken })
}
// 发现客户首页 -销售趋势
export function getConuntSale(data, cancelToken) {
  return axios.post(`/customer/find/count/sale`, data, { cancelToken })
}

// 发现客户首页-业务部销售占比
export function getBusinessSale(data) {
  let url = `/customer/find/count/businessSale?year=${data.year}`
  return axios.get(_changeYMD(url, data))
}
// 发现客户首页- 获取商品服务类型
export function getBrandCategory(cancelToken) {
  return axios.get(`/customer/dict/brandCategory`, { cancelToken })
}

// 发现客户首页- 商品服务类型销售数据统计
export function getCountBrandCategory(data, cancelToken) {
  let url = `/customer/find/count/brandCategory?businessId=${data.id}&brandCategory=${data.brandCategory}&year=${data.year}`
  return axios.get(_changeYMD(url, data), { cancelToken })
}

// 发现客户首页- 商品一级分类销售数据统计
export function getCountCategory(data, cancelToken) {
  let url = `/customer/find/count/category?businessId=${data.id}&top=${data.top}&year=${data.year}`
  return axios.get(_changeYMD(url, data), { cancelToken })
}

// 发现客户首页- skuTop10销售数据统计
export function getCountSkuTop(data, cancelToken) {
  let url = `/customer/find/count/skuTop?top=${data.top}&businessId=${data.id}&year=${data.year}`
  return axios.get(_changeYMD(url, data), { cancelToken })
}

// 发现客户首页- 客户Top10销售数据统计
export function getCustomerTop(data, cancelToken) {
  return axios.post(`/customer/find/count/customerTop`, {
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
    businessId: data.id,
    name: data.name || '',
    year: data.year,
    month: data.month || '',
    day: data.day || '',
    orderStr: data.orderStr || '',
    isActivity: data.isActivity,
  }, { cancelToken })
}

// 发现客户首页- 渠道Top4销售数据统计
export function getChannelTop(data, cancelToken) {
  let url = `/customer/find/count/channelTop?top=${data.top}&businessId=${data.id}&year=${data.year}`
  return axios.get(_changeYMD(url, data), { cancelToken })
}

function _changeYMD(url, data) {
  if (data.month) {
    url += `&month=${data.month}`
  }
  if (data.day) {
    url += `&day=${data.day}`
  }
  return url
}

// 客户销售数据页面- 业务版块筛选条件
export function getConditionList(data) {
  return axios.get(`/customer/find/conditionList?businessId=${data.businessId}&type=${data.type}`)
}


// 客户销售数据页面- 排行榜
export function getCountRank(data) {
  return axios.post(`/customer/find/count/rank`, data)
}

// #region 业绩目标
// 发现客户首页-进度条颜色设置
export function progressBarSettings() {
  return axios.get(`/customer/find/salesTarget/progressBarSettings`)
}

// 
/**
 * 获取业绩目标及目标完成度
 * @param {*} pam 
 * @returns 
 */
export function getSalesTarget(pam, cancelToken) {
  return axios.post(`/customer/find/salesTarget`, pam, { cancelToken })
}
// #endregion 业绩目标
