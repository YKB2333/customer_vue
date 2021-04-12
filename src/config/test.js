
const apiAgent = 'customer'
const baseURL = 'http://khtest.yanmiya.com:8084/wx'

module.exports = {
  apiAgent,
  baseURL,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login?agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: true,
  // 后门token
  testToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoiQ29tcHV0ZXIiLCJjdXJyZW50VGltZU1pbGxpcyI6IjE2MDMwMDkyNTczMzgiLCJpc0FkbWluIjoiZmFsc2UiLCJleHAiOjE2MDMwMTUyNTcsImFjY291bnQiOiIzNTYxNTI1NTg2ODM0MzA5MTIifQ.cph2W9FeEdFAF7tTrea8lyi1S3knPPU_lFS9QaY9kNs',
  cmsCategoryId: {
    banner: 17, // 轮播
    unDevelopCustomer: 90, // 新客户开发
    marketingAct: 20, // 重点营销活动
    newCust: 18, // 本月新增核心客户
    onePkg: 19, // 首页-一件代发
    custCase: 42,//客户分享
    custInfo: 22, // 行业资讯
    salesman: 23, //销售荣誉榜
    cooperationAgreement: 24, // 条款模板
    cooperationCust: 25, //合作客户
    flow: 59, // 流程
    findSalesExample: 55, // 销售案例
    findTopBanner: 60, // 发现客户首页 banner
    salesTools: 91, // 发现客户-销售工具
    saleToolsIndex: 91, // 首页-销售工具
    theme: 128, //主题
    group: 129, //集团
    shop: 160, // 店铺
  },
  otherAppLogin: {
    goods: `http://sptest.yanmiya.com:8084/wx/login?agent=goods`,
    supplier: `http://sptest.yanmiya.com:8084/wx/login?agent=supplier`
  },
  baiduSiteId:'3932a129d1010221119d1bb483903510'
}