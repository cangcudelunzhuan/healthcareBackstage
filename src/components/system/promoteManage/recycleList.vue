<template>
<div class="recycle-list-wrap">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">报告管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">回收站</span>
  </div>
  <div class="table-area">
    <reportTable tableType="recycle"></reportTable>
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
    }
  },
  methods: {
    goReportList () {
      this.$store.dispatch('changePromotePath', 'reportList')
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
</style>
