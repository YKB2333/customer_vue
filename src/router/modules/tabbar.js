export default [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/tabbar/Home'),
    meta: {
      title: '首页',
      keepAlive: true,
      // needCachePages: [
      //   'GoldSales', 
      //   'CustomerDetails', 
      //   'CoopCustomerList', 
      //   'CoopTempleteDetails', 
      //   'UserOperation', 
      //   'UserOperationList', 
      //   'CaseList', 
      //   'CaseDetails', 
      //   'CustomerInfoDetails', 
      //   'CustomerInfoList',
      //   'EventDetails',
      //   'SalesPromotion',
      //   'OneGeneration'
      // ]
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/tabbar/Message'),
    meta: {
      title: '消息',
      keepAlive: false
    }
  },
  // {
  //   path: '/findCustomer',
  //   // name: 'FindCustomer',
  //   // component: () => import('@/views/tabbar/FindCustomer'),
  //   name: 'SalesData',
  //   component: () => import('@/views/FindCustomer/salesData'),
  //   meta: {
  //     title: '发现客户',
  //     keepAlive: true
  //   }
  // },
  {
    path: '/findCustomer',
    name: 'findCustomer',
    component: () => import('@/views/FindCustomer/find-customer/index.vue'),
    meta: {
      title: '数据看板',
      keepAlive: true,
      needCachePages: [
        'GoldSales', 
        'CustomerDetails', 
        'CoopCustomerList', 
        'CoopTempleteDetails', 
        'UserOperation', 
        'UserOperationList', 
        'CaseList', 
        'CaseDetails', 
        'CustomerInfoDetails', 
        'CustomerInfoList',
        'EventDetails',
        'SalesPromotion',
        'OneGeneration',
        'notPermission',
        'customerSalesData',
        'SalesDataDetailsAnalysisPage',
        'clientSalesList',
      ]
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/tabbar/Category'),
    meta: {
      title: '客户分类',
      keepAlive: true
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/tabbar/Mine'),
    meta: {
      title: '我的',
      keepAlive: true
    }
  }
]
