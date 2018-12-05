<template>
  <div class="report-manage-wrap">
    <!--资源首页-->
    <section class="topbox">
      <el-button type="primary" class="greenBack add-btn" size="small">新增报告</el-button>
      <el-button size="small" class="check-btn">审&nbsp;核</el-button>
      <el-button size="small" class="recycle-btn">
        <i class="iconfont icon-shanchuicon"></i><span>回收站</span>
      </el-button>
      <div class="topright">
        <div class="searchbox">
          <el-input v-model="searchText" placeholder="请输入机构编号/体检日期/姓名/工号/操作人"  size="small" @keyup.enter.native="searchTemplate" class="search-input">
          </el-input>
          <i class="el-icon-search searchIcon" slot="append" @click="searchTemplate"></i>
        </div>
      </div>
    </section>
    <reportTable :searchText="searchText" ref="reportTable" ></reportTable>
  </div>
</template>
<script type="text/javascript">
import reportTable from './reportTable'
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
    }
  }
}
</script>
<style scoped>
  .report-manage-wrap {
    padding: 24px 48px;
    font-size: 12px;
  }
 .topbox {
   font-size: 0;
   white-space: nowrap;
 }
 .topbox .add-btn {
   width: 80px;
   height: 30px;
   border-radius:2px;
   box-shadow:1px 4px 16px 0px rgba(21,220,200,0.16);
 }
 .topbox .check-btn {
   width: 60px;
   height: 30px;
   background-color: #fff;
   border-radius:2px;
   margin-left: 8px;
 }
 .topbox .recycle-btn {
   width: 88px;
   height: 30px;
   margin-left: 8px;
 }
 .topbox .recycle-btn i {
   display: inline-block;
   font-size: 12px;
 }
 .topbox .recycle-btn span {
   display: inline-block;
   margin-left: 8px;
 }
 .topright {
   float: right;
 }
 .topright .search-input {
   width: 264px;
   height: 30px;
 }
 .searchbox i {
   font-size: 13px;
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
