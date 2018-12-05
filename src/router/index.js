import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/Login'
import Tabs from '@/AppTab'

import store from '../vuex/store'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Tabs',
      name: 'Tabs',
      component: Tabs
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Tabs') {
    store.dispatch('activeTabRouteMode')
  } else {
    store.dispatch('deactiveTabRouteMode')
  }

  let token = sessionStorage.getItem('userCode')
  if (!token && to.name !== 'Login') {
    return next({ path: '/' })
  }
  next()
})

export default router
