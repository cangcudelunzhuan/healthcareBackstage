<template>
  <div class="nav-menu">
    <el-menu :router=true theme="dark" :collapse="isCollapse">
      <template v-for="(navOut, indexOut) in navMenu">
        <el-submenu :index="'' + indexOut" :key="navOut.id" class="custom-submenu" v-if="navOut.hasLeaf">
          <template slot="title">
            <el-menu-item :index="indexOut + '-0'" index="navOut.id" :route="{path: navOut.path}">
              <i :class="navOut.iconClass"></i>
              <span slot="title">{{ navOut.title }}</span>
            </el-menu-item>
          </template>
          <el-menu-item :index="indexOut + '-' + indexIn" :route="{path: navIn.path}"  v-for="(navIn, indexIn) in navOut.children" :key="navIn.id">
            <i :class="navIn.iconClass"></i>
            <span slot="title">{{ navIn.title }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="'' + indexOut" :key="navOut.id" :route="{path: navOut.path}" v-else>
          <i :class="navOut.iconClass"></i>
          <span slot="title">{{ navOut.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import frameApi from '../../fetch/frameApi'

  export default {
    props: ['isCollapse'],
    data () {
      return {
        navMenu: []
      }
    },
    created () {
      frameApi.GetNaveMenu()
        .then(res => {
          this.navMenu = res.data.navMenu
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-menu, .nav-menu>.el-menu {
  height: 100%;
}
.custom-submenu>div>li {
  padding-left: 0 !important;
  min-width: 73px;
}
.custom-submenu>div>li:hover {
  background-color: transparent !important;
}
</style>
