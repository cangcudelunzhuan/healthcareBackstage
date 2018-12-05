<template>
<div class="report-list-wrap">
  <section class="topbox">
    <el-button type="primary" class="greenBack add-btn" size="small" @click.stop="goReportBaseInfo">新增报告</el-button>
    <el-button size="small" class="check-btn" @click.stop="verifyReports">审&nbsp;核</el-button>
    <el-button size="small" class="recycle-btn" @click.stop="goRecycleList">
      <i class="iconfont icon-shanchuicon"></i><span>回收站</span>
    </el-button>
    <div class="topright">
      <div class="searchbox">
        <el-input v-model="searchText" placeholder="请输入机构编号/体检日期/姓名/工号/操作人"  size="small" @keyup.enter.native="searchReport" class="search-input">
        </el-input>
        <i class="el-icon-search searchIcon" slot="append" @click.stop="searchReport"></i>
      </div>
    </div>
  </section>
  <reportTable :searchText="searchText" tableType="reportList" ref="reportTable" ></reportTable>
</div>
</template>

<script>
import store from '@/vuex/store'
import reportTable from './reportTable'
export default {
  name: 'ReportList',
  components: {
    reportTable
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    goReportBaseInfo () {
      store.dispatch('changeReportPath', 'reportBaseInfo')
    },
    goRecycleList () {
      store.dispatch('changeReportPath', 'recycleList')
    },
    searchReport () {
      this.$refs.reportTable.getTempList(1, 'search')
    },
    verifyReports () {
      this.$refs.reportTable.verifyResource()
    }
  }
}
</script>

<style scoped>
.report-list-wrap {
  padding: 0 48px;
  height: 100%;
}
.topbox {
  padding-top: 24px;
  font-size: 0;
  white-space: nowrap;
  position: relative;
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
  position: absolute;
  top: 24px;
  right: 0px;
}
.topright .search-input {
  width: 264px;
  height: 30px;
}
.searchbox {
  position: relative;
}
.searchbox i {
  font-size: 13px;
}
.searchIcon {
  position: absolute;
  right: 0.7rem;
  top: 0.7rem;
  z-index: 2;
  cursor: pointer;
  font-size: 1.5rem;
  color: #515152
}
.greenBack {
  color: #fff;
}
</style>
