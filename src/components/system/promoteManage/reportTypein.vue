<template>
<div class="report-typein-wrap promote-report-typein-wrap" v-loading.lock="isLoading" :element-loading-text="loadingText">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">促进方案管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">{{typeInType === 'edit'?'编辑促进方案':'新建促进方案'}}</span>
  </div>
  <div class="bottom-wrap">
    <div class="submit-btn greenBack" @click="submitFn">提交报告</div>
    <div class="preview-btn" @click="previewShowFn">预&nbsp;览</div>
  </div>
  <div class="brief-wrap">
    <p class="brief-line1">
      <span class="name">幸福千万家会员{{ schemeInfo.empName }}全年健康促进方案</span>
      <span class="hospital-name">({{ schemeInfo.hospitalName }})</span>
    </p>
    <p class="brief-line2">
      <span class="report-code">报告编号：{{ schemeInfo.hospitalId }}-{{ schemeInfo.empNo }}-{{ schemeInfo.checkupTime }}</span>
      <!--<span class="time">时间：{{ schemeInfo.checkupTime.replace(/(\d{4})(\d{2})(\d{2})/, '$1年$2月$3日') }}</span>-->
      <span class="time">时间：{{ checkupTimeDis }}</span>
    </p>
  </div>
  <div class="projects-area">
    <div class="left">
      <ul :class="{firstCourseHiden: firstCourseHiden}">
      	<li
      	  v-for="item in courseList"
      	  class="course-item"
      	  :class="{active: currentSelectedCourseCode===item.courseCode, existedData: item.existProjectResult}"
      	  @click.stop="courseClickFn(item.courseCode)">
      	  <span class="course-name" :title="item.courseName">{{item.courseName}}</span>
          <i class="iconfont icon-chenggongicon chenggong" v-if="item.existProjectResult"></i>
      	</li>
      </ul>
    </div>
    <div class="right" id="promoteTypeinWrap">
      <positiveIndexTable :schemeInfo="schemeInfo" v-if="currentSelectedCourseCode === 1" @del-pos-table-course="delPosTableCourse"></positiveIndexTable>
      <positiveIndexEdit :schemeInfo="schemeInfo" v-if="currentSelectedCourseCode === 2" @to-next-course="toNextCourse" @content-state-change="contentStateChange" ref="positiveIndexEdit"></positiveIndexEdit>
      <!--<schemeEdit :schemeInfo="schemeInfo" courseCode="3" v-if="currentSelectedCourseCode === 3" @to-next-course="toNextCourse" @content-state-change="contentStateChange"></schemeEdit>-->
      <schemeEdit :schemeInfo="schemeInfo" :courseCode="currentSelectedCourseCode" v-if="currentSelectedCourseCode === 3 || currentSelectedCourseCode === 4" @to-next-course="toNextCourse" @content-state-change="contentStateChange" ref="schemeEdit"></schemeEdit>
      <summaryEdit :schemeInfo="schemeInfo" v-if="currentSelectedCourseCode === 5" @to-next-course="toNextCourse" @content-state-change="contentStateChange" ref="summaryEdit"></summaryEdit>
      <reviewEdit :schemeInfo="schemeInfo" v-if="currentSelectedCourseCode === 6" @to-next-course="toNextCourse" @content-state-change="contentStateChange" ref="reviewEdit"></reviewEdit>
    </div>
  </div>
  <el-dialog
  title=""
  :visible.sync="previewShow" custom-class="printdialog" top="20px" :lock-scroll="true"
  width="1128px" :center="true" :show-close="false" ref="dialog" v-loading.lock="Loading" >
      <el-scrollbar :style="{height:dialogH+'px'}" ref="elscrollbar">
        <section class="imgbox">
          <img :src="logosrc" class="printlogo">
        </section>
        <div id="printBox">
          <printBox :schemeInfo="schemeInfo" v-if="previewShow"
          @Close="loadClose"></printBox>
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
  </el-dialog>
</div>
</template>

