<template>
  <div class="top-bar">
    <el-dropdown class="dropdown" @command="handleCommand">
      <span class="el-dropdown-link">
        <div class="icon arrow-down"><i class="el-icon-arrow-down"></i></div>
        <div class="ico name">{{ userName }}</div>
        <!--<div class="ico admin" :style="{backgroundImage: 'url(static/images/admin.png)'}"></div>-->
        <div class="ico admin" :style="{backgroundImage: 'url(' + userImageUrl + ')'}"></div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="e">
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

  import * as tool from '../../util/tool'
  import { mapState } from 'vuex'
  import store from '../../vuex/store'
  import authApi from '../../fetch/authApi'
//  import frameApi from '../../fetch/frameApi'

  export default {
    data () {
      return {
        userName: '',
        userImageUrl: '',
        system: '',
        sysOptionsMap: {}
      }
    },
    created () {
      this.userName = sessionStorage.getItem('userName')
      this.userImageUrl = sessionStorage.getItem('userImageUrl')
    },
    computed: mapState({
      tabRouteMode: state => state.frame.tabRouteMode
    }),
    methods: {
      toIndexpage () {
        if (this.tabRouteMode) {
          store.dispatch('activeTab', {
            tabName: 'IndexPage'
          })
        } else {
          this.$router.push({
            path: '/App/'
          })
        }
      },
      // 分流下拉菜单的操作
      handleCommand (command) {
        this.exitSystem()
      },
      // 退出
      exitSystem () {
        authApi.LogOut()
          .then(res => {
            tool.toast({
              type: 'success',
              title: '退出成功'
            })
            // 前端埋点，记录登出
            tool.countlyLogout()
            sessionStorage.clear()
            this.$router.push({ path: '/' })
          })
          .catch(() => {
            tool.toast({
              type: 'error',
              title: '登出失败'
            })
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-bar {
  position: relative;
}

.three-lines {
  position: absolute;
  top: 24px;
  left: 18px;
  width: 18px;
  height: 16px;
}

.dropdown {
  position: absolute;
  width: 300px;
  height: 60px;
  padding-right: 25px;
  right: 0;
  top: 0;
  cursor: pointer;
}

.admin {
  width: 36px;
  height: 36px;
  display: block;
  float: right;
  margin-top: 11px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.arrow-down {
  width: 8px;
  height: 6px;
  display: block;
  float: right;
  margin-top: 22px;
  color: #000;
}

.name {
  height: 60px;
  color: #000;
  font-size: 14px;
  display: block;
  float: right;
  line-height: 60px;
  margin-right: 10px;
  margin-left: 10px;
}
.selected-system {
  font-size: 12px;
  line-height: 28px;
}
.system {
  position: absolute;
  top: 17px;
  left: 260px;
}
</style>
