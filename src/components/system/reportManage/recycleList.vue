<template>
<div class="recycle-list-wrap">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">报告管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">回收站</span>
  </div>
  <div class="topright">
    <div class="searchbox">
      <el-input v-model="searchText" placeholder="请输入机构编号/体检日期/姓名/工号/操作人"  size="small" @keyup.enter.native="searchReport" class="search-input">
      </el-input>
      <i class="el-icon-search searchIcon" slot="append" @click.stop="searchReport"></i>
    </div>
  </div>
  <div class="table-area">
    <reportTable tableType="recycle" :searchText="searchText" ref="reportTable"></reportTable>
  </div>
</div>
</template>

<script>
import reportTable from './reportTable'
export default {
  name: 'RecycleList',
  components: {
    reportTable
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    goReportList () {
      this.$store.dispatch('changeReportPath', 'reportList')
    },
    searchReport () {
      this.$refs.reportTable.getTempList(1, 'search')
    }
  }
}
</script>

<style scoped>
.recycle-list-wrap {
  padding: 0 24px;
  height: 100%;
  overflow: hidden;
}
.table-area {
  height: 100%;
  padding: 10px 24px 0 24px;
}
.topright {
  position: absolute;
  top: 24px;
  right: 48px;
}
.topright .search-input {
  width: 264px;
  height: 30px;
}
.topright .searchbox i {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 13px;
}
</style>
