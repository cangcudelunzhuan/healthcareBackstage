<template>
  <div class="nav-menu" :class="{collapse: isCollapse}">
    <el-menu theme="dark" :collapse="isCollapse" ref="navMenu" :default-active="'1-0-0'">
      <template v-for="(nav1, index1) in navMenu">
        <el-submenu :index="'1-' + index1" :key="nav1.id"  class="custom-submenu" v-if="nav1.hasLeaf">
          <template slot="title">
            <el-menu-item :index="'1-' + index1 + '-0'" @click="navClick(nav1)" >
              <i class="iconfont" :class="nav1.iconClass"></i>
              <span slot="title">{{ nav1.title }}</span>
            </el-menu-item>
          </template>

          <template v-for="(nav2, index2) in nav1.children">
            <el-submenu :index="'2-' + index2" :key="nav2.id" class="custom-submenu" v-if="nav2.hasLeaf">
              <template slot="title">
                <el-menu-item :index="'2-' + index2 + '-0'" @click="navClick(nav2)">
                  <i :class="nav2.iconClass"></i>
                  <span slot="title">{{ nav2.title }}</span>
                </el-menu-item>
              </template>

              <template v-for="(nav3, index3) in nav2.children">
                <el-submenu :index="'3-' + index3" :key="nav3.id" class="custom-submenu" v-if="nav3.hasLeaf">
                  <template slot="title">
                    <el-menu-item :index="'3-' +index3 + '-0'" @click="navClick(nav3)">
                      <i :class="nav3.iconClass"></i>
                      <span slot="title">{{ nav3.title }}</span>
                    </el-menu-item>
                  </template>

                  <template v-for="(nav4, index4) in nav3.children">
                    <el-submenu :index="'4-' + index4" :key="nav4.id" class="custom-submenu" v-if="nav4.hasLeaf">
                      <template slot="title">
                        <el-menu-item :index="'4-' +index4 + '-0'" @click="navClick(nav4)">
                          <i :class="nav4.iconClass"></i>
                          <span slot="title">{{ nav4.title }}</span>
                        </el-menu-item>
                      </template>

                      <template v-for="(nav5, index5) in nav4.children">
                        <el-submenu :index="'5-' + index5" :key="nav5.id" class="custom-submenu" v-if="nav5.hasLeaf">
                          <template slot="title">
                            <el-menu-item :index="'5-' +index5 + '-0'" @click="navClick(nav5)">
                              <i :class="nav5.iconClass"></i>
                              <span slot="title">{{ nav5.title }}</span>
                            </el-menu-item>
                          </template>

                          <template v-for="(nav6, index6) in nav5.children">
                            <el-submenu :index="'6-' + index6" :key="nav6.id" class="custom-submenu" v-if="nav6.hasLeaf">
                              <template slot="title">
                                <el-menu-item :index="'6-' +index6 + '-0'" @click="navClick(nav6)">
                                  <i :class="nav6.iconClass"></i>
                                  <span slot="title">{{ nav6.title }}</span>
                                </el-menu-item>
                              </template>

                              <template v-for="(nav7, index7) in nav6.children">
                                <el-submenu :index="'7-' + index7" :key="nav7.id" class="custom-submenu" v-if="nav7.hasLeaf">
                                  <template slot="title">
                                    <el-menu-item :index="'7-' +index7 + '-0'" @click="navClick(nav7)">
                                      <i :class="nav7.iconClass"></i>
                                      <span slot="title">{{ nav7.title }}</span>
                                    </el-menu-item>
                                  </template>

                                  <template v-for="(nav8, index8) in nav7.children">
                                    <el-submenu :index="'8-' + index8" :key="nav8.id" class="custom-submenu" v-if="nav8.hasLeaf">
                                      <template slot="title">
                                        <el-menu-item :index="'8-' +index8 + '-0'" @click="navClick(nav8)">
                                          <i :class="nav8.iconClass"></i>
                                          <span slot="title">{{ nav8.title }}</span>
                                        </el-menu-item>
                                      </template>

                                    </el-submenu>
                                    <el-menu-item :index="'8-' + index8" :key="nav8.id" @click="navClick(nav8)" v-else>
                                      <i :class="nav8.iconClass"></i>
                                      <span slot="title">{{ nav8.title }}</span>
                                    </el-menu-item>
                                  </template>

                                </el-submenu>
                                <el-menu-item :index="'7-' + index7" :key="nav7.id" @click="navClick(nav7)" v-else>
                                  <i :class="nav7.iconClass"></i>
                                  <span slot="title">{{ nav7.title }}</span>
                                </el-menu-item>
                              </template>

                            </el-submenu>
                            <el-menu-item :index="'6-' + index6" :key="nav6.id" @click="navClick(nav6)" v-else>
                              <i :class="nav6.iconClass"></i>
                              <span slot="title">{{ nav6.title }}</span>
                            </el-menu-item>
                          </template>

                        </el-submenu>
                        <el-menu-item :index="'5-' + index5" :key="nav5.id" @click="navClick(nav5)" v-else>
                          <i :class="nav5.iconClass"></i>
                          <span slot="title">{{ nav5.title }}</span>
                        </el-menu-item>
                      </template>

                    </el-submenu>
                    <el-menu-item :index="'4-' + index4" :key="nav4.id" @click="navClick(nav4)" v-else>
                      <i :class="nav4.iconClass"></i>
                      <span slot="title">{{ nav4.title }}</span>
                    </el-menu-item>
                  </template>

                </el-submenu>
                <el-menu-item :index="'3-' + index3" :key="nav3.id" @click="navClick(nav3)" v-else>
                  <i :class="nav3.iconClass"></i>
                  <span slot="title">{{ nav3.title }}</span>
                </el-menu-item>
              </template>

            </el-submenu>
            <el-menu-item :index="'2-' + index2" :key="nav2.id" @click="navClick(nav2)" v-else>
              <i class="iconfont" :class="nav2.iconClass"></i>
              <span slot="title">{{ nav2.title }}</span>
            </el-menu-item>
          </template>

        </el-submenu>
        <el-menu-item :index="'1-' + index1" :key="nav1.id" @click="navClick(nav1)" v-else>
          <i :class="nav1.iconClass"></i>
          <span slot="title">{{ nav1.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import frameApi from '../../fetch/frameApi'
  import * as tool from '../../util/tool'

  import { mapState } from 'vuex'
  import store from '../../vuex/store'

  export default {
    props: ['isCollapse', 'id'],
    data () {
      return {
        navMenu: []
      }
    },
    computed: mapState({
      tabs: state => state.tabsManager.tabs,
      activeTabName: state => state.tabsManager.activeTabName
    }),
    watch: {
      id (newValue, oldValue) {
        frameApi.GetNaveMenu(newValue)
        .then(res => {
          this.navMenu = res.data
        })
      },
      activeTabName (activeTabName) {
        // 点击tab后根据激活的tab页名称，激活相应的左侧导航
        let index
        for (let i = 0; i < this.navMenu.length; i++) {
          if (this.navMenu[i].path.split('/').pop() === activeTabName) {
            index = i
            break
          }
        }
        let navItems = this.$refs.navMenu.$el.querySelectorAll('.el-menu-item')
        for (let i = 0; i < navItems.length; i++) {
          if (i === index) {
            navItems[i].classList.add('is-active')
          } else {
            navItems[i].classList.remove('is-active')
          }
        }
      }
    },
    created () {
      frameApi.GetNaveMenu(this.id)
        .then(res => {
          this.navMenu = res.data
          this.$nextTick(() => {
            if (this.navMenu.length !== 0) {
              // 刷新时保持最后打开的tab，新建时默认打开导航第一个
              let openedTabName = localStorage.getItem('openedTabName')
              if (openedTabName) {
                for (let i = 0; i < this.navMenu.length; i++) {
                  let tabName = this.navMenu[i].path.split('/').pop()
                  if (tabName === openedTabName) {
                    this.navClick(this.navMenu[i])
                    store.dispatch('removeTab', {
                      tabName: 'IndexPage'
                    })
                    break
                  }
                }
              } else {
                this.navClick(this.navMenu[0])
                store.dispatch('removeTab', {
                  tabName: 'IndexPage'
                })
              }
            }
          })
        })
    },
    methods: {
      navClick (nav) {
        if (nav.hasLeaf === true) {
          return
        }
        let tabName
        let tabTitle
        let componentName
        let query
        let action = 'add'
        tabTitle = nav.title
        tabName = nav.path.split('/').pop()
        componentName = tabName
        if (tabName === 'IndexBase' && findTabIndex(this.tabs, 'AddIndexBase') > -1) {
          action = 'active'
          tabName = 'AddIndexBase'
        } else if (findTabIndex(this.tabs, tabName) > -1) {
          action = 'active'
        }
        if (action === 'add') {
          store.dispatch('addTab', {
            tabObj: {
              tabName: tabName,
              tabTitle: tabTitle,
              componentName: componentName,
              query: query
            }
          })
          // 增加前端埋点
          let inf = {
            userId: sessionStorage.getItem('userEmpNo'),
            serviceId: 1003,
            menuName: tabTitle
          }
          tool.accessLog(inf)
        } else {
          store.dispatch('activeTab', {
            tabName: tabName
          })
        }
        localStorage.setItem('openedTabName', tabName)

        function findTabIndex (tabs, tabName) {
          let tabIndex = -1
          tabs.forEach((tab, index) => {
            if (tab.tabName === tabName) {
              tabIndex = index
            }
          })
          return tabIndex
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-menu, .nav-menu>.el-menu {
  height: 100%;
}
.nav-menu>.el-menu {
  overflow-y: auto;
  overflow-x: hidden;
}
.nav-menu.collapse>.el-menu {
  overflow-y: visible;
  overflow-x: visible;
}
.custom-submenu>div>li {
  min-width: 73px;
}
.custom-submenu>div>li:hover {
  background-color: transparent!important;
}
</style>
