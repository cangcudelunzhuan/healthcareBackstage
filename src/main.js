// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
// 导入element的组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入css文件
import './assets/styles/app.css'
import './assets/styles/eluiOverride.css'
import './assets/styles/eluiOverrideZln.css'
import './assets/styles/eluiOverrideWjb.css'
import './assets/styles/family.css'
import './assets/styles/eluiOverrideHSQ.css'
import './assets/styles/eluiOverrideLxl.css'
// 导入iconfont.css
import './assets/iconfont/iconfont.css'
import './assets/iconmenu/iconmenu.css'
import Index from './Index'
import router from './router'
import store from './vuex/store'
import '@/filter'
import htmlToPdf from '@/util/htmlToPdf'
Vue.use(htmlToPdf)
// 引入前端埋点库countly
import Countly from './countly/countly.min.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Index/>',
  components: { Index },
  created () {
    // 挂载前端埋点
    window.Countly = Countly
  }
})
