export default [
  {
    path: '/messageIndex',
    name: 'MessageIndex',
    component: () => import('@/views/tabbar/Message'),
    meta: {
      title: '消息',
      keepAlive: false
    }
  },
  {
    path: '/mymessage',
    name: 'MyMessage',
    component: () => import('@/views/message/MyMessage'),
    meta: {
      title: '我的消息',
      needCachePages: ['NewMessage', 'MessageDetail']
    }
  },
  {
    path: '/newmessage',
    name: 'NewMessage',
    component: () => import('@/views/message/NewMessage'),
    meta: {
      title: '发起留言',
      keepAlive: false
    }
  },
  {
    path: '/messageDetail',
    name: 'MessageDetail',
    component: () => import('@/views/message/MessageDetail'),
    meta: {
      title: '留言明细',
      keepAlive: false
    }
  }
]
