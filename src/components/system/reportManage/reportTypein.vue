<template>
<div class="report-typein-wrap" v-loading.lock="isLoading" :element-loading-text="loadingText">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">报告管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">{{typeInType === 'edit'?'编辑体检报告':'新建体检报告'}}</span>
  </div>
  <div class="bottom-wrap">
    <div class="submit-btn greenBack" @click="submitFn">提交报告</div>
    <div class="preview-btn" @click="previewShowFn">预&nbsp;览</div>
  </div>
  <div class="brief-wrap">
    <p class="brief-line1">
      <span class="name">{{reportBaseInfo.checkupTime}}-{{reportBaseInfo.empName}}的{{reportTypeText}}</span>
      <span class="hospital-name">({{reportBaseInfo.hospitalName}})</span>
    </p>
    <p class="brief-line2">
      <span class="report-code">报告编号：{{reportBaseInfo.hospitalCode}}-{{reportBaseInfo.empNo}}-{{reportBaseInfo.checkupTime}}</span>
      <span class="time">体检时间：{{reportBaseInfo.checkupTime}}</span>
      <span class="empNo">会员工号：{{reportBaseInfo.empNo}}</span>
      <span class="level">会员岗级：{{reportBaseInfo.grade}}岗</span>
      <span class="age">体检年龄：{{reportBaseInfo.staffAge}}岁</span>
      <span class="gender">性别：{{genderText}}</span>
    </p>
  </div>
  <div class="projects-area">
    <div class="left">
      <ul>
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
    <div class="right">
      <h3 class="project-name">{{courseDetail.courseName}}</h3>
      <div class="item-title">
        <span class="col col1">体检项目</span>
        <span class="col col2">参考值</span>
        <span class="col col3">项目结果</span>
        <span class="col col4">阳性指标</span>
        <span class="col col5">单位</span>
      </div>
      <div class="project-row" v-for="(item,index) in courseDetail.projectDetails">
        <span class="col col1">{{item.projectName}}</span>
        <span class="col col2">
          <el-select v-model="selectReferencesCodes[index]" @change="referenceSelectChange(index)">
            <el-option v-for="item in referencesOptions[index]"
              :key="item.id"
              :value="item.referenceCode"
              :label="item.label">
            </el-option>
          </el-select>
        </span>
        <span class="col col3" v-if="projectsResultsStatus[index] !== 'success'">
          <!--数值型-->
          <el-input
            :ref="'input' + index"
            :class="{'fail-red': projectsResultsStatus[index] === 'fail'}"
            v-if="selectReferencesTypes[index] === '0'"
            v-model="projectsResults[index]"
            @blur="resultTypinFinish(index)"
            @change="resultTypeinChange">
          </el-input>
          <!--阴阳性-->
          <el-select
            :ref="'input' + index"
            clearable
            :placeholder="placeHolders[index]"
            v-model="projectsResults[index]"
            v-if="selectReferencesTypes[index] === '1'"
            @blur="yinYangBlurFn(index)"
            @focus="focusFn($event, index)"
            @change="yinyangSelectChange(index)">
            <el-option
              v-for="item in yinyangOptions"
              :key="item.label"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
          <!--文字型-->
          <el-input
            :ref="'input' + index"
            :placeholder="placeHolders[index]"
            v-if="selectReferencesTypes[index] === '2'"
            v-model="projectsResults[index]"
            @focus="focusFn($event, index)"
            @blur="resultTypinFinish(index)"
            @change="resultTypeinChange">
          </el-input>
          <!--图标切换部分-->
          <i class="el-icon-loading loading" v-if="projectsResultsStatus[index] === 'loading'"></i>
          <!--<i class="iconfont icon-chenggongicon chenggong"  v-if="projectsResultsStatus[index] === 'success'"></i>-->
          <i class="iconfont icon-chahao chahao"  v-if="projectsResultsStatus[index] === 'fail'"></i>
        </span>
        <!--col3输入完毕，结果显示部分-->
        <span class="col col3 col3-success"
          v-if="projectsResultsStatus[index] === 'success'"
          @mousemove="colMoveFn(item.projectCode, '3', index)"
          @mouseleave="colLeaveFn">
          <p>
            <em v-for="resultItem,inx in projectsResults[index].split('|')">
              {{projectsResults[index].split('|').length > 1 ? inx+1 + '.' : ''}}{{resultItem}}
            </em>
          </p>
          <span class="editing-icon"
            v-if="currentHoverProjectCode === item.projectCode && hoverColNum == '3'"
            @click.stop="changeProjectsResultsStatus(index)">
            <i class="iconfont icon-bianjiIcon"></i>
          </span>
        </span>
        <span class="col col4"
          @mousemove="colMoveFn(item.projectCode, '4', index)"
          @mouseleave="colLeaveFn">
          <div v-if="kpiResults[index]">
            <p v-for="compareValue, inx in kpiResults[index].compareValue.split('|')">
              <span class="positive-red">
                {{kpiResults[index].kpiResult.split('|')[inx]==='正常' ?' ':kpiResults[index].kpiResult.split('|')[inx]}}&nbsp;
              </span>
              <span
                class="positive-select"
                @click.stop="openSelectPositive(index, inx)"
                v-if="currentHoverProjectCode === item.projectCode && hoverColNum == '4' && kpiResults[index].kpiResult.split('|')[inx]!=='正常'">
                <i class="iconfont icon-bianjiIcon"></i>
              </span>
            </p>
          </div>
        </span>
        <span class="col col5">{{referencesUnits[index]}}</span>
      </div>
      <div class="summary">
        <h4>小结</h4>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          resize="none"
          :autosize="{minRows: 4, maxRows: 100}"
          v-model="textarea"
          @change="hasContentChange = true">
        </el-input>
        <div class="summary-btn-wrap">
          <div class="summary-btn" @click.stop="saveFn">保存填写下个科目</div>
          <div class="summary-btn" @click.stop="renderSummary">快速生成小结</div>
        </div>
      </div>
    </div>
    <select-positive-dialog
      v-if="selectPositiveShow"
      :courseCode="currentSelectedCourseCode"
      :projectCode="currentHoverProjectCode"
      :selectedResultCode="selectedPositiveResultCode"
      @close-select="closeSelectPositive"
      @select-finish="kpiResultChange">
    </select-positive-dialog>
  </div>
  <preview-page @close-preview="previewHideFn" v-if="previewShow" pageType="preview"></preview-page>
