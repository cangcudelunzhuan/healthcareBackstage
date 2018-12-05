/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import frame from './modules/frame'
import tabsManager from './modules/tabsManager'
import reportManage from './modules/reportManage'
import promoteManage from './modules/promoteManage'
import basic from './basic'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    frame,
    tabsManager,
    reportManage,
    promoteManage,
    basic
  }
})
