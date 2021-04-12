export default [
  {
    path: '/visit-task',
    name: 'VisitTask',
    component: () => import('@/views/visit-customer/visit-task'),
    meta: {
      title: '拜访任务',
      needCachePages: ['VisitTaskDetail', 'VisitTaskForm']
    }
  },
  {
    path: '/visit-task-clock',
    name: 'VisitTaskClock',
    component: () => import('@/views/visit-customer/visit-task-clock'),
    meta: {
      title: '打卡'
    }
  },
  {
    path: '/visit-task-detail',
    name: 'VisitTaskDetail',
    component: () => import('@/views/visit-customer/visit-task-detail'),
    meta: {
      title: '拜访任务详情'
    }
  },
  {
    path: '/visit-task-form',
    name: 'VisitTaskForm',
    component: () => import('@/views/visit-customer/visit-task-form'),
    meta: {
      title: '拜访任务信息',
      needCachePages: ['GoodsInventory']
      // keepAlive: true
    }
  },
  {
    path: '/goods-inventory',
    name: 'GoodsInventory',
    component: () => import('@/views/visit-customer/goods-inventory/index'),
    meta: {
      title: '商品清单'
    }
  }
]