</div>
</template>

<script>
import { toast, referenceValueFormat } from '@/util/tool'
import previewPage from './previewPage'
import selectPositiveDialog from './selectPositive'
import reportManageApi from '@/fetch/report/reportManage'
export default {
  name: 'ReportTypein',
  components: {
    previewPage,
    selectPositiveDialog
  },
  data () {
    return {
      // 标记首次编辑，首次编辑保存时传'编辑'行为，再编辑传''，用于日志
      firstEdit: true,
      isLoading: true,
      loadingText: '加载中...',
      // 标记是否内容有改动，有改动则切换科目的时候提醒，无改动直接切换
      hasContentChange: false,
      reportBaseInfo: {},
      // 保存报告已录入信息
      savedData: {},
      currentSelectedCourseCode: '',
      courseList: null,
      courseDetail: {
        courseName: ''
      },
      // 依次存储选取的参考值code
      selectReferencesCodes: [],
      // 依次存储选取的参考值类型，用于结果输入框切换
      selectReferencesTypes: [],
      // 依次存储项目结果，项目结果的状态loading,success,fail
      projectsResults: [],
      projectsResultsStatus: [],
      placeHolders: [],
      // 依次存储阳性指标
      kpiResults: [],
      // 依次存储单位，数值型对应到referenceParam.unit，阴阳文字性''
      referencesUnits: [],
      referencesOptions: null,
      yinyangOptions: [
        { label: '阴性', value: '阴性' },
        { label: '阳性', value: '阳性' },
        { label: '弱阳性', value: '弱阳性' },
        { label: '阳性+', value: '阳性+' },
        { label: '阳性++', value: '阳性++' },
        { label: '阳性+++', value: '阳性+++' },
        { label: '阳性++++', value: '阳性++++' },
        { label: '阳性+++++', value: '阳性+++++' }
      ],
      textarea: '',
      previewShow: false,
      selectPositiveShow: false,
      // 用于传入和悬浮显示编辑符号
      currentHoverProjectCode: '',
      hoverColNum: '',
      // 用于传入已选中的阳性指标resultCode
      selectedPositiveResultCode: '',
      // 用于阳性指标选择完毕时更改kpiResults
      // selectPositiveIndex指kpiResults中的索引
      selectPositiveIndex: 0,
      // selectPositiveKpiResultIndex指kpiResults[i].kpiResult中的索引
      selectPositiveKpiResultIndex: 0
    }
  },
  computed: {
    reportId () {
      return this.$store.getters.reportId
    },
    typeInType () {
      return this.$store.getters.typeInType
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
    },
    selectPositiveCode () {
      return [this.currentSelectedCourseCode, this.currentHoverProjectCode]
    }
  },
  created () {
    this.getReportBaseInfo()
  },
  mounted () {
    this.firstEdit = true
  },
  methods: {
    // 根据reportId获取报告基础信息
    getReportBaseInfo () {
      reportManageApi.getReportBaseInfo(this.reportId)
        .then(res => {
          this.reportBaseInfo = res.data
          // 获取左侧全部科目
          this.getCourseInfo('')
          this.getReportSavedData()
        })
        .catch(() => {})
    },
    // 获取报告已保存的结果数据
    getReportSavedData (callback) {
      this.isLoading = true
      reportManageApi.getReportSavedData(this.reportBaseInfo.hospitalCode, this.reportBaseInfo.empNo, this.reportBaseInfo.checkupTime)
        .then(res => {
          this.savedData = res.data
          this.isLoading = false
          if (callback) {
            callback()
          }
        })
        .catch(() => {})
    },
    // 获取全部科目数据或单一科目的项目信息
    getCourseInfo (courseCode) {
      this.isLoading = true
      reportManageApi.getCourseList(this.reportBaseInfo.hospitalCode, this.reportBaseInfo.empNo, this.reportBaseInfo.checkupTime, courseCode)
        .then(res => {
          if (courseCode === '') {
            this.courseList = res.data.courseList
            this.isLoading = false
            this.currentSelectedCourseCode = this.courseList[0].courseCode
            this.getCourseInfo(this.currentSelectedCourseCode)
          } else {
            // 点击左侧单一科目时的处理
            this.hasContentChange = false
            this.courseDetail = res.data.courseList[0]
            let projectDetails = res.data.courseList[0].projectDetails
            // 查询已保存信息，是否有对应的项目已经录入结果，清除多余状态
            this.initState()
            // 生成参考值的下拉列表二维数组，以及默认参考值数组，默认参考值类型数组
            let referencesOptions = []
            let defaultReferences = []
            let defaultReferencesTypes = []
            let defaultUnits = []
            let defaultPlaceHolders = []
            for (let i = 0; i < projectDetails.length; i++) {
              let references = projectDetails[i].references
              let options = []
              let def = ''
              let referenceType = ''
              let unit = ''
              let placeholder
              if (references !== null) {
                for (let j = 0; j < references.length; j++) {
                  let referenceParam = references[j].referenceParam
                  let singleReference
                  if (referenceParam !== null) {
                    referenceParam = JSON.parse(references[j].referenceParam)
                    // 没有默认参考值的时候，使用第一个参考值为默认。数值型则填上单位，文字形则填上默认placeholder
                    if (j === 0) {
                      def = references[j].referenceCode
                      referenceType = referenceParam.referenceType
                      if (referenceParam.referenceType === '0') {
                        unit = referenceParam.unit
                      } else if (referenceParam.referenceType === '1' || referenceParam.referenceType === '2') {
                        placeholder = referenceParam.referenceValue
                      }
                    }
                    // referenceValue作为选择的label，referenceCode作为选择的value
                    // 数值型的label变化表现形式
                    let label = ''
                    if (referenceParam.referenceType === '0') {
                      label = referenceValueFormat(referenceParam.referenceValue)
                    } else {
                      label = referenceParam.referenceValue
                    }
                    singleReference = {
                      id: references[j].id,
                      label: references[j].referenceCode + '.' + label,
                      referenceCode: references[j].referenceCode,
                      referenceParam: referenceParam
                    }
                    // 有默认参考值则变换为默认值
                    if (referenceParam.hasOwnProperty('defaultFlag') && referenceParam.defaultFlag) {
                      def = references[j].referenceCode
                      referenceType = referenceParam.referenceType
                      if (referenceParam.referenceType === '0') {
                        unit = referenceParam.unit
                      } else if (referenceParam.referenceType === '1' || referenceParam.referenceType === '2') {
                        placeholder = referenceParam.referenceValue
                      }
                    }
                  } else {
                    singleReference = {
                      id: references[j].id,
                      label: '',
                      referenceCode: references[j].referenceCode,
                      referenceParam: null
                    }
                  }
                  options.push(singleReference)
                }
              }
              referencesOptions.push(options)
              defaultReferences.push(def)
              defaultReferencesTypes.push(referenceType)
              defaultUnits.push(unit)
              defaultPlaceHolders.push(placeholder)
            }
            /*
            console.log('整理选项', referencesOptions)
            console.log('整理默认参考值code', defaultReferences)
            console.log('整理默认参考值类型', defaultReferencesTypes)
            console.log('整理默认单位', defaultUnits)
            */
            this.referencesOptions = referencesOptions
            this.selectReferencesCodes = defaultReferences
            this.selectReferencesTypes = defaultReferencesTypes
            this.referencesUnits = defaultUnits
            this.placeHolders = defaultPlaceHolders
            // 根据已保存信息刷新状态
            this.refreshState(res.data.courseList[0])
          }
          this.isLoading = false
        })
        .catch(() => {})
    },
    // 点击左侧course function
    courseClickFn (courseCode) {
      if (courseCode === this.currentSelectedCourseCode) return
      if (this.hasContentChange) {
        this.makeSureDiscard(courseCode)
      } else {
        this.currentSelectedCourseCode = courseCode
        this.getCourseInfo(courseCode)
      }
    },
    async makeSureDiscard (courseCode) {
      await this.$store.dispatch('checkSure', {title: '你确定要切换录入科目吗?', msg: '警告：有结果未保存，建议保存后再切换科目。若继续切换，未保存结果将被清空！'})
      this.currentSelectedCourseCode = courseCode
      this.getCourseInfo(courseCode)
    },
    // 清除各种状态
    initState () {
      this.selectReferencesCodes = []
      this.selectReferencesTypes = []
      this.projectsResults = []
      this.projectsResultsStatus = []
      this.placeHolders = []
      this.kpiResults = []
      this.referencesUnits = []
      this.referencesOptions = null
      this.textarea = ''
    },
    // 根据已保存信息，刷新状态
    refreshState (courseList0) {
      let hospitalCode = this.reportBaseInfo.hospitalCode
      let courseCode = courseList0.courseCode
      let queryAttrArr = []
      let projectsList = courseList0.projectDetails
      for (let i = 0; i < projectsList.length; i++) {
        let attr = hospitalCode + '_' + courseCode + '_' + projectsList[i].projectCode
        queryAttrArr.push(attr)
      }
      for (let i = 0; i < queryAttrArr.length; i++) {
        if (this.savedData.hasOwnProperty(queryAttrArr[i])) {
          let info = this.savedData[queryAttrArr[i]]
          this.$set(this.selectReferencesCodes, i, info.referenceCode)
          this.$set(this.selectReferencesTypes, i, this.getReferenceParamContent('referenceType', i))
          this.$set(this.projectsResults, i, info.result)
          this.$set(this.projectsResultsStatus, i, 'success')
          if (this.selectReferencesTypes[i] === '2') {
            this.$set(this.placeHolders, i, this.getReferenceParamContent('referenceValue', i))
          }
          let kpiResultText = ''
          if (['1', '2', '4', '6', '7'].indexOf(info.compareValue) !== -1) {
            kpiResultText = info.kpiResult === null || info.kpiResult === '' ? '暂无阳性指标' : info.kpiResult
          }
          if (info.compareValue.indexOf('|') !== -1) {
            let compareValueArr = info.compareValue.split('|')
            let kpiResultArr = info.kpiResult.split('|')
            for (let i = 0; i < compareValueArr.length; i++) {
              if (['1', '2', '4', '6', '7'].indexOf(compareValueArr[i]) !== -1) {
                kpiResultArr[i] = kpiResultArr[i] ? kpiResultArr[i] : '暂无阳性指标'
              } else {
                kpiResultArr[i] = '正常'
              }
            }
            kpiResultText = kpiResultArr.join('|')
          }
          let kpiResultObj = {
            'compareValue': info.compareValue,
            'kpiResult': kpiResultText,
            'resultCode': info.resultCode
          }
          this.$set(this.kpiResults, i, kpiResultObj)
          this.$set(this.referencesUnits, i, this.getReferenceParamContent('unit', i))
          this.textarea = info.checkupBrief
        }
      }
    },
    // 选取的参考值改变
    referenceSelectChange (index) {
      this.hasContentChange = true
      let currentOptions = this.referencesOptions[index]
      for (let j = 0; j < currentOptions.length; j++) {
        if (currentOptions[j].referenceCode === this.selectReferencesCodes[index]) {
          if (currentOptions[j].referenceParam === null) continue
          this.$set(this.selectReferencesTypes, index, currentOptions[j].referenceParam.referenceType)
          if (currentOptions[j].referenceParam.referenceType === '0') {
            // 切换成数值型
            this.$set(this.referencesUnits, index, currentOptions[j].referenceParam.unit)
          } else if (currentOptions[j].referenceParam.referenceType === '1') {
            // 切换成阴阳型
            this.$set(this.referencesUnits, index, '')
          } else if (currentOptions[j].referenceParam.referenceType === '2') {
            // 切换成文字型
            this.$set(this.placeHolders, index, currentOptions[j].referenceParam.referenceValue)
            this.$set(this.referencesUnits, index, '')
          }
          /*
          console.log('跟踪参考值的类型', this.selectReferencesTypes)
          console.log('跟踪单位变化', this.referencesUnits)
          */
          break
        }
      }
      // 清除项目结果，项目结果状态，阳性指标，小结
      this.$set(this.projectsResults, index, '')
      this.$set(this.projectsResultsStatus, index, '')
      this.$set(this.kpiResults, index, '')
      this.textarea = ''
    },
    // 项目结果文字型、阴阳型输入框获得焦点
    focusFn (ev, index) {
      let placeHolder = ev.target.getAttribute('placeholder')
      if (this.projectsResults[index] === undefined || this.projectsResults[index] === '') {
        this.hasContentChange = true
        this.$set(this.projectsResults, index, placeHolder)
      }
    },
    // 项目结果有变化时，标记hasContentChange
    yinyangSelectChange (index) {
      this.hasContentChange = true
      this.resultTypinFinish(index)
    },
    yinYangBlurFn (index) {
      // 确保清空的时候，延迟获取到的是空的，而不是之前保留的值
      setTimeout(() => {
        this.resultTypinFinish(index)
      }, 100)
    },
    resultTypeinChange () {
      this.hasContentChange = true
    },
    // 项目结果输入失去焦点，输入完毕
    resultTypinFinish (index) {
      // 输入项目结果的状态清除，阳性指标kpiResults[index]清除
      this.$set(this.projectsResultsStatus, index, '')
      this.$set(this.kpiResults, index, '')
      let result = this.projectsResults[index]
      if (result === undefined || result === '') return
      // 如果是数值型，校验并根据位数格式化
      if (this.selectReferencesTypes[index] === '0') {
        let decimalsPlace = this.getReferenceParamContent('decimalsPlace', index)
        result = this.formateNumResult(result, index, decimalsPlace)
        let noLtResult = typeof result === 'string' ? result.split('<').join('') : result
        if (isNaN(noLtResult)) {
          toast({
            type: 'warning',
            title: '结果不合法'
          })
          this.$set(this.projectsResultsStatus, index, 'fail')
          return
        } else {
          this.$set(this.projectsResults, index, result.toString())
        }
      }
      let courseCode = this.courseDetail.courseCode
      let projectCode = this.courseDetail.projectDetails[index].projectCode
      let referenceCode = this.selectReferencesCodes[index]
      let referenceParam
      for (let j = 0; j < this.referencesOptions[index].length; j++) {
        if (this.referencesOptions[index][j].referenceCode === referenceCode) {
          referenceParam = this.referencesOptions[index][j].referenceParam
        }
      }

      this.$set(this.projectsResultsStatus, index, 'loading')
      this.textarea = ''
      reportManageApi.getKpiResult(courseCode, projectCode, JSON.stringify(referenceParam), result.toString().split('<').join(''))
        .then(res => {
          let kpiResultText = ''
          if (['1', '2', '4', '6', '7'].indexOf(res.data.compareValue) !== -1) {
            kpiResultText = res.data.kpiResult ? res.data.kpiResult : '暂无阳性指标'
          }
          if (res.data.compareValue.indexOf('|') !== -1) {
            let compareValueArr = res.data.compareValue.split('|')
            let kpiResultArr = res.data.kpiResult.split('|')
            for (let i = 0; i < compareValueArr.length; i++) {
              if (['1', '2', '4', '6', '7'].indexOf(compareValueArr[i]) !== -1) {
                kpiResultArr[i] = kpiResultArr[i] ? kpiResultArr[i] : '暂无阳性指标'
              } else {
                kpiResultArr[i] = '正常'
              }
            }
            kpiResultText = kpiResultArr.join('|')
          }
          let kpiResult = {
            'compareValue': res.data.compareValue,
            'kpiResult': kpiResultText,
            'resultCode': res.data.resultCode
          }
          this.$set(this.kpiResults, index, kpiResult)
          this.$set(this.projectsResultsStatus, index, 'success')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 数值型的格式化
    formateNumResult (result, index, decimalsPlace) {
      if (!isNaN(Number(result))) {
        // 科学计数法，直接返回，否则根据位数格式化
        if (result.indexOf('E') === -1 && result.indexOf('e') === -1) {
          if (decimalsPlace === '0') {
            return parseInt(result)
          } else {
            return parseFloat(result).toFixed(Number(decimalsPlace))
          }
        } else {
          return result
        }
      } else {
        // 输入的结果可能是<5这样的范围，输入这种情况时一律为正常结果
        if (result.indexOf('<') !== -1) {
          let reg = /[^<0-9]/
          if (reg.test(result)) {
            return NaN
          } else {
            return result
          }
        } else {
          return NaN
        }
      }
    },
    // 在col3和col4移动，控制编辑符号的显示隐藏
    colMoveFn (projectCode, hoverColNum, index) {
      this.currentHoverProjectCode = projectCode
      // 如果hover的是col4，则要判断是阳性指标时，才显示
      if (hoverColNum === '4') {
        if (this.kpiResults[index]) {
          let compareValue = this.kpiResults[index].compareValue
          if (['1', '2', '4', '6', '7'].indexOf(compareValue) !== -1 || compareValue.indexOf('|') !== -1) {
            this.hoverColNum = hoverColNum
            return
          }
        }
        this.hoverColNum = ''
        return
      }
      this.hoverColNum = hoverColNum
    },
    colLeaveFn () {
      this.currentHoverProjectCode = ''
      this.hoverColNum = ''
    },
    // 点击项目结果的再编辑icon
    changeProjectsResultsStatus (index) {
      this.$set(this.projectsResultsStatus, index, undefined)
      // 存在可能，原来参考值为男时录入了结果，后来参考值更改为女。结果对应的参考值已经不存在了，此时，点击编辑要清除结果值
      let selectReferenceCode = this.selectReferencesCodes[index]
      let options = this.referencesOptions[index]
      let referencExistFlag = false
      options.forEach((o) => {
        if (o.referenceCode === selectReferenceCode) referencExistFlag = true
      })
      if (referencExistFlag) {
        // 自动获取焦点
        this.$nextTick(() => {
          this.$refs['input' + index][0].focus()
        })
      } else {
        this.projectsResults[index] = undefined
        this.hasContentChange = true
      }
    },
    // 选择阳性指标dialog
    positiveMoveFn (projectCode) {
      this.currentHoverProjectCode = projectCode
    },
    positiveLeaveFn () {
      this.currentHoverProjectCode = ''
    },
    openSelectPositive (index, inx) {
      // index是当前项目索引，inx是当前阳性指标的索引，用于文字型|匹配出来的多个阳性指标
      // '|'分隔的多值时，取单个resultCode
      if (this.kpiResults[index].compareValue.indexOf('|') !== -1) {
        this.selectedPositiveResultCode = this.kpiResults[index].resultCode.split('|')[inx]
      } else {
        this.selectedPositiveResultCode = this.kpiResults[index].resultCode
      }
      this.selectPositiveIndex = index
      this.selectPositiveKpiResultIndex = inx
      this.selectPositiveShow = true
    },
    closeSelectPositive () {
      this.selectPositiveShow = false
    },
    // 手动选择阳性指标后，触发更新
    kpiResultChange (singleKpiResult) {
      this.hasContentChange = true
      let kpiResult = this.kpiResults[this.selectPositiveIndex].kpiResult
      let resultCode = this.kpiResults[this.selectPositiveIndex].resultCode
      // 文字|多样性指标
      if (kpiResult.split('|').length > 1) {
        let kpiResultArr = kpiResult.split('|')
        kpiResultArr[this.selectPositiveKpiResultIndex] = singleKpiResult.kpiResult
        let resultCodeArr = resultCode.split('|')
        resultCodeArr[this.selectPositiveKpiResultIndex] = singleKpiResult.resultCode
        // 更新
        this.$set(this.kpiResults[this.selectPositiveIndex], 'kpiResult', kpiResultArr.join('|'))
        this.$set(this.kpiResults[this.selectPositiveIndex], 'resultCode', resultCodeArr.join('|'))
      } else {
        // 多项目匹配时，匹配到compareValue: '-1'正常，则要区分是数值型\阴阳型\文本型的正常compareValue
        if (singleKpiResult.compareValue === '-1') {
          switch (this.selectReferencesTypes[this.selectPositiveIndex]) {
            case '0':
              singleKpiResult.compareValue = '0'
              break
            case '1':
              singleKpiResult.compareValue = '5'
              break
            case '2':
              singleKpiResult.compareValue = '3'
              break
          }
        }
        this.$set(this.kpiResults[this.selectPositiveIndex], 'compareValue', singleKpiResult.compareValue)
        this.$set(this.kpiResults[this.selectPositiveIndex], 'kpiResult', singleKpiResult.kpiResult)
        this.$set(this.kpiResults[this.selectPositiveIndex], 'resultCode', singleKpiResult.resultCode)
        // this.$set(this.kpiResults, this.selectPositiveIndex, singleKpiResult)
      }
    },
    // 快速生成小结
    renderSummary () {
      let summaryArr = []
      let summary = ''
      for (let i = 0; i < this.kpiResults.length; i++) {
        if (this.kpiResults[i]) {
          if (this.kpiResults[i].kpiResult !== '暂无阳性指标' && this.kpiResults[i].kpiResult !== '') {
            summaryArr.push(this.kpiResults[i].kpiResult)
          }
        }
      }
      function noRepeatArr (arr) {
        let result = []
        for (let i = 0; i < arr.length; i++) {
          if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i])
          }
        }
        return result
      }
      summaryArr = noRepeatArr(summaryArr)
      summary = summaryArr.join('，')
      // 文字多值匹配情况，恶心
      summary = summary.split('|暂无阳性指标').join('')
      summary = summary.split('暂无阳性指标|').join('')
      summary = summary.split('|正常').join('')
      summary = summary.split('正常|').join('')
      summary = summary.split('|').join('，')
      if (this.textarea !== summary) {
        this.hasContentChange = true
        this.textarea = summary
      }
    },
    // 预览组件显示消失
    previewShowFn () {
      this.previewShow = true
    },
    previewHideFn () {
      this.previewShow = false
    },
    goReportList () {
      this.$store.dispatch('changeReportPath', 'reportList')
    },
    // 保存当前录入结果
    getReferenceParamContent (content, index) {
      let currentOptions = this.referencesOptions[index]
      for (let j = 0; j < currentOptions.length; j++) {
        if (currentOptions[j].referenceCode === this.selectReferencesCodes[index]) {
          if (content === 'referenceValue') {
            return currentOptions[j].referenceParam.referenceValue
          } else if (content === 'referenceType') {
            return currentOptions[j].referenceParam.referenceType
          } else if (content === 'unit') {
            if (currentOptions[j].referenceParam.hasOwnProperty('unit')) {
              return currentOptions[j].referenceParam.unit
            } else {
              return ''
            }
          } else if (content === 'decimalsPlace') {
            if (currentOptions[j].referenceParam.hasOwnProperty('decimalsPlace')) {
              return currentOptions[j].referenceParam.decimalsPlace
            } else {
              return ''
            }
          }
        }
      }
    },
    // 获取savedData中的rowid
    getRowid (hospitalCode, courseCode, projectCode) {
      let attr = hospitalCode + '_' + courseCode + '_' + projectCode
      if (this.savedData.hasOwnProperty(attr)) {
        return this.savedData[attr].rowid
      } else {
        return ''
      }
    },
    // 保存科目功能
    saveFn (saveWay) {
      if (!this.hasContentChange) {
        this.jumpNextCourse()
        return
      }
      if (this.projectsResultsStatus.indexOf('fail') !== -1) {
        toast({
          type: 'warning',
          title: '存在结果值不合法'
        })
        return
      }
      let hospitalCode = this.reportBaseInfo.hospitalCode
      let courseCode = this.courseDetail.courseCode
      let reportContext = this.firstEdit ? encodeURIComponent('编辑') : ''
      let rd = []
      for (let i = 0; i < this.projectsResults.length; i++) {
        let result = this.projectsResults[i]
        if (result !== '' && result !== undefined) {
          let obj = {
            hospitalCode,
            courseCode,
            projectCode: this.courseDetail.projectDetails[i].projectCode,
            rowid: this.getRowid(hospitalCode, courseCode, this.courseDetail.projectDetails[i].projectCode),
            compareValue: this.kpiResults[i].compareValue,
            result,
            resultCode: this.kpiResults[i].resultCode,
            referenceCode: this.selectReferencesCodes[i],
            referenceValue: this.getReferenceParamContent('referenceValue', i),
            referenceUnit: this.getReferenceParamContent('unit', i),
            checkupBrief: this.textarea,
            overviewId: this.reportBaseInfo.id
          }
          rd.push(obj)
        }
      }
      this.isLoading = true
      reportManageApi.saveReport(hospitalCode, this.reportBaseInfo.id, courseCode, reportContext, rd)
        .then(res => {
          this.firstEdit = false
          toast({
            type: 'success',
            title: '保存成功'
          })
          this.isLoading = false
          if (saveWay === 'leave') {
            this.goReportList()
            return
          }
          // 内容改变标记false，左侧科目存在结果更新，更新已存储数据，跳转下个科目
          this.hasContentChange = false
          for (let i = 0; i < this.courseList.length; i++) {
            if (this.courseList[i].courseCode === this.currentSelectedCourseCode) {
              this.$set(this.courseList[i], 'existProjectResult', true)
            }
          }
          this.getReportSavedData(this.jumpNextCourse)
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 切换到下个科目
    jumpNextCourse () {
      let nextCourseCode = ''
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.courseList[i].courseCode === this.currentSelectedCourseCode) {
          if (i + 1 >= this.courseList.length) {
            return
          } else {
            nextCourseCode = this.courseList[i + 1].courseCode
            break
          }
        }
      }
      this.courseClickFn(nextCourseCode)
    },
    // 提交报告
    submitFn () {
      if (this.hasContentChange) {
        this.saveFn('leave')
      } else {
        this.goReportList()
      }
    }
  }
}
</script>

<style scoped>
.report-typein-wrap {
  padding: 0 24px;
  height: 100%;
  position: relative;
}
.brief-wrap {
  margin-top: 20px;
  padding: 24px 0 24px 24px;
  background-color: #F7F7F9;
  overflow: hidden;
}
.brief-line1 {
  line-height: 36px;
  margin-bottom: 16px;
  white-space: nowrap;
}
.brief-line1 .name {
  display: inline-block;
  margin-right: 106px;
  font-size: 16px;
}
.brief-line1 .hospital-name {
  font-size: 14px;
  display: inline-block;
}
.brief-line2 {
  font-size: 12px;
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
  padding-top: 24px;
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
.right .project-name {
  color: #000;
  box-shadow: inset 0 -1px 0 0 #EBEBEB;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 16px;
}
.right .project-row,
.right .item-title {
  box-shadow: inset 0 -1px 0 0 #EBEBEB;
  white-space: nowrap;
  font-size: 0;
}
.right .project-row .col {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  box-sizing: border-box;
  padding-right: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.right .item-title .col {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  box-sizing: border-box;
  padding-right: 24px;
  padding: 0;
}
.col1 {
  width: 18%;
}
.col2 {
  width: 21%;
}
.col3 {
  position: relative;
  width: 31.5%;
}
.col3 > i {
  position: absolute;
  right: 33px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
}
.col3 .loading {
  vertical-align: middle;
  font-size: 16px;
  margin-top: -8px;
}
.col3 .chenggong {
  color: #03BFEE;
  font-size: 14px;
}
.col3 .chahao {
  color: #FA476F;
}
.col3-success {
  position: relative;
}
.col3-success .editing-icon {
  position: absolute;
  top: calc(50% - 20px);
  right: 8px;
  height: 40px;
  width: 20px;
  text-align: center;
  cursor: pointer;
}
.col3-success .editing-icon i {
  font-size: 12px;
  line-height: 40px;
}
.col3-success em {
  font-style: normal;
  line-height: 18px;
  display: block;
  white-space: normal;
}
.col4 {
  width: 21%;
}
.col5 {
  width: 8.5%;
}
.projects-area .right .item-title {
  height: 40px;
  line-height: 40px;
  font-size: 0px;
  font-weight: bold;
}
.item-title .col {
  white-space: nowrap;
}
.right .col4 p {
  line-height: 18px;
}
.right .project-row .positive-red {
  white-space: normal;
  color: #FA476F;
}
.right .col4 .positive-select {
  float: right;
  cursor: pointer;
}
.positive-select i {
  font-size: 12px;
}
.right .summary {
  padding-top: 24px;
}
.right .summary h4 {
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
}
.summary-btn-wrap {
  padding-bottom: 20px;
  padding-bottom: 300px;
}
.summary-btn-wrap:after {
  content: '';
  display: block;
  clear: both;
}
.summary .summary-btn {
  float: right;
  margin-top: 16px;
  margin-right: 8px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  line-height: 28px;
  padding: 0 16px;
  cursor: pointer;
}
.summary-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.summary-btn-wrap .summary-btn:last-of-type(1) {
  margin-right: 0;
}
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
.bottom-wrap .preview-btn {
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
</style>
