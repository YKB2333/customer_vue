import axios from '../libs/http'

export function getBrandList() { // 品牌列表
  return axios.get(`/customer/common/brandList`)
}

// export function getBrandInfo(brandId) { // 根据品牌id获取品牌信息
//   return axios.get(`/goods/brand/getOne/${brandId}`)
// }

// export function getAllBrand() { // 获取全部品牌
//   return axios.get(`/goods/brand/getOne/${brandId}`)
// }
// /customer/channel/findAll
// 客户管理中心-客户渠道类型