import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import List from '@/components/List'
import Commit from '@/components/Commit'
import Dub from '@/components/Dub'
import Success from '@/components/Success'
import Fail from '@/components/Fail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,

    },
    {
      path: '/',
      redirect: '/index',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/index',
      name: 'index',
      component: List,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/commit',
      name: 'commit',
      component: Commit,
      meta: {
        requireAuth: true,
      },
    },
    {
      path:'/dub',
      component: Dub,
      meta: {
        requireAuth: true,
      },
    },
    {
      path:'/success',
      component: Success,
      meta: {
        requireAuth: true,
      },
    },
    {
      path:'/fail',
      component: Fail,
      meta: {
        requireAuth: true,
      },
    }
  ]
})
