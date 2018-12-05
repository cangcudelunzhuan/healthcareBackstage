<template>
<div class="select-positive-wrap">
  <div class="dialog-wrap">
    <h3>选择阳性指标
      <div class="hsq-btn-close" @click="closeSelect"></div>
    </h3>
    <div class="hsq-dialog-content" v-loading="isLoading" element-loading-text="加载中...">
      <div class="hsq-dialog-content-row">
      </div>
      <div class="dialog-table table-wrap">
       <el-table
        :data="tableData"
        height="350"
        ref="selectTable"
        highlight-current-row
        @selection-change="selectChangeFn"
        style="width: 100%">
          <el-table-column
          type="selection">
          </el-table-column>
          <el-table-column
            property="compareValue"
            label="判断条件"
            :formatter="formatCompareValue"
            width="80">
          </el-table-column>
          <el-table-column
            property="kpiResult"
            label="阳性指标">
          </el-table-column>
          <el-table-column
            property="explan"
            label="医学解释"
            width="270">
          </el-table-column>
          <el-table-column
            property="cause"
            label="常见病因">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="confirmFn">确定</div>
      <div class="cancel-btn" @click.stop="closeSelect">取消</div>
    </div>
  </div>
</div>
</template>

<script>
import reportManageApi from '@/fetch/report/reportManage'
import { toast } from '@/util/tool'
export default {
  name: 'SelectMember',
  props: ['courseCode', 'projectCode', 'selectedResultCode'],
  data () {
    return {
      isLoading: true,
      tableData: null,
      currentSelectRow: null
    }
  },
  mounted () {
    this.init()
  },
  watch: {
  },
  methods: {
    init () {
      reportManageApi.explain(this.courseCode, this.projectCode)
        .then(res => {
          this.tableData = res.data
          this.isLoading = false
          this.$nextTick(() => {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].resultCode === this.selectedResultCode) {
                this.currentSelectRow = this.tableData[i]
                this.$refs.selectTable.toggleRowSelection(this.tableData[i], true)
                break
              }
            }
          })
        })
        .catch(() => {})
    },
    formatCompareValue (row) {
      let compareValueText = ''
      switch (row.compareValue) {
        case '-1':
          compareValueText = '结果正常'
          break
        case '1':
          compareValueText = '结果偏高'
          break
        case '2':
          compareValueText = '结果偏低'
          break
        case '6':
          compareValueText = '结果呈阳性'
          break
        case '7':
          compareValueText = '结果呈弱阳性'
          break
        case '4':
          compareValueText = '结果文本不一致'
          break
        default:
          compareValueText = '待定'
          break
      }
      return compareValueText
    },
    selectChangeFn (val) {
      if (val.length === 0) {
        this.currentSelectRow = null
      } else if (val.length === 1) {
        this.currentSelectRow = val[0]
      } else {
        let last = val.pop()
        this.$refs.selectTable.clearSelection()
        this.$refs.selectTable.toggleRowSelection(last, true)
      }
    },
    confirmFn () {
      if (!this.currentSelectRow) {
        toast({
          type: 'warning',
          title: '请选择一个指标'
        })
        return
      }
      let singleKpiResult = {
        'compareValue': this.currentSelectRow.compareValue,
        'kpiResult': this.currentSelectRow.kpiResult,
        'resultCode': this.currentSelectRow.resultCode
      }
      if (this.currentSelectRow.resultCode !== this.selectedResultCode) {
        this.$emit('select-finish', singleKpiResult)
      }
      this.closeSelect()
    },
    closeSelect () {
      this.$emit('close-select')
    }
  }
}
</script>

<style scoped lang="scss">
.select-positive-wrap {
  background-color: rgba(0,0,0,.4);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  z-index: 2;
  .dialog-wrap {
    background-color: #fff;
    width: 700px;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 24px;
    transform: translate(-50%, -50%);
  }
}
.dialog-wrap {
  h3 {
    position: relative;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    padding: 16px 0px 18px;
    border-bottom: 2px solid #8B919A;
  }
}
.dialog-table {
  margin-top: 16px;
  height: 360px;
  overflow-y: auto;
  border-top: 1px solid #ebeef5;
}
</style>
