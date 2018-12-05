/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import * as types from '../types'

const state = {
  tabs: [{
    tabName: 'IndexPage',
    tabTitle: '首页',
    componentName: 'IndexPage',
    query: undefined
  }],
  activeTabName: 'IndexPage'
}

const actions = {
  addTab ({commit}, status) {
    commit(types.TABMNG_ADD_TAB, status)
  },
  removeTab ({commit}, status) {
    commit(types.TABMNG_REMOVE_TAB, status)
  },
  activeTab ({commit}, status) {
    commit(types.TABMNG_ACTIVE_TAB, status)
  },
  replaceCurtab ({commit}, status) {
    commit(types.TABMNG_REPLACE_CURTAB, status)
  },
  resetTabs ({commit}) {
    commit(types.TABMNG_RESET_TABS)
  },
  /** Rena 添加替换兄弟 replaceSibTab 2017-10-13**/
  replaceSibTab ({commit}, status) {
    commit(types.TABMNG_REPLACE_SIBTAB, status)
  }
}

const getters = {
  tabs: state => state.tabs,
  activeTabName: state => state.activeTabName
}

const mutations = {
  [types.TABMNG_ADD_TAB] (state, status) {
    let tabs = state.tabs
    let targetName = status.tabObj.tabName
    let tabNameArr = []
    if (tabs.length >= 11) {
      state.tabs.splice(1, 1)
    }
    // lina.zhang 20180516 修复同级组件中，重复创建tab的bug（驾驶舱中bi报表，多次点击同一个被会打开多张）
    tabs.push(status.tabObj)
    tabs.forEach((tab, index) => {
      if (tabNameArr.indexOf(targetName) > 0) {
        state.activeTabName = targetName
        tabNameArr.splice(tabNameArr.indexOf(targetName), 1)
        tabs.splice(tabNameArr.indexOf(targetName), 1)
      } else {
        tabNameArr.push(tab.tabName)
      }
    })
    state.activeTabName = status.tabObj.tabName
  },
  [types.TABMNG_REMOVE_TAB] (state, status) {
    let tabs = state.tabs
    let activeName = state.activeTabName
    let targetName = status.tabName
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.tabName === targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.tabName
          }
        }
      })
    }
    state.activeTabName = activeName
    state.tabs = tabs.filter(tab => tab.tabName !== targetName)
  },
  [types.TABMNG_ACTIVE_TAB] (state, status) {
    state.activeTabName = status.tabName
  },
  [types.TABMNG_REPLACE_CURTAB] (state, status) {
    let tabs = state.tabs
    let activeName = state.activeTabName
    // let index = tabs.indexOf(activeName)
    let indexCurrent
    tabs.forEach((tab, index) => {
      if (tab.tabName === activeName) {
        indexCurrent = index
      }
    })
    state.tabs.splice(indexCurrent, 1, status.tabObj)
    state.activeTabName = status.tabObj.tabName
  },
  [types.TABMNG_RESET_TABS] (state) {
    state.tabs = [{
      tabName: 'IndexPage',
      tabTitle: '首页',
      componentName: 'IndexPage',
      query: undefined
    }]
    state.activeTabName = 'IndexPage'
  },
  [types.TABMNG_REPLACE_SIBTAB] (state, status) {
    let tabs = state.tabs
    let activeName = status.tabObj.componentName
    let indexCurrent
    tabs.forEach((tab, index) => {
      if (tab.componentName === activeName) {
        indexCurrent = index
      }
    })
    state.tabs.splice(indexCurrent, 1, status.tabObj)
    state.activeTabName = status.tabObj.tabName
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