<script>
// import { toast } from '@/util/tool'
import { dateFormat } from '@/util/tool'
// import previewPage from './previewPage'
import promoteManageApi from '@/fetch/report/promoteManage'
import positiveIndexTable from './typeinBlocks/positiveIndexTable'
import positiveIndexEdit from './typeinBlocks/positiveIndexEdit'
import schemeEdit from './typeinBlocks/schemeEdit'
import summaryEdit from './typeinBlocks/summaryEdit'
import reviewEdit from './typeinBlocks/reviewEdit'
import printBox from './printBox'
import $ from 'jquery'
import '@/util/wordexport'
import {style} from '@/util/style.js'
import formats from '@/util/daterange'
export default {
  name: 'PremoteReportTypein',
  components: {
    positiveIndexTable,
    positiveIndexEdit,
    schemeEdit,
    summaryEdit,
    reviewEdit,
    printBox
  },
  computed: {
    schemeInfo () {
      return this.$store.getters.promoteBaseInfo
    },
    typeInType () {
      return this.$store.getters.promoteType
    },
    checkupTimeDis () {
      let date = new Date(this.$store.getters.promoteBaseInfo.checkupTime.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
      let res = dateFormat(date, 'yyyy年MM月') + '-'
      date.setDate(1)
      date.setMonth(date.getMonth() + 11)
//      res + dateFormat(date, 'yyyy年MM月')
      return res + dateFormat(date, 'yyyy年MM月')
    }
  },
  data () {
    return {
      logosrc: 'static/images/yelogo.png',
      Loading: false,
      previewShow: false,
      dialogH: 0,
      // 标记首次编辑，首次编辑保存时传'编辑'行为，再编辑传''，用于日志
//      firstEdit: true,
      isLoading: false,
      loadingText: '加载中...',
//      schemeInfo: {
//        empNo: '0154681',
//        empName: '黄凤春',
//        checkupTime: '20181113',
//        schemeId: '123456',
//        reportId: '0001-013415520190000',
//        hospitalId: '浙江二院国际医学中心杭州明州医院',
//        hospitalCode: '0001'
//      },
      // 标记是否内容有改动，有改动则切换科目的时候提醒，无改动直接切换
      hasContentChange: false,
//      reportBaseInfo: {},
      // 保存报告已录入信息
//      savedData: {},
      currentSelectedCourseCode: 1,
      firstCourseHiden: false,
      courseList: [{
        courseCode: 1,
        courseName: '阳性指标对比',
        existProjectResult: true
      }, {
        courseCode: 2,
        courseName: '阳性指标解释、病因',
        existProjectResult: 0
      }, {
        courseCode: 3,
        courseName: '健康促进方案',
        existProjectResult: 0
      }, {
        courseCode: 4,
        courseName: '营养饮食保健方案',
        existProjectResult: 0
      }, {
        courseCode: 5,
        courseName: '健康总评',
        existProjectResult: 0
      }, {
        courseCode: 6,
        courseName: '复查时间',
        existProjectResult: 0
      }]
    }
  },
//  computed: {
//    promoteId () {
//      return this.$store.getters.promoteId
//    }
//  },
  created () {
//    this.getReportBaseInfo()
    this.getPromoteSchemeSelect()
  },
  mounted () {
//    this.firstEdit = true
  },
  methods: {
    prinT () {
      // let bdhtml = document.getElementById('printBox').innerHTML
      // window.document.body.innerHTML = bdhtml
      // var wind = window.open('', 'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no')
      // wind.document.body.innerHTML = bdhtml
      // this.PageSetup_Null()
      // wind.print()
      // return false
      // let PHE = require('print-html-element')
      // PHE.printHtml(bdhtml, {templateString: '{{printBody}}'})
      // this.getPdf('printBox', 'name')
      let vm = this
      let title = `幸福千万家会员${vm.schemeInfo.empName}全年健康促进方案(${formats.dateRange(vm.schemeInfo.checkupTime)})`
      $('#printBox').wordExport(title, style)
    },
    // 点击左侧course function
    courseClickFn (courseCode) {
//      this.currentSelectedCourseCode = courseCode
      if (courseCode === this.currentSelectedCourseCode) return
      if (this.hasContentChange) {
        this.makeSureDiscard(courseCode)
      } else {
        this.currentSelectedCourseCode = courseCode
      }
    },
    async makeSureDiscard (courseCode) {
      await this.$store.dispatch('checkSure', {title: '你确定要切换录入科目吗?', msg: '警告：有结果未保存，建议保存后再切换科目。若继续切换，未保存结果将被清空！'})
      this.currentSelectedCourseCode = courseCode
      this.hasContentChange = false
    },
    // 预览组件显示消失
    previewShowFn () {
      this.previewShow = true
      this.dialogH = window.innerHeight - 80
      this.Loading = true
      setTimeout(() => {
        let div = this.$refs['elscrollbar'].$refs['wrap']
        div.scrollTop = 0
      }, 10)
    },
//    previewHideFn () {
//      this.previewShow = false
//    },
    goReportList () {
      this.$store.dispatch('changePromotePath', 'reportList')
    },
    // 获取各栏目是否有内容
    getPromoteSchemeSelect () {
      promoteManageApi.getPromoteSchemeSelect(this.schemeInfo.id)
        .then(res => {
          res.data.forEach((item, index) => {
            this.$set(this.courseList[index + 1], 'existProjectResult', item)
          })
        })
        .catch(() => {
//          this.hideLoading()
        })
    },
    // 提交报告
    submitFn () {
      const refMap = {}
      refMap[2] = 'positiveIndexEdit'
      refMap[3] = 'schemeEdit'
      refMap[4] = 'schemeEdit'
      refMap[5] = 'summaryEdit'
      refMap[6] = 'reviewEdit'
      if (this.hasContentChange) {
        this.$refs[refMap[this.currentSelectedCourseCode]].saveFn(true)
//        this.$refs[refMap[this.currentSelectedCourseCode]].saveFn()
//          .then((res) => {
//            console.log(res)
//            this.goReportList()
//          })
      } else {
        this.goReportList()
      }
    },
    contentStateChange (val) {
      this.hasContentChange = val
    },
    delPosTableCourse () {
//      this.courseList.shift()
      this.firstCourseHiden = true
      this.currentSelectedCourseCode = 2
    },
    toNextCourse (dataLength) {
      this.$set(this.courseList[this.currentSelectedCourseCode - 1], 'existProjectResult', dataLength)
      if (this.currentSelectedCourseCode < 6) {
        this.currentSelectedCourseCode += 1
      }
      this.hasContentChange = false
    },
    loadClose () {
      this.Loading = false
    }
  }
}
</script>

<style scoped>
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
.report-typein-wrap {
  padding: 0 24px;
  height: 100%;
  position: relative;
}
.brief-wrap {
  margin-top: 20px;
  padding: 16px 0 16px 24px;
  background-color: #F7F7F9;
  overflow: hidden;
}
.brief-line1 {
  height: 24px;
  line-height: 24px;
  margin-bottom: 16px;
  white-space: nowrap;
}
.brief-line1 .name {
  display: inline-block;
  margin-right: 16px;
  font-size: 16px;
}
.brief-line1 .hospital-name {
  font-size: 14px;
  display: inline-block;
}
.brief-line2 {
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  white-space: nowrap;
  color: #000;
}
.brief-line2 span {
  display: inline-block;
  margin-right: 24px;
}
.projects-area {
  height: calc(100% - 210px);
  padding-top: 16px;
}
.projects-area .left {
  float: left;
  width: 190px;
  height: 100%;
  box-shadow: inset -1px 0 0 0 #F5F5F5;
  overflow-y: auto;
}
.left .course-item {
  padding-right: 8px;
  font-size: 0;
  cursor: pointer;
  color: #8C8C8C;
}
.left .existedData {
  color: #000;
}
.firstCourseHiden li:first-child {
  display: none;
}
.course-item:hover {
  background-color: #f5f7fa;
}
.course-item .course-name {
  font-size: 12px;
  line-height: 30px;
  text-indent: 16px;
  display: inline-block;
  width: calc(100% - 30px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.left .course-item .chenggong {
  font-size: 14px;
  line-height: 30px;
  color: #03BFEE;
  float: right;
  vertical-align: top;
}
.left .active {
  background-color: #f5f7fa;
  color: #03BFEE;
  font-weight: bold;
}
.projects-area .right {
  padding-left: 24px;
  padding-right: 10px;
  float: left;
  width: calc(100% - 224px);
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
/*.right .project-name {*/
  /*color: #000;*/
  /*!*box-shadow: inset 0 -1px 0 0 #EBEBEB;*!*/
  /*font-size: 16px;*/
  /*line-height: 24px;*/
  /*padding-bottom: 16px;*/
/*}*/
/*.right .project-row,*/
/*.right .item-title {*/
  /*box-shadow: inset 0 -1px 0 0 #EBEBEB;*/
  /*white-space: nowrap;*/
  /*font-size: 0;*/
/*}*/
/*.right .project-row .col {*/
  /*display: inline-block;*/
  /*font-size: 12px;*/
  /*vertical-align: middle;*/
  /*box-sizing: border-box;*/
  /*padding-right: 24px;*/
  /*padding-top: 16px;*/
  /*padding-bottom: 16px;*/
/*}*/
/*.right .item-title .col {*/
  /*display: inline-block;*/
  /*font-size: 12px;*/
  /*vertical-align: middle;*/
  /*box-sizing: border-box;*/
  /*padding-right: 24px;*/
  /*padding: 0;*/
/*}*/
/*.col1 {*/
  /*width: 18%;*/
/*}*/
/*.col2 {*/
  /*width: 21%;*/
/*}*/
/*.col3 {*/
  /*position: relative;*/
  /*width: 31.5%;*/
/*}*/
/*.col3 > i {*/
  /*position: absolute;*/
  /*right: 33px;*/
  /*top: 50%;*/
  /*transform: translateY(-50%);*/
  /*background-color: #fff;*/
/*}*/
/*.col3 .loading {*/
  /*vertical-align: middle;*/
  /*font-size: 16px;*/
  /*margin-top: -8px;*/
/*}*/
/*.col3 .chenggong {*/
  /*color: #03BFEE;*/
  /*font-size: 14px;*/
/*}*/
/*.col3 .chahao {*/
  /*color: #FA476F;*/
/*}*/
/*.col3-success {*/
  /*position: relative;*/
/*}*/
/*.col3-success .editing-icon {*/
  /*position: absolute;*/
  /*top: calc(50% - 20px);*/
  /*right: 8px;*/
  /*height: 40px;*/
  /*width: 20px;*/
  /*text-align: center;*/
  /*cursor: pointer;*/
/*}*/
/*.col3-success .editing-icon i {*/
  /*font-size: 12px;*/
  /*line-height: 40px;*/
/*}*/
/*.col3-success em {*/
  /*font-style: normal;*/
  /*line-height: 18px;*/
  /*display: block;*/
/*}*/
/*.col4 {*/
  /*width: 21%;*/
/*}*/
/*.col5 {*/
  /*width: 8.5%;*/
/*}*/
/*.projects-area .right .item-title {*/
  /*height: 40px;*/
  /*line-height: 40px;*/
  /*font-size: 0px;*/
  /*font-weight: bold;*/
/*}*/
/*.item-title .col {*/
  /*white-space: nowrap;*/
/*}*/
/*.right .col4 p {*/
  /*line-height: 18px;*/
/*}*/
/*.right .project-row .positive-red {*/
  /*white-space: normal;*/
  /*color: #FA476F;*/
/*}*/
/*.right .col4 .positive-select {*/
  /*float: right;*/
  /*cursor: pointer;*/
/*}*/
/*.positive-select i {*/
  /*font-size: 12px;*/
/*}*/
/*.right .summary {*/
  /*padding-top: 24px;*/
/*}*/
/*.right .summary h4 {*/
  /*font-size: 16px;*/
  /*line-height: 24px;*/
  /*margin-bottom: 16px;*/
/*}*/
/*.summary-btn-wrap {*/
  /*padding-bottom: 20px;*/
  /*padding-bottom: 300px;*/
/*}*/
/*.summary-btn-wrap:after {*/
  /*content: '';*/
  /*display: block;*/
  /*clear: both;*/
/*}*/
/*.summary .summary-btn {*/
  /*float: right;*/
  /*margin-top: 16px;*/
  /*margin-right: 8px;*/
  /*border: 1px solid #D9D9D9;*/
  /*border-radius: 2px;*/
  /*line-height: 28px;*/
  /*padding: 0 16px;*/
  /*cursor: pointer;*/
/*}*/
/*.summary-btn:hover {*/
  /*border-color: #03BFEE;*/
  /*color: #03BFEE;*/
/*}*/
/*.summary-btn-wrap .summary-btn:last-of-type(1) {*/
  /*margin-right: 0;*/
/*}*/
.bottom-wrap {
  position: absolute;
  top: 24px;
  right: 24px;
}
.bottom-wrap .submit-btn {
  float: right;
  width: 80px;
  height: 30px;
  border-radius: 2px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  cursor: pointer;
}
.submit-btn:hover {
  background: linear-gradient(45deg, #1DE9B6 0%, #03BFEE 50%);
}
/*.bottom-wrap .preview-btn {*/
.preview-btn {
  float: right;
  width: 54px;
  height: 28px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  margin-right: 12px;
  background-color: #fff;
}
.preview-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.exportBUtton{
  position: fixed;
  top:30px;
  width: 1118px;
  margin: 0 auto;
  text-align: right;
}
/*.edit-block {*/
  /*position: relative;*/
/*}*/
/*.edit-block .preview-btn {*/
  /*position: absolute;*/
  /*top: 0px;*/
  /*right: 0;*/
  /*margin-right: 0;*/
/*}*/

/*.editable-label span {*/
  /*display: inline-block;*/
  /*font-size: 14px;*/
  /*color: rgba(0,0,0,0.75);*/
  /*background: #FFFFFF;*/
  /*border: 1px solid #03BFEE;*/
  /*border-radius: 2px;*/
  /*padding-left: 8px;*/
  /*padding-right: 8px;*/
  /*height: 37px;*/
  /*line-height: 37px;*/
  /*box-sizing: border-box;*/
/*}*/
/*.editable-label i {*/
  /*width: 28px;*/
  /*height: 28px;*/
  /*line-height: 28px;*/
  /*text-align: center;*/
/*}*/
/*.display .edit-icon-wrap {*/
  /*vertical-align: top;*/
  /*margin-top: 3px;*/
/*}*/
/*.edit-icon-wrap {*/
  /*display: inline-block;*/
  /*background: #FFFFFF;*/
  /*border: 1px solid rgba(0,0,0,0.08);*/
  /*box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);*/
  /*box-sizing: border-box;*/
/*}*/
/*.editing {*/
  /*padding-right: 62px;*/
  /*position: relative;*/
  /*height: 37px;*/
/*}*/
/*.editing i {*/
  /*color: #03BFEE;*/
/*}*/
/*.editing .edit-icon-wrap {*/
  /*position: absolute;*/
  /*right: 3px;*/
  /*top: 3px;*/
/*}*/
/*.el-icon-check {*/
  /*position: relative;*/
  /*margin-right: 1px;*/
/*}*/
/*.el-icon-check:after {*/
  /*content: '';*/
  /*width: 1px;*/
  /*height: 12px;*/
  /*background: #E3E3E5;*/
  /*position: absolute;*/
  /*display: block;*/
  /*top: 7px;*/
  /*right: -1px;*/
/*}*/
/*.editable-label span:after {*/
  /*content: "\E61C";*/
/*}*/
</style>
