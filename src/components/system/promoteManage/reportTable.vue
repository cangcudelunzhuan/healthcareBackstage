<template lang="html">
  <div class="user-mng wrap-area"
     v-loading.lock="loading.active"
     :element-loading-text="loading.text">
     <input type="hidden" v-model="searchParam" name="" value="">
     <el-row class="table-wrap" ref="tableWrap">
       <el-table
         ref="userTable"
         :data="tableData"
         @filter-change="filterChange"
         @selection-change="selectionChangeFn"
         highlight-current-row
         style="width: 100%"
         class="border-side-none"
         @row-click="clickRowHandle">
         <template slot="empty">
           <p>{{emptyTip}}</p>
         </template>
         <el-table-column
          type="selection"
         >
         </el-table-column>
         <el-table-column
           :formatter="filterCode"
           label="关联体检报告编号"
           width="280"
           align="left">
         </el-table-column>
         <el-table-column
           prop="empName"
           label="体检员工"
           align="left">
         </el-table-column>
         <el-table-column
           prop="grade"
           label="员工岗级"
           column-key="grade"
           :filters="gradeFilters"
           align="center"
           width="100">
         </el-table-column>
         <el-table-column
           prop="positiveNum"
           label="复查项目数"
           column-key="positiveNum"
           align="center"><!--:formatter="formatterReportType"-->
         </el-table-column>
         <el-table-column
           prop="flag"
           label="方案状态"
           width="100"
           column-key="reportStatus"
           :formatter="formatterFlag"
           :filters="reportStatusFilters">
         </el-table-column>
         <el-table-column
           prop="updateTime"
           label="操作时间"
           :formatter="formatterDate"
           align="left">
         </el-table-column>
         <el-table-column
           prop="updateUser"
           label="操作人"
           align="left">
         </el-table-column>
         <el-table-column
           label="操作"
           align="left"
           >
           <template slot-scope="scope">
             <div>
               <el-button
                 type="text"
                 v-if="tableType=='reportList'"
                 @click.stop.prevent="editResource(scope.row)"
                 >编辑
               </el-button>
               <el-button
                 type="text"
                 @click.stop.prevent="removeResource(scope.row)"
                 v-if="tableType=='reportList'"
                 >删除
               </el-button>
               <el-button
                 type="text"
                 v-if="tableType=='recycle'"
                 @click.stop.prevent="recoverResource(scope.row)"
                 >还原
               </el-button>
             </div>
           </template>
         </el-table-column>
       </el-table>
     </el-row>
     <div class="bottom-area">
      <!--数据源列表分页-->
      <span>总共<span class="redfont" style="margin:0 1rem">{{total}}</span>条记录</span>
      <el-pagination
        background
        :page-sizes="[20,30,50]"
        :page-size="numPerPage"
        layout="sizes, ->, prev, pager, next"
        :total="listCount"
        :current-page="currentPage"
        @current-change="getTempList"
        @size-change="handlePaginationChange">
      </el-pagination>
     </div>

     <div class="previewPage" v-if='showPreviewPage'>
       <preview-page @close-preview='closePreview' :pageType="previewPageType"></preview-page>
     </div>
  </div>
</template>

