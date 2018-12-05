/**
 * Created by Siqi.Huang on 2018/10/19.
 */
import * as types from '../types'

const state = {
  reportPath: 'reportList',
  reportId: '',
  typeInType: 'edit'
}

const actions = {
  changeReportPath ({commit}, status) {
    commit(types.REPORT_PATH, status)
  },
  changeReportId ({commit}, status) {
    commit(types.REPORT_ID, status)
  },
  changeTypeInType ({commit}, status) {
    commit(types.TYPEIN_TYPE, status)
  }
}

const getters = {
  reportPath: state => state.reportPath,
  reportId: state => state.reportId,
  typeInType: state => state.typeInType
}

const mutations = {
  [types.REPORT_PATH] (state, status) {
    state.reportPath = status
  },
  [types.REPORT_ID] (state, status) {
    state.reportId = status
  },
  [types.TYPEIN_TYPE] (state, status) {
    state.typeInType = status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
