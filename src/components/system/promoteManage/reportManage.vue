<template>
<div class="report-manage-wrap">
  <keep-alive>
    <report-list v-if="reportPath === 'reportList'"></report-list>
  </keep-alive>
  <recycle-list v-if="reportPath === 'recycleList'"></recycle-list>
  <report-base-info v-if="reportPath === 'reportBaseInfo'"></report-base-info>
  <report-typein v-if="reportPath === 'reportTypein'"></report-typein>
</div>
</template>

<script>
import ReportList from './reportList'
import RecycleList from './recycleList'
import ReportBaseInfo from './reportBaseInfo'
import ReportTypein from './reportTypein'

import store from '@/vuex/store'

export default {
  name: 'ReportMange',
  components: {
    ReportList,
    RecycleList,
    ReportBaseInfo,
    ReportTypein
  },
  data () {
    return {
    }
  },
  computed: {
    reportPath () {
      return this.$store.getters.promotePath
    }
  },
  mounted () {
    console.log(this.reportPath)
    store.dispatch('changePromotePath', 'reportList')
  }
}
</script>

<style scoped>
.report-manage-wrap {
  width: 100%;
  height: 100%;
  font-family: Arial;
  font-size: 12px;
  overflow: auto;
}
</style>
