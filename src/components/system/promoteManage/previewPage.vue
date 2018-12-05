<template>
<div class="preview-page-wrap" @click.stop="closePreview">
  <div class="page-content"
    @click.stop=""
    v-loading.lock="isLoading"
    element-loading-text="加载中...">
    <el-scrollbar :style="{height:dialogH+'px'}">
      <section class="imgbox">
        <img :src="logosrc" class="printlogo">
      </section>
      <div id="printBox">
        <printBox :schemeInfo="schemeInfo" @Close="loadClose"></printBox>
      </div>
      <div class="operationRecordlist">
        <h3>
          <span>操作记录</span>
        </h3>
        <div class="recordTablelist">
          <el-table
            ref="table"
            :data="tableData"
            :header-cell-style="rowHeaderClass"
            :row-style="rowClass">
            <el-table-column
              prop="opeUser"
              label="操作者">
            </el-table-column>
            <el-table-column
              prop="empNo"
              label="工号">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="reportState"
              label="报告状态"
              align="center">
            </el-table-column>
            <el-table-column
              prop="opeContent"
              label="操作内容">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <p class="bottomx">
        <span>杭州幸福千万家健康服务管理有限公司 </span>
        <span>地址：浙江省杭州市滨江区江陵路1760号14楼</span>
        <span>电话：0571-86718506</span>
        <span>传真：86718531</span>
      </p>
    </el-scrollbar>
    <div class="exportBUtton">
      <el-button type="primary" @click="prinT" class=" greenBack">导出word</el-button>
    </div>
  </div>
</div>
</template>

<script>
import reportManageApi from '@/fetch/report/reportManage'
import printBox from './printBox'
import $ from 'jquery'
import {style} from '@/util/style.js'
import formats from '@/util/daterange'
export default {
  name: 'PreviewPage',
  components: {
    printBox
  },
  data () {
    return {
      isLoading: true,
      reportBaseInfo: {},
      tableData: [],
      logosrc: 'static/images/yelogo.png',
      dialogH: 0,
      dialogleft: 0
    }
  },
  computed: {
    schemeInfo () {
      return this.$store.getters.promoteInfo
    }
  },
  created () {
    this.getDateListResult()
  },
  mounted () {
    this.dialogH = window.innerHeight - 80
    this.isLoading = true
  },
  methods: {
    getDateListResult () {
      reportManageApi.getPromotionDateListResult(this.schemeInfo.id)
      .then(res => {
        this.tableData = res.data
      })
      .catch(() => {
        this.isLoading = false
      })
    },
    // 表格的格式化
    formatterDate (row) {
      return row.updateTime.substr(0, 10)
    },
    closePreview () {
      this.$emit('close-preview')
    },
    rowHeaderClass () {
      return 'font-size: 12px;'
    },
    rowClass () {
      return 'font-size: 12px; height: 36px; opacity: 0.85;'
    },
    loadClose () {
      this.isLoading = false
    },
    prinT (oper) {
      let vm = this
      let title = `幸福千万家会员${vm.schemeInfo.empName}全年健康促进方案(${formats.dateRange(vm.schemeInfo.checkupTime)})`
      $('#printBox').wordExport(title, style)
    }
  }
}
</script>

<style scoped lang="scss">
$border-color: #EBEBEB;
$highlight-color: #03BFEE;
.preview-page-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,.4);
  z-index: 2;
  overflow: auto;
  font-size: 12px;
  line-height: 18px;
  .page-content {
    background-color: #fff;
    width: 1128px;
    margin: 20px auto;
    position: relative;
    padding: 20px 0;
  }
}
.operationRecordlist {
  margin: 0 80px;
  h3 {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
  }
}
.imgbox{
  display: flex;
  justify-content: flex-end;
  padding: 0 80px;
}
.printlogo{
  display: block;
  position: relative;
  right: 0;
  top: 0;
  height: 80px
}
.bottomx{
  padding:0 80px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #000;
  opacity: 0.75;
  margin-top: 60px
}
.exportBUtton{
  position: fixed;
  top:30px;
  width: 1118px;
  margin: 0 auto;
  text-align: right;
}
</style>
