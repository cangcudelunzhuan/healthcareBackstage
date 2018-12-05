<template>
  <div class="root-el">
    <router-view></router-view>

    <el-alert
      :title="toastState.title"
      :type="toastState.type"
      v-show="toastState.showFlag"
      class="alertEl"
      @close="closeToastState"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import store from './vuex/store'
  import * as tool from '@/util/tool'
  export default {
    name: 'index',
    data () {
      return {
      }
    },
    mounted () {
      document.documentElement.style.fontSize = '10px'
      // 初始化前端埋点
      tool.initCountly()
      // 刷新时保持用户信息
      let info = localStorage.getItem('mdxxcc')
      if (info !== null) {
        tool.countlyUserDetail(JSON.parse(info))
      }
    },
    computed: mapState({
      toastState: state => state.frame.toastState
    }),
    methods: {
      closeToastState () {
        store.dispatch('hideToast')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root-el {
  height: 100%;
}
.alertEl {
  position: absolute;
  top: 15px;
  width: 300px;
  left: 50%;
  margin-left: -150px;
  z-index: 3000;
}
</style>
