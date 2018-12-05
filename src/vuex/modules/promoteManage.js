/**
 * Created by Siqi.Huang on 2018/10/19.
 */
import * as types from '../types'

const state = {
  promotePath: 'reportList',
  promoteId: '',
  promoteBaseInfo: null,
  promoteInfo: null,
  promoteType: 'edit'
}

const actions = {
  changePromotePath ({commit}, status) {
    commit(types.PROMOTE_PATH, status)
  },
  changePromoteId ({commit}, status) {
    commit(types.PROMOTE_ID, status)
  },
  changePromoteBaseInfo ({commit}, status) {
    commit(types.PROMOTE_BASE_INFO, status)
  },
  changePromoteInfo ({commit}, status) {
    commit(types.PROMOTE_INFO, status)
  },
  changePromoteType ({commit}, status) {
    commit(types.PROMOTE_TYPE, status)
  }
}

const getters = {
  promotePath: state => state.promotePath,
  promoteId: state => state.promoteId,
  promoteBaseInfo: state => state.promoteBaseInfo,
  promoteInfo: state => state.promoteInfo,
  promoteType: state => state.promoteType
}

const mutations = {
  [types.PROMOTE_PATH] (state, status) {
    state.promotePath = status
  },
  [types.PROMOTE_ID] (state, status) {
    state.promoteId = status
  },
  [types.PROMOTE_BASE_INFO] (state, status) {
    state.promoteBaseInfo = status
  },
  [types.PROMOTE_INFO] (state, status) {
    state.promoteInfo = status
  },
  [types.PROMOTE_TYPE] (state, status) {
    state.promoteType = status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