<script>
import previewPage from '../promoteManage/previewPage'
import * as tool from '@/util/tool'
import reportManageApi from '@/fetch/report/reportManage'
import promoteManageApi from '@/fetch/report/promoteManageLXL'
import store from '@/vuex/store'
export default {
  props: [
    'searchText', 'tableType'
  ],
  components: {
    previewPage
  },
  data () {
    return {
      loading: {
        active: false,
        text: ''
      },
      emptyTip: '暂无数据',
      tableData: [],
      selectedData: [],
      numPerPage: 20,
      listCount: 0,
      currentPage: 1,
      gradeFilters: [
        {text: '8', value: '8'},
        {text: '9', value: '9'},
        {text: '10', value: '10'},
        {text: '11', value: '11'},
        {text: '12', value: '12'},
        {text: '13', value: '13'},
        {text: '14', value: '14'}
      ],
      reportStatusFilters: [
        {text: '待审核', value: '0'},
        {text: '已发布', value: '1'}
      ],
      gradeStr: '',
      reportTypeStr: '',
      reportStatusStr: '',
      total: 0,
      pageWidth: 66,
      userTableH: 0,
      fixedbottomLeft: 0,
      showPreviewPage: false,
      previewPageType: 'check',
      hospitalOptions: []
    }
  },
  computed: {
    searchParam () {
      return this.searchText
    },
    reportPath () {
      return this.$store.getters.promotePath
    }
  },
  watch: {
    reportPath (newValue) {
      // 当reportPath返回到reportList时，刷新列表
      if (newValue === 'reportList') this.getTempList()
    }
  },
  created () {
    this.getTempList(1)
    // 如果reportTabel是在回收站中使用
    if (this.tableType === 'recycle') {
      this.reportStatusFilters = null
      this.previewPageType = 'recycleCheck'
    } else {
      this.previewPageType = 'check'
    }
  },
  mounted () {
    let vm = this
    this.$nextTick(function () {
      let l = (vm.$refs.tableWrap.$el.offsetWidth / 10)
      let h = (window.screen.height - vm.$refs.tableWrap.$el.offsetTop) / 10 - 33
      let left = vm.$refs.tableWrap.$el.offsetLeft / 10
      vm.userTableH = h
      vm.pageWidth = l
      vm.fixedbottomLeft = left
    })
    this.init()
  },
  methods: {
    init () {
      reportManageApi.getHospitalList()
        .then(res => {
          this.hospitalOptions = res.data
        })
        .catch(() => {})
    },
    // 获取报告列表数据，普通列表显示待审核、已发布，回收站列表显示已删除。回收站列表需要传参recycle='1'
    getTempList (pageNum, way) {
      let pageIndex = pageNum || this.currentPage
      this.currentPage = pageIndex
      this.emptyTip = way === 'search' ? '搜索无结果' : '暂无数据'
      this.reportStatusStr = this.tableType === 'recycle' ? '2' : this.reportStatusStr
      let recycle = this.tableType === 'recycle' ? '1' : '0'
      this.showLoading('正在加载列表')
      promoteManageApi.getPromoteList(this.numPerPage, pageIndex, this.searchParam, this.gradeStr, this.reportTypeStr, this.reportStatusStr, recycle)
      .then(res => {
        this.hideLoading()
        this.tableData = res.data.items
        this.listCount = res.data.total
        this.total = res.data.total
      })
      .catch(() => {
        this.hideLoading()
        this.tableData = []
        this.listCount = 0
      })
    },
    // 表格的格式化和筛选
    formatterDate (row) {
      return row.updateTime.substr(0, 10)
    },
    filterCode (row) {
      return row.hospitalId + '-' + row.empNo + '-' + row.checkupTime
    },
    formatterFlag (row) {
      let flagText = ''
      switch (row.flag) {
        case '0':
          flagText = '待审核'
          break
        case '1':
          flagText = '已发布'
          break
        case '2':
          flagText = '已删除'
          break
      }
      return flagText
    },
    formatterReportType: function (row, colum) {
      return this.getReportType(row.reportType)
    },
    getReportType: function (type) {
      if (type === '1') {
        return '体检报告'
      } else if (type === '2') {
        return '就诊报告单'
      }
      return ''
    },
    filterChange: function (filters) {
      let vm = this
      let grade = filters.grade
      let reportType = filters.reportType
      let reportStatus = filters.reportStatus
      if (grade) vm.gradeStr = grade.join(',')
      if (reportType) vm.reportTypeStr = reportType.join(',')
      if (reportStatus) vm.reportStatusStr = reportStatus.join(',')
      this.getTempList(1)
    },
    selectionChangeFn (val) {
      this.selectedData = val
    },
    // 本页显示加载进度条
    showLoading: function (text) {
      this.loading = {
        active: true,
        text: text
      }
    },
    // 本页隐藏加载进度条
    hideLoading: function () {
      this.loading = {
        active: false,
        text: ''
      }
    },
    // 分页，每页数量改变
    handlePaginationChange: function (size) {
      this.numPerPage = size
      this.getTempList()
    },
    // 编辑报告
    editResource (data) {
      let hospitalName = ''
      for (let item in this.hospitalOptions) {
        if (this.hospitalOptions[item].code === data.hospitalId) {
          hospitalName = this.hospitalOptions[item].name
        }
      }
      data = { ...data, hospitalName: hospitalName }
      store.dispatch('changePromoteId', data.id)
      store.dispatch('changePromotePath', 'reportTypein')
      store.dispatch('changePromoteBaseInfo', data)
      store.dispatch('changePromoteType', 'edit')
    },
    // 删除报告
    async removeResource (data) {
      let vm = this
      await this.$store.dispatch('checkSure', {title: '你确定要删除吗?', msg: '删除后促进方案会转移至回收站，系统将保存此方案7天，之后自动删除，确认删除 ' + data.empName + ' 的促进方案吗？'})
      vm.showLoading('请稍等')
      promoteManageApi.editReportStatus('2', data.id)
      .then(res => {
        vm.hideLoading()
        tool.toast({
          type: 'success',
          title: '删除成功'
        })
        vm.getTempList(1)
      })
      .catch(() => {
        vm.hideLoading()
      })
    },
    // 还原报告
    async recoverResource (data) {
      let vm = this
      await this.$store.dispatch('checkSure', {title: '你确定要还原吗?', msg: '确认还原' + data.empName + ' 的促进方案吗？'})
      vm.showLoading('请稍等')
      promoteManageApi.editReportStatus('0', data.id)
      .then(res => {
        vm.hideLoading()
        tool.toast({
          type: 'success',
          title: '还原成功'
        })
        vm.getTempList(1)
      })
      .catch(() => {
        vm.hideLoading()
      })
    },
    // 审核功能，将报告变为已发布状态
    async verifyResource () {
      let selectedData = this.selectedData.filter((row) => {
        if (row.flag === '0') return true
      })
      if (selectedData.length === 0) {
        tool.toast({
          type: 'warning',
          title: '需要选中待审核状态的报告'
        })
        return
      }
      await this.$store.dispatch('checkSure', {title: '你确定要发布吗?', msg: '审核发布后用户即可查看最新的促进方案，确认发布此促进方案吗？'})
      let ids = []
      let hospitalCodes = []
      selectedData.forEach((row) => {
        ids.push(row.id)
        hospitalCodes.push(row.hospitalId)
      })
      this.showLoading('请稍等')
      promoteManageApi.editReportStatus('1', ids.join(','))
      .then(res => {
        this.hideLoading()
        tool.toast({
          type: 'success',
          title: '发布成功'
        })
        this.getTempList(1)
      })
      .catch(() => {
        this.hideLoading()
      })
    },
    clickRowHandle (row, event, column) {
      store.dispatch('changePromoteInfo', row)
      store.dispatch('changePromoteId', row.id)
      this.showPreviewPage = true
    },
    closePreview () {
      this.showPreviewPage = false
    }
  }
}
</script>

<style scoped>
  .user-mng {
    height: calc(100% - 80px);
    overflow-y: hidden;
    padding-top: 24px;
  }
  .table-wrap{
    border-top: 1px solid #ebebeb;
    height: calc(100% - 60px);
    overflow-y: auto;

  }
  .table-wrap i {
    margin-right: 15px;
    cursor: pointer;
  }
  .bottom-area{
    font-size: 12px;
    margin-top: 24px;
    color: #000;
  }
  .bottom-area > span {
    display: inline-block;
    vertical-align: middle;
    line-height: 30px;
  }
</style>
