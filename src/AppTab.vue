<template>
  <div id="app">
    <el-row :span="24" class="bottom" :class="{collapse: navCollapse}">
      <div class="nav-col">
        <div class="logo">
          <img src="../static/images/logo.svg" alt="">
          幸福千万家
        </div>
      	<NavMenuEightLevel :id="id" :is-collapse="navCollapse"></NavMenuEightLevel>
      </div>
      <div class="top-bar">
        <TopBar @changeSystemId="changeSystemId"></TopBar>
      </div>
      <div class="content-col">
        <el-tabs :value="activeTabName" type="card" @tab-remove="removeTab" @tab-click="clickTab" class="app-frame-tabs">
          <el-tab-pane
            v-for="(item, index) in tabs"
            :key="item.tabName"
            :label="item.tabTitle"
            :name="item.tabName"
            :closable="tabComponentMap[item.componentName].closable">
            <component :is="tabComponentMap[item.componentName].component" :query="item.query" :index-active-flg="indexActiveFlg"></component>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-row>
  </div>
</template>

<script>
import TopBar from './components/frame/TopBar.vue'
import NavMenuEightLevel from './components/frame/NavMenuEightLevel.vue'

import IndexPage from '@/components/indexPage/indIndex'

import reportManagerindex from '@/components/system/reportManage/reportManage'
import reportPositiveStore from '@/components/system/positiveStore/positiveStore'
import hospitalManage from '@/components/system/hospitalManage/hospitalManage'
import promoteManagerindex from '@/components/system/promoteManage/reportManage'

import { mapState } from 'vuex'
import store from './vuex/store'

export default {
  components: {
    IndexPage,
    TopBar,
    NavMenuEightLevel,
    reportManagerindex,
    reportPositiveStore,
    promoteManagerindex
  },
  name: 'app',
  data () {
    return {
      // id: JSON.parse(sessionStorage.getItem('tenantComs')).tenantComs[0] ? JSON.parse(sessionStorage.getItem('tenantComs')).tenantComs[0].tenantOrgId : '',
      id: 1003,
      indexActiveFlg: true,
      tabComponentMap: {
        'reportManagerindex': {
          component: reportManagerindex,
          closable: true
        },
        'hospitalManage': {
          component: hospitalManage,
          closable: true
        },
        'reportPositiveStore': {
          component: reportPositiveStore,
          closable: true
        },
        'promoteManagerindex': {
          component: promoteManagerindex,
          closable: true
        },
        'IndexPage': {
          component: IndexPage,
          closable: false
        }
      }
    }
  },
  computed: mapState({
    navCollapse: state => state.frame.navCollapse,
    tabs: state => state.tabsManager.tabs,
    activeTabName: state => state.tabsManager.activeTabName
  }),
  methods: {
    removeTab (targetName) {
      store.dispatch('removeTab', {
        tabName: targetName
      })
    },
    clickTab (tab) {
      localStorage.setItem('openedTabName', tab.name)
      // 激活相应标签页
      store.dispatch('activeTab', {
        tabName: tab.name
      })
    },
    // 获取系统id
    changeSystemId (id) {
      this.id = id
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}
.top-bar {
  top: 0;
  width: 100%;
  height: 60px;
  background: #F7F7F9;
}
.bottom {
  position: relative;
  padding-left: 190px;
  height: 100%;
  transition: padding-left .6s;
}
.bottom.collapse {
  padding-left: 64px;
}
.nav-col {
  position: absolute;
  width: 190px;
  top: 0;
  left: 0;
  background: #f5f5f5;
  height: 100%;
}
.nav-col .logo {
  height: 9rem;
  line-height: 9rem;
  vertical-align: middle;
  width: 100%;
  padding-left: 1.5rem;
  font-size: 1.8rem;
  font-weight: 500
}
.nav-col .logo img {
  vertical-align: middle;
  padding-right: 8px;
}
.content-col {
  width: 100%;
  height: calc(100% - 24px);
}
.collapse .nav-col {
  width: 64px;
}
</style>
