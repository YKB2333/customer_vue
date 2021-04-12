import { wxSignature } from '../../api/user'
import { weixin, projectKey } from '../../config'

export default {
  state: {
    token: sessionStorage.getItem(`${projectKey}token`) || '',
    jumpUrl: localStorage.getItem(`${projectKey}jumpUrl`) || '',
    // 拜访任务-已完成的sku
    completeTaskSkuIds: sessionStorage.getItem(`${projectKey}completeTaskSkuIds`) || [],
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    userDepart: JSON.parse(localStorage.getItem('userDepart')) || null,

  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      sessionStorage.setItem(`${projectKey}token`, token);
    },
    SET_JUMPURL(state, jumpUrl) {
      state.jumpUrl = jumpUrl;
      localStorage.setItem(`${projectKey}jumpUrl`, jumpUrl);
    },
    SAVE_COMPLETE_TASK_SKU(state, { type = 'add', skuId }) {
      if (type === 'init') {
        state.completeTaskSkuIds = skuId
      } else {
        let i = state.completeTaskSkuIds.findIndex(id => id === skuId)
        if (type === 'add') {
          if (i < 0) {
            state.completeTaskSkuIds.push(skuId)
          }
        } else if (type === 'delete') {
          if (i >= 0) {
            state.completeTaskSkuIds.splice(i, 1)
          }
        }
      }
      sessionStorage.setItem(`${projectKey}completeTaskSkuIds`, state.completeTaskSkuIds)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    SET_USER_DEPART(state, userDepart) {
      state.userDepart = userDepart
      localStorage.setItem('userDepart', JSON.stringify(userDepart))
    }

  },
  actions: {
    weixinConfig({ commit }, url) {
      return new Promise((resolve, reject) => {
        wxSignature(url).then(data => {
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: weixin.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: weixin.jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}