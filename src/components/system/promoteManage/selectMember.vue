<template>
<div class="select-member-wrap">
  <div class="dialog-wrap">
    <h3>关联体检报告
      <div class="hsq-btn-close" @click="closeSelect"></div>
    </h3>
    <div class="hsq-dialog-content" v-loading="isLoading" element-loading-text="加载中...">
      <div class="hsq-dialog-content-row">
        <el-input
          ref="elInput"
          class="search-input"
          placeholder="请输入机构编号/工号/姓名" 
          v-model="filterText">
          <el-button slot="append" icon="el-icon-search" @click.stop="searchMember"></el-button>
        </el-input>
      </div>
      <div class="dialog-table table-wrap">
       <el-table
        :data="tableData"
        height="358"
        ref="selectTable"
        highlight-current-row
        @selection-change="selectChangeFn"
        style="width: 100%">
          <template slot="empty">
            <p>{{emptyText}}</p>
          </template>
          <el-table-column
          type="selection">
          </el-table-column>
          <el-table-column
            :formatter="filterCode"
            label="体检报告编号"
            width="190">
          </el-table-column>
          <el-table-column
            property="empName"
            label="姓名"
            align="center">
          </el-table-column>
          <el-table-column
            label="性别"
            :formatter="formatGender"
            align="center"
            width="60">
          </el-table-column>
          <el-table-column
            property="positiveNum"
            label="阳性指标数"
            align="center"
            width="92">
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
  data () {
    return {
      isLoading: false,
      emptyText: '暂无数据',
      filterText: '',
      tableData: null,
      selectRow: null
    }
  },
  mounted () {
    this.$refs.elInput.$el.querySelector('input').addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.searchMember()
      }
    })
  },
  methods: {
    searchMember () {
      this.isLoading = true
      reportManageApi.getCheckupList(1000, 1, this.filterText, '', '', 1)
      .then(res => {
        this.tableData = res.data.items
        this.$nextTick(() => {
          this.isLoading = false
        })
      })
      .catch(() => {
        this.isLoading = false
      })
    },
    // 表格的格式化和筛选
    filterCode (row) {
      return row.hospitalId + '-' + row.empNo + '-' + row.checkupTime
    },
    formatGender (row) {
      if (row.staffSex === '0') {
        return '男'
      } else if (row.staffSex === '1') {
        return '女'
      } else {
        return ''
      }
    },
    selectChangeFn (val) {
      if (val.length === 0) {
        this.selectRow = null
      } else if (val.length === 1) {
        this.selectRow = val[0]
      } else {
        let last = val.pop()
        this.$refs.selectTable.clearSelection()
        this.$refs.selectTable.toggleRowSelection(last, true)
      }
    },
    confirmFn () {
      if (this.selectRow === null) {
        toast({
          type: 'warning',
          title: '请添加会员'
        })
        return
      }
      this.$emit('select-change', this.selectRow)
      this.closeSelect()
    },
    closeSelect () {
      this.$emit('close-select')
    }
  }
}
</script>

<style scoped lang="scss">
.select-member-wrap {
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
    width: 480px;
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
