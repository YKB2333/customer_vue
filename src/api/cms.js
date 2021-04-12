import axios from '../libs/http'
import Vue from 'vue'

export function addInfoClick(infoId) { // 增加资讯点击数
  return axios.put(`/cms/info/addClick?id=${infoId}`)
}

export function getInfoByCateId(cateId, data = {}) { // 获取栏目下的资讯列表
  return axios.post(`/cms/info/selectPage`, {
    pageIndex: 1,
    pageSize: Vue.prototype.$maxNumber,
    infoCategoryId: cateId,
    status: '1', // 状态:0待审,1已审,2删除
    orderStr: 'orderLevel desc',
    ...data
  })
}

export function getAttaListByInfoId(infoId) { // 根据资讯ID获取资讯附件
  return axios.get(`/cms/attachment/getByInfoId/${infoId}`)
}

// 查询广告图
export const getAdList = (data) => axios.post(`/cms/advertising-chart/selectPage`, data)

export function selectPage(data) {
  return axios.post(`/cms/info/selectPage`, data)
}

export function getOne(id) {
  return axios.get(`/cms/info/getOne/${id}`)
}

export function getAttaById(id) {
  return axios.get(`/cms/attachment/getByInfoId/${id}`)
}