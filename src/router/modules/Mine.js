export default [
  {
    path: '/mycollection',
    name:'myCollection',
    component: () => import('@/views/Mine/myCollection'),
    meta: {
      title: '我的收藏',
      keepAlive: false
    }
  },
    {
    path: '/myclient',
    name:'myClient',
    component: () => import('@/views/Mine/myClient'),
    meta: {
      title: '我的客户',
      keepAlive: false
    }
  },
  // {
  //   path: '/mylike',
  //   name:'myLike',
  //   component: () => import('@/views/Mine/myLike'),
  //   meta: {
  //     title: '我的点赞',
  //     keepAlive: false
  //   }
  // },
  {
      path: '/flowDetails',
      name:'flowDetails',
      component: () => import('@/views/Mine/flowDetails'),
      meta: {
        title: '',
        keepAlive: false
      }
  },
  {
    path: '/version',
    name: 'Version',
    component: () => import('@/views/Mine/version'),
    meta: {
      title: '版本更新'
    }
  }
]
