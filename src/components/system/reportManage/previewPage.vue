<template>
<div class="preview-page-wrap" @click.stop="closePreview">
  <div class="page-content"
    @click.stop=""
    v-loading.lock="isLoading"
    element-loading-text="加载中...">
    <div class="close-icon" @click.stop="closePreview"><i class="iconfont icon-biaoqian_guanbihover"></i></div>
    <header class="top-info">
      <span>报告编号: <strong>{{reportBaseInfo.hospitalCode}}-{{reportBaseInfo.empNo}}-{{reportBaseInfo.checkupTime}}</strong></span>
      <span>体检时间: <strong>{{reportBaseInfo.checkupTime}}</strong></span>
      <span>会员工号: <strong>{{reportBaseInfo.empNo}}</strong></span>
      <span>会员岗级: <strong>{{reportBaseInfo.grade}}岗</strong></span>
      <span>体检年龄: <strong>{{reportBaseInfo.staffAge}}岁</strong></span>
      <span>性别: <strong>{{genderText}}</strong></span>
    </header>
    <h2 class="big-title">
      <p class="hospital-name">{{reportBaseInfo.hospitalName}}</p>
      <p class="owner">{{reportBaseInfo.empName}}的体检报告</p>
    </h2>
    <ul class="list">
      <li class="list-item" v-for="course in reportData">
        <h3 class="item-title">
          <i class="course-icon iconfont icon-neike" :class="[{'ie-color': isIE}]"></i>
          <span>{{course.courseName}}</span>
        </h3>
        <div class="item-summary">
          <span>小结：</span>
          <span>{{course.checkupBrief ? course.checkupBrief : '未见明显异常' }}</span>
        </div>
        <div class="item-projects">
          <div class="project-title">
            <span class="col1">项目名称</span>
            <span class="col2">参考值</span>
            <span class="col3">检查结果值</span>
            <span class="col4">阳性指标解读</span>
            <span class="col5">单位</span>
          </div>
          <div class="project-reference" v-for="project in course.projectDetails">
            <span class="col1">{{project.projectCode}}-{{project.projectName}}</span>
            <span class="col2">{{project.referenceText}}</span>
            <span class="col3">
              <em v-for="result,ind in project.result.split('|')">
                {{project.result.split('|').length > 1 ? ind+1+'.' : ''}}{{result}}&nbsp;
                <up-arrow-svg v-if="project.compareValue === '1'"></up-arrow-svg>
                <down-arrow-svg v-if="project.compareValue === '2'"></down-arrow-svg>
              </em>
            </span>
            <span class="col4">
              <em v-for="kpiResult,ind in project.kpiResult.split('|')">
                {{kpiResult}}&nbsp;
              </em>
            </span>
            <span class="col5">{{project.referenceUnit}}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="operationRecordlist" v-if="pageType==='check' || pageType==='recycleCheck'">
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
  </div>
</div>
</template>

