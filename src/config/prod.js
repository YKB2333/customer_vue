const apiAgent = 'customer'
const baseURL = 'http://goods.yanmiya.com/wx'

module.exports = {
  apiAgent,
  baseURL,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login?agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: false,
  cmsCategoryId: {
    banner: 38, // 轮播
    unDevelopCustomer: 73, // 开发中客户
    saleToolsIndex: 49, // 首页-销售工具
    marketingAct: 41, // 本周重点营销活动
    newCust: 39, // 本月新增核心客户
    onePkg: 40, // 首页-一件代发
    custCase: 42,//客户分享
    custInfo: 43, // 行业资讯
    salesman: 44, //销售荣誉榜
    cooperationAgreement: 45, // 条款模板
    cooperationCust: 46, //合作客户
    flow: 50, // 流程
    findSalesExample: 47, // 销售案例
    findTopBanner: 48, // 发现客户首页 banner
    salesTools: 49, // 销售工具
    saleToolsIndex: 109, // 首页-销售工具
    theme: 108, //主题
    group: 107, //集团
    shop: 138, // 店铺
  },
  otherAppLogin: {
    goods: `http://goods.yanmiya.com/wx/login?agent=goods`,
    supplier: `http://goods.yanmiya.com/wx/login?agent=supplier`
  },
  baiduSiteId:'c7e169404ded9118b8faf5481a16155c'
}