/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import * as types from '../types'

const state = {
  toastState: {
    showFlag: false,
    type: 'success',
    title: '消息提示'
  },
  navCollapse: false,
  tabRouteMode: false
}

const actions = {
  showToast ({commit}, status) {
    commit(types.FRAME_SHOW_TOAST, status)
  },
  hideToast ({commit}) {
    commit(types.FRAME_HIDE_TOAST)
  },
  toggleNav ({commit}) {
    commit(types.FRAME_TOGGLE_NAV)
  },
  activeTabRouteMode ({commit}) {
    commit(types.FRAME_ACTIVE_TABROUTE)
  },
  deactiveTabRouteMode ({commit}) {
    commit(types.FRAME_DEACTIVE_TABROUTE)
  }
}

const getters = {
  toastState: state => state.toastState,
  navCollapse: state => state.navCollapse,
  tabRouteMode: state => state.tabRouteMode
}

const mutations = {
  [types.FRAME_SHOW_TOAST] (state, status) {
    status.showFlag = true
    status.title = status.title || ''
    state.toastState = status
  },
  [types.FRAME_HIDE_TOAST] (state) {
    state.toastState.showFlag = false
  },
  [types.FRAME_TOGGLE_NAV] (state) {
    state.navCollapse = !state.navCollapse
  },
  [types.FRAME_ACTIVE_TABROUTE] (state) {
    state.tabRouteMode = true
  },
  [types.FRAME_DEACTIVE_TABROUTE] (state) {
    state.tabRouteMode = false
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
