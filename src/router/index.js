import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/403',
    name: '403',
    component: () => import('../components/403')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index'),
    children: [{
      path: '/pengzhang',
      name: 'PengZhang',
      component: () => import('../views/pengzhang'),
    },
    {
      path: '/paishui',
      name: 'PaiShui',
      component: () => import('../views/paishui')
    },
    {
      path: '/code',
      name: 'Code',
      component: () => import('../views/code')
    }]
  },
  {
    path: '*',
    component: () => import('../components/404')
  }
  ]
})

export default router;
