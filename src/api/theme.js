import axios from '../libs/http'

export function getBaseInfosByChannelTag(params) {
  return axios.post(`/customer/base-info/getBaseInfosByChannelTypeCodeAndTag`,params)
}

export function getChannelListByChannelTag(params) {
  return axios.post(`/customer/base-info/getChannelListByChannelTag`,params)
}

export function getChannelList() {
  return axios.get(`/nc-base-info/channel`)
}
