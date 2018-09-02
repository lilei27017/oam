// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import qs from 'qs'

// import config from '../config'
// let apiHost = config.dev.env.API_HOST
// var instance = axios.create({
//   baseUrl: apiHost,
//   timeout: 8000
// })
// instance.interceptors.request.use(function (config) {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   return config
// }, function (error) {
//   return Promise.reject(error);
// });

//关闭生产模式的提示
Vue.config.productionTip = false

Vue.use(MintUI, VueAxios, axios)

/* eslint-disable no-new */
Vue.prototype.qs = qs
Vue.prototype.axios = axios
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

//
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//     if (localStorage.getItem('WC_token')) {  // 获取当前的token是否存在
//       next();
//     }
//     else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//       console.log(to.fullPath)
//     }
//   }
//   else {
//     next();
//   }
// })

