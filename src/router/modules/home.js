export default [
  {
    path: '/salespromotion',
    name: 'SalesPromotion',
    component: () => import('@/views/Home/salesPromotion'),
    meta: {
      title: '重点营销活动',
      needCachePages: ['EventDetails']
    }
  },
  {
    path: '/eventdetails',
    name: 'EventDetails',
    component: () => import('@/views/Home/eventDetails'),
    meta: {
      title: '营销活动详情',
      keepAlive: false
    }
  },
  {
    path: '/goldsales',
    name: 'GoldSales',
    component: () => import('@/views/Home/goldSales'),
    meta: {
      title: '销售荣誉榜',
      keepAlive: false
    }
  },
  {
    path: '/latestsales',
    name: 'LatestSales',
    component: () => import('@/views/Home/LatestSales'),
    meta: {
      title: '最新销售情况播报',
      keepAlive: true
    }
  },
  {
    path: '/onegeneration',
    name: 'OneGeneration',
    component: () => import('@/views/Home/oneGeneration'),
    meta: {
      title: '一件代发',
      keepAlive: true,
      needCachePages: ['OneGenerationDetails']
    }
  },
  {
    path: '/oneGenerationDetails',
    name: 'OneGenerationDetails',
    component: () => import('@/views/Home/oneGenerationDetails'),
    meta: {
      title: '一件代发',
      keepAlive: false
    }
  },
  {
    path: '/caseList',
    name: 'CaseList',
    component: () => import('@/views/Home/caseList'),
    meta: {
      title: '客户案例分享',
      keepAlive: true,
      needCachePages: ['CaseDetails']
    }
  },
  {
    path: '/casedetails',
    name: 'CaseDetails',
    component: () => import('@/views/Home/caseDetails'),
    meta: {
      title: '客户案例分享',
      keepAlive: false
    }
  },
  {
    path: '/customerInfoList',
    name: 'CustomerInfoList',
    component: () => import('@/views/Home/customerInfoList'),
    meta: {
      title: '行业资讯',
      keepAlive: true,
      needCachePages: ['CustomerInfoDetails']
    }
  },
  {
    path: '/customerInfoDetails',
    name: 'CustomerInfoDetails',
    component: () => import('@/views/Home/customerInfoDetails'),
    meta: {
      title: '行业资讯',
      keepAlive: false
    }
  },
  {
    path: '/useroperation',
    name: 'UserOperation',
    component: () => import('@/views/Home/userOperation'),
    meta: {
      title: '客户运营方式详情',
      keepAlive: false
    }
  },
  {
    path: '/userOperationList',
    name: 'UserOperationList',
    component: () => import('@/views/Home/userOperationList'),
    meta: {
      title: '客户运营方式分享',
      keepAlive: true,
      needCachePages: ['UserOperation']
    }
  },
  {
    path: '/coopTempleteDetails',
    name: 'CoopTempleteDetails',
    component: () => import('@/views/Home/coopTempleteDetails'),
    meta: {
      title: '客户条款',
      keepAlive: false
    }
  },
  {
    path: '/coopCustomerList',
    name: 'CoopCustomerList',
    component: () => import('@/views/Home/coopCustomerList'),
    meta: {
      title: '合作客户',
      keepAlive: true
    }
  },
  {
    path: '/developCustomer',
    name:'DevelopCustomer',
    component: () => import('@/views/Home/DevelopCustomer'),
    meta: {
      title: '新客户开发'
    }
  },
  {
    path: '/saleTools',
    name:'SaleTools',
    component: () => import('@/views/Home/SaleTools'),
    meta: {
      title: '销售工具'
    }
  },
  {
    path: '/provisionsTemplate',
    name:'ProvisionsTemplate',
    component: () => import('@/views/Home/ProvisionsTemplate'),
    meta: {
      title: '条款模板'
    }
  },
  {
    path: '/group',
    name:'group',
    component: () => import('@/views/Home/group'),
    meta: {
      title: '集团介绍'
    }
  },
  {
    path: '/theme',
    name:'theme',
    component: () => import('@/views/Home/theme'),
    meta: {
      title: '主题推荐'
    }
  },
  {
    path: '/tabs',
    name:'tabs',
    component: () => import('@/views/Home/tabs'),
    meta: {
      title:'客户管理',
      needCachePages: ['CustomerDetails']
    }
  },
  {
    path: '/bigThing',
    name:'bigThing',
    component: () => import('@/views/Home/bigThing'),
    meta: {
      title:'部门大事件'
    }
  },
  {
    path: '/store-list',
    name:'StoreList',
    component: () => import('@/views/Home/storeList'),
    meta: {
      title:'在营品牌店铺'
    }
  },
]
