
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '客户中心',
  projectKey: 'customer_',
  // 请求头部里携带的token字段名
  headersTokenKey: 'Authorization',
  // http请求超时
  timeout: 60 * 1000,
  weixin: {
    debug: false, // 微信调试模式
    // 微信需要使用的JS接口列表
    jsApiList: ['previewImage', 'previewFile','openEnterpriseChat', 'onHistoryBack', 'closeWindow', 'selectEnterpriseContact', 'onMenuShareAppMessage', 'hideMenuItems', 'showOptionMenu', 'hideOptionMenu'],
  },
  serviceMan:[
    {
      value: '倪俊',
      label: 'qy019cad70a4e2e0b29b6cc47626'
    }
  ],
  brandCategoryList: [
    {
      type: '1',
      name: '代理品牌'
    },
    {
      type: '2',
      name: '代工品牌'
    },
    {
      type: '3',
      name: '自有品牌'
    },
    {
      type: '4',
      name: '合资品牌'
    }
  ],
  imageZoom: '?x-oss-process=style/zoom',
  reportManager:['13826230584'],
}