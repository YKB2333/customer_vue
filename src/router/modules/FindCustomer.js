export default [
  {
    path: '/management',
    name: 'Management',
    component: () => import('@/views/FindCustomer/Management'),
    meta: {
      title: '客户管理',
      needCachePages: ['CustomerDetails']
    }
  },
  {
    path: '/customerdetails/:id',
    name: 'CustomerDetails',
    component: () => import('@/views/FindCustomer/CustomerDetails'),
    meta: {
      title: '客户详情',
      needCachePages: [
        'InfoAttaList',
        'coopList',
        'activeDetail',
        'customerSalesData',
      ],
      keepAlive: true
    },
    props: true
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/views/FindCustomer/CustomerDetails/manage'),
    meta: {
      title: '经营状况',
      keepAlive: false
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/FindCustomer/CustomerDetails/shop'),
    meta: {
      title: '客户相关平台/店铺',
      keepAlive: false
    },
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('@/views/FindCustomer/CustomerDetails/agreement'),
    meta: {
      title: '合同管理',
      keepAlive: false
    },
  },
  {
    path: '/competitor',
    name: 'competitor',
    component: () => import('@/views/FindCustomer/CustomerDetails/competitor'),
    meta: {
      title: '竞品分析',
      keepAlive: false
    },
  },
  {
    path: '/salesDataDetails',
    name:'SalesDataDetails',
    component: () => import('@/views/FindCustomer/salesData/details'),
    meta: {
      title: '销售数据详情',
      needCachePages: ['SalesDataDetailsPage', 'SalesDataDetailsAnalysisPage']
    }
  },
  {
    path: '/salesDataDetailsPage',
    name: 'SalesDataDetailsPage',
    component: () => import('@/views/FindCustomer/salesData/detailsPage'),
    meta: {
      title: '销售数据详情列表',
      keepAlive: false
    }
  },
  {
    path: '/salesDataDetailsAnalysisPage',
    name: 'SalesDataDetailsAnalysisPage',
    component: () => import('@/views/FindCustomer/salesData/detailsAnalysisPage'),
    meta: {
      title: '销售数据详情列表',
      keepAlive: false
    }
  },
  {
    path: '/customerbaseinfo/:id',
    name: 'CustomerBaseInfo',
    component: () => import('@/views/FindCustomer/CustomerDetails/BaseInfo'),
    meta: {
      title: '客户基础信息'
    },
    props:true
  },
  {
    path: '/salesExample',
    name: 'salesExample',
    component: () => import('@/views/FindCustomer/salesExample'),
    meta: {
      title: '案例课程',
      keepAlive: true
    }
  },
  {
    path: '/exploitCient',
    name: 'exploitCient',
    component: () => import('@/views/FindCustomer/exploitCient'),
    meta: {
      title: '开发中客户',
      keepAlive: false
    }
  },
  {
    path: '/projectprogress',
    name: 'projectProgress',
    component: () => import('@/views/FindCustomer/projectProgress'),
    meta: {
      title: '核心项目进展',
      keepAlive: false
    }
  },
  {
    path: '/infoAttaList',
    name: 'InfoAttaList',
    component: () => import('@/views/FindCustomer/infoAttaList'),
    meta: {
      title: '附件',
      keepAlive: false
    },
    props: true
  },
  {
    path: '/process',
    name: 'projectIndex',
    component: () => import('@/views/FindCustomer/project-process/index'),
    meta: {
      title: '当前行动进展',
      keepAlive: false
    }
  },
  {
    path: '/project/process',
    name: 'projectProcess',
    component: () => import('@/views/FindCustomer/project-process/Process'),
    meta: {
      title: '项目进展',
      keepAlive: false
    }
  },
  {
    path: '/project/target',
    name: 'projectTarget',
    component: () => import('@/views/FindCustomer/project-process/Target'),
    meta: {
      title: '年度合作战略目标',
      keepAlive: false
    }
  },
  {
    path: '/activeDetail',
    name: 'activeDetail',
    component: () => import('@/views/FindCustomer/activeDetail'),
    meta: {
      title: '活动预告',
      keepAlive: false
    }
  },
  {
    path: '/coopList',
    name: 'coopList',
    component: () => import('@/views/FindCustomer/coopList/index'),
    meta: {
      title: '已合作商品清单',
      keepAlive: false
    }
  },
  {
    path: '/permission',
    name: 'notPermission',
    component: () => import('@/views/FindCustomer/find-customer/notPermission'),
    meta: {
      title: '无权限',
      keepAlive: false
    }
  },
  {
    path: '/customer/sales/data',
    name: 'customerSalesData',
    component: () => import('@/views/FindCustomer/find-customer/customerSalesData'),
    meta: {
      title: '客户销售数据',
      needCachePages: ['SalesDataDetailsAnalysisPage']
    }
  },
  {
    path: '/customer/sales/skuSalesData',
    name: 'skuSalesData',
    component: () => import('@/views/FindCustomer/find-customer/skuSalesData'),
    meta: {
      title: '客户sku销售数据',
    }
  },
  {
    path: '/clientSalesList',
    name: 'clientSalesList',
    component: () => import('@/views/FindCustomer/clientSalesList'),
    meta: {
      title: '客户销售额',
    }
  },
]