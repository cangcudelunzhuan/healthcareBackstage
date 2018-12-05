<template>
<div class="select-member-wrap checkMemberList">
  <div class="dialog-wrap">
    <h3>复查下载列表
      <div class="hsq-btn-close" @click="closeSelect"></div>
    </h3>
    <div class="hsq-dialog-content" v-loading="isLoading" element-loading-text="加载中...">
      <div class="dialog-table table-wrap">
       <el-table
        :data="tableData"
        height="400"
        ref="selectTable"
        highlight-current-row
        style="width: 100%"
        :row-style="rowClass">
          <template slot="empty">
            <p>{{emptyText}}</p>
          </template>
          <el-table-column
            :formatter="filterCode"
            label="标题"
            >
          </el-table-column>
          <el-table-column
           label="操作"
           align="left"
           width="50"
           >
            <template slot-scope="scope">
             <div>
               <el-button
                 type="text"
                 @click.stop.prevent="exportList(scope.row)"
                 >下载
               </el-button>
             </div>
           </template>
         </el-table-column>
        </el-table>
      </div>
      <div class="pageNum">
      	<div class="block">
          <el-pagination
            layout="prev, pager, next"
            :page-size="numPerPage"
            :total="listCount"
            :current-page="currentPage"
            @current-change="getTempList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="lxl-btns">
    </div>
  </div>
</div>
</template>

<script>
import promoteManageApi from '@/fetch/report/promoteManageLXL'
// import { toast } from '@/util/tool'
export default {
  name: 'SelectMember',
  data () {
    return {
      isLoading: false,
      emptyText: '暂无数据',
      filterText: '',
      tableData: null,
      selectRow: null,
      numPerPage: 9,
      listCount: 0,
      currentPage: 1
    }
  },
  mounted () {
    this.memberList()
  },
  methods: {
    getTempList (num) {
      this.currentPage = num
      this.memberList()
    },
    memberList () {
      this.isLoading = true
      promoteManageApi.checkMemberList(this.currentPage, this.numPerPage)
      .then(res => {
        this.tableData = res.data.items
        this.listCount = res.data.total
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
      return row.reexaminationTime.slice(0, 4) + '年' + row.reexaminationTime.slice(5, 7) + '月' + row.title
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
    closeSelect () {
      this.$emit('close-select')
    },
    exportList (row) {
      // window.open('/bliss/scheme/reexamination/showDownloadTime/' + row, '_blank')
      let a = document.createElement('a')
      a.style.display = 'none'
      a.href = '/bliss/scheme/reexamination/showDownloadTime/' + row.reexaminationTime
      document.body.appendChild(a)
      a.click()
    },
    rowClass () {
      return 'height: 40px;'
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
    padding: 0 24px 30px 24px;
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
  height: 442px;
  overflow-y: auto;
  border-top: 1px solid #ebeef5;
}
.pageNum {
  width: 100%;
  position: relative;
}
.block {
  position: absolute;
  top: -37px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
