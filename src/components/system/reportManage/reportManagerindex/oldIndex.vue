<template id="">
  <div class="content-wrap">
      <!--资源首页-->
      <div class="route-view-area roleManage">
          <section class="topbox">
            <el-button type="primary" icon="plus" class="greenBack" size="small">新增报告</el-button>
            <el-button type="primary" size="small">审&nbsp;核</el-button>
            <div class="topright">
              <div class="searchbox">
                <el-input v-model="searchText" placeholder="请输入机构编号/体检日期/姓名/工号/创建人"  size="small" @keyup.enter.native="searchTemplate">
                </el-input>
                <i class="el-icon-search searchIcon" slot="append" @click="searchTemplate"></i>
              </div>
              <div class="importBox">
                <!-- <i class="iconfont">&#xe6dc;</i> -->
                <el-button  @click="goImport" class="importbutton" size="small">
                  <i class="iconfont">&#xe6dc;</i>导入
                </el-button>
              </div>
            </div>
          </section>
          <reportTable :searchText="searchText" ref="reportTable" ></reportTable>
      </div>
  </div>
</template>
<script type="text/javascript">
import reportTable from './reportTable'
import dialog from '@/util/dialog.js'
export default {
  name: 'reportManager',
  components: {
    reportTable
  },
  data () {
    return {
      searchText: ''
    }
  },
  mounted () {
    // 前端埋点
    window.Countly.track_pageview('管理平台——报告管理页')
  },
  methods: {
    searchTemplate: function () {
      this.$refs.reportTable.getTempList(1)
    },
    goImport: function () {
      let vm = this
      let mes = '请在新打开的页面导入体检报告，导入完成前，请不要关闭此窗口。导入完成后再点击完成按钮。'
      let confirmButtonText = '已完成导入'
      let info = {
        mes: mes,
        confirmButtonText: confirmButtonText
      }
      dialog.alert(info, function () {
        vm.$refs.reportTable.getTempList(1)
      })
      let user = encodeURIComponent(sessionStorage.getItem('userName'))
      /*
      let user = sessionStorage.getItem('userName')
      user = cjkEncode(user)
      function cjkEncode (text) {
        if (text == null) {
          return ''
        }
        var newText = ''
        for (var i = 0; i < text.length; i++) {
          var code = text.charCodeAt(i)
          if (code >= 128 || code === 91 || code === 93) {
            newText += '[' + code.toString(16) + ']'
          } else {
            newText += text.charAt(i)
          }
        }
        return newText
      }
      */
      window.open(`http://10.200.111.122:8888/WebReport/ReportServer?reportlet=checkupReport.cpt&op=write&create_user=${user}`)
    }
  }
}
</script>
<style scoped>
 .roleManage{
   position: relative;
 }
 .topbox{
   display: flex;
   align-items: center;
   justify-content: space-between;
 }
 .topright{
   display: flex;
 }
 .topright .el-input{
   width: 26.4rem;
 }
 .greenBack {
   color: #fff;
 }
 .searchbox{
   position: relative;
 }
 .searchIcon{
   position: absolute;
   right: 0.7rem;
   top: 0.7rem;
   z-index: 2;
   cursor: pointer;
   font-size: 1.5rem;
   color: #515152
 }

</style>