<script>
import downArrowSvg from '@/assets/SVG/DownArrowSVG'
import upArrowSvg from '@/assets/SVG/UpArrowSVG'
import reportManageApi from '@/fetch/report/reportManage'
import { referenceValueFormat } from '@/util/tool'
export default {
  name: 'PreviewPage',
  components: {
    downArrowSvg,
    upArrowSvg
  },
  props: ['pageType'],
  data () {
    return {
      isIE: false,
      isLoading: true,
      reportBaseInfo: {},
      reportData: null,
      tableData: []
    }
  },
  computed: {
    reportId () {
      return this.$store.getters.reportId
    },
    reportTypeText () {
      if (this.reportBaseInfo.reportType === '1') {
        return '体检报告'
      } else if (this.reportBaseInfo.reportType === '2') {
        return '就诊报告单'
      } else {
        return ''
      }
    },
    genderText () {
      if (this.reportBaseInfo.staffSex === '0') {
        return '男'
      } else if (this.reportBaseInfo.staffSex === '1') {
        return '女'
      } else {
        return ''
      }
    }
  },
  created () {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      this.isIE = true
    }
    this.getReportBaseInfo()
  },
  mounted () {
  },
  methods: {
    // 根据reportId获取报告基础信息
    getReportBaseInfo () {
      reportManageApi.getReportBaseInfo(this.reportId)
        .then(res => {
          this.reportBaseInfo = res.data
          // 获取全部科目和已保存数据
          this.getReportSavedData()
          this.getDateListResult()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 获取报告已保存的结果数据
    getReportSavedData () {
      let status = this.pageType === 'recycleCheck' ? '2' : ''
      reportManageApi.getReportSavedData(this.reportBaseInfo.hospitalCode, this.reportBaseInfo.empNo, this.reportBaseInfo.checkupTime, status)
        .then(res => {
          this.getCourseInfo(res.data)
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 获取全部科目数据
    getCourseInfo (savedData) {
      reportManageApi.getCourseList(this.reportBaseInfo.hospitalCode, this.reportBaseInfo.empNo, this.reportBaseInfo.checkupTime, '')
        .then(res => {
          let hospitalCode = this.reportBaseInfo.hospitalCode
          let courseList = res.data.courseList
          let reportData = []
          for (let i = 0; i < courseList.length; i++) {
            let projectDetails = courseList[i].projectDetails
            let courseCode = courseList[i].courseCode
            let projectDetailsArr = []
            if (projectDetails !== null) {
              for (let j = 0; j < projectDetails.length; j++) {
                let projectCode = projectDetails[j].projectCode
                let comboCode = hospitalCode + '_' + courseCode + '_' + projectCode
                // 如果已保存信息中有该科目，则将该科目存入arr
                if (savedData.hasOwnProperty(comboCode)) {
                  // 在科目-项目树中获取到referenceType，数值型转换
                  let references = projectDetails[j].references
                  let referenceCode = savedData[comboCode].referenceCode
                  let referenceValue
                  for (let m = 0; m < references.length; m++) {
                    if (references[m].referenceCode === referenceCode) {
                      let referenceType = JSON.parse(references[m].referenceParam).referenceType
                      referenceValue = JSON.parse(references[m].referenceParam).referenceValue
                      if (referenceType === '0') {
                        referenceValue = referenceValueFormat(referenceValue)
                      }
                    }
                  }
                  projectDetailsArr.push(Object.assign({}, {'projectName': projectDetails[j].projectName, 'referenceText': referenceValue}, savedData[comboCode]))
                }
              }
            }
            if (projectDetailsArr.length > 0) {
              let courseInfo = {
                courseCode: courseCode,
                courseName: courseList[i].courseName,
                checkupBrief: projectDetailsArr[0].checkupBrief,
                projectDetails: projectDetailsArr
              }
              reportData.push(courseInfo)
            }
          }
          this.isLoading = false
          this.reportData = reportData
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    getDateListResult () {
      reportManageApi.getDateListResult(this.reportBaseInfo.hospitalCode, this.reportBaseInfo.checkupTime, this.reportBaseInfo.empNo)
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
    width: 968px;
    margin: 80px auto;
    position: relative;
    padding: 25px 80px 50px;
    .close-icon {
      position: absolute;
      right:  -12px;
      top: -12px;
      width: 24px;
      height: 24px;
      background-color: #fff;
      border-radius: 50%;
      text-align: center;
      color: $highlight-color;
      line-height: 24px;
      border: 1px solid $border-color;
      cursor: pointer;
    }
  }
}
.top-info {
  border-bottom: 1px solid $border-color;
  padding-bottom: 16px;
  span {
    display: inline-block;
    margin-right: 24px;
  }
}
.big-title {
  margin-top: 80px;
  margin-bottom: 56px;
  text-align: center;
  font-size: 30px;
  line-height: 45px;
  .hospital-name {
    color: #515152;
  }
  .owner {
    font-size: 20px;
    font-weight: normal;
    color: #212122;
  }
}
.list-item {
  list-style: none;
  border-bottom: 1px solid $border-color;
  margin-bottom: 24px;
  .item-title {
    font-size: 16px;
    line-height: 72px;
    box-shadow: inset 0 -2px 0 0 $border-color;
    .course-icon {
      font-size: 24px;
      vertical-align: middle;
      color: transparent;
      background-image: linear-gradient(53deg, #1DE9B6 0%, #03BFEE 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .ie-color {
      color: #03BFEE;
    }
    span {
      display: inline-block;
      text-indent: 8px;
    }
  }
}
.item-summary {
  padding: 16px 48px 24px 48px;
  font-size: 14px;
  line-height: 21px;
  font-weight: bold;
}
.item-projects {
  padding: 0 24px;
  margin-bottom: 24px;
  .project-title {
    background-color: $border-color;
    font-size: 0;
    white-space: nowrap;
    span {
      display: inline-block;
      font-size: 14px;
      line-height: 40px;
      font-weight: bold;
      padding-left: 24px;
      box-sizing: border-box;
    }
  }
  .project-reference {
    box-shadow: inset 0 -1px 0 0 #EBEBEB;
    white-space: nowrap;
    font-size: 0;
    span {
      display: inline-block;
      line-height: 18px;
      padding-left: 24px;
      padding-top: 19px;
      padding-bottom: 16px;
      box-sizing: border-box;
      vertical-align: top;
      white-space: normal;
      font-size: 12px;
      em {
        font-style: normal;
        display: block;
      }
    }
  }
  .project-reference:nth-last-of-type(1) {
    box-shadow: none;
  }
}
.col1 {
  width: 28.7%;
}
.col2 {
  width: 16.3%;
}
.col3 {
  width: 24.8%;
}
.col4 {
  width: 17.8%;
}
.col5 {
  width: 12.4%;
}
.operationRecordlist {
  h3 {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .recordTablelist {
    
  }
}
</style>
