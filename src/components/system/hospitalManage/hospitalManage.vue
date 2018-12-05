<template>
<div class="hospital-manage-wrap">
  <div class="hospital-manage-inner-wrap">
    <div class="left-wrap">
      <div class="top-template">
        <h3>模板</h3>
        <div class="indicator-store active" ref="hospitalItem0" @click="selectHospital($event, 0, '0000')">指标库管理</div>
      </div>
      <div class="bottom-hospital">
        <h3 class="check-organization-title">
          <span class="check-organization-text">检查机构</span>
          <span class="add-organization" @click="editHospital(0)">新增机构</span>
        </h3>
        <div class="search-hospital">
          <input type="text" placeholder="请输入编号/医院名称" v-model="searchHospital" />
          <i class="el-icon-search"></i>
        </div>
        <ul class="hospital-list-wrap">
        	<li class="hospital-item" v-for="(item, index) in hospitalListData" :ref="'hospitalItem' + (index + 1)" @click="selectHospital($event, index+1, item.code)">
        	  <span class="hospital-name" :title="item.name">{{item.code}}-{{item.name}}</span>
        	  <i class="iconfont icon-shanchuicon" @click.stop="checkDeleteHospital(item)"></i>
        	  <i class="iconfont icon-bianjiIcon" @click.stop="editHospital(1, item)"></i>
        	</li>
        </ul>
      </div>
    </div>
    <div class="right-wrap" v-loading="isLoading">
      <div class="right-inner-wrap">
        <h2 class="check-store-title">
          <span class="check-store-text">{{currentSelectedHospitalName}}-检查项目</span>
          <span 
           class="add-item-btn" 
           @click="editBaseCourse(0)" 
           v-if="isBase">
            <i class="el-icon-circle-plus-outline"></i>新增科目
          </span>
          <span 
            class="add-item-btn"
            @click="openProjectSelect"
            v-else>
            <i class="el-icon-circle-plus-outline"></i>添加检查项
          </span>
        </h2>
        <div class="check-store-wrap" ref="checkStoreWrap">
          <ul ref="checkStoreUl">
         	<li v-for="(item,ind) in courseListData" class="check-store-li">
         	  <div class="check-course-title" @click="courseTitleClickFn(ind)">
         	    <i class="grey-arrow el-icon-arrow-right"></i>
         	    <i class="course-icon iconfont" :class="[item.iconUrl, {'ie-color': isIE}]"></i>
         	    <span class="check-course-text">{{item.courseCode}}-{{item.courseName}}</span>
         	    <div class="course-operate">
         	      <i class="iconfont icon-tianjiaIcon" @click.stop="openEditReference('add', item)" v-if="currentSelectedHospitalCode === '0000'"></i>
         	      <i class="iconfont icon-bianjiIcon" @click.stop="editBaseCourse(1, item)"></i>
         	      <i class="iconfont icon-shanchuicon" @click.stop="judgeDeleteWay(item)"></i>
         	      <span v-if="currentSelectedHospitalCode !== '0000'">
         	        <i class="iconfont icon-xiangshangjiantou" @click.stop="upMoveCourseFn(ind)"></i>
         	      </span>
         	      <span v-if="currentSelectedHospitalCode !== '0000'">
         	        <i class="iconfont icon-xiangxiajiantou" @click.stop="downMoveCourseFn(ind)"></i>
         	      </span>
         	    </div>
         	  </div>
         	  <div class="check-item-wrap">
       	      <div class="check-item-row no-padding-row">
       	        <div class="check-item-col1">
       	          <p class="col-title">项目名称</p>
       	        </div>
       	        <div class="check-item-col2">
         	        <div class="check-item-col2-inner1">
         	          <p class="col-title">参考值</p>
         	        </div>
         	        <div class="check-item-col2-inner2">
         	          <p class="col-title">单位</p>
         	        </div>
       	        </div>
       	        <div class="check-item-col3">
       	          <p class="col-title">操作</p>
     	          </div>
       	      </div>
       	      <div class="check-item-row" v-for="(subItem, index) in item.projectDetails">
                <div class="check-item-col1">
                  <p class="col-content">{{subItem.projectCode}}-{{subItem.projectName}}</p>
                </div>
                <div class="check-item-col2">
                  <div v-for="grandItem in subItem.references">
                    <div class="check-item-col2-inner1">
                      <p class="col-content">
                        <span >{{grandItem.referenceCode}} {{grandItem.referenceParam.referenceText}}</span>
                      </p>
                    </div>
                    <div class="check-item-col2-inner2">
                      <p class="col-content">{{grandItem.referenceParam.unit}}</p>
                    </div>
                  </div>
                </div>
                <div class="check-item-col3">
                  <p class="col-content">
                    <i class="iconfont icon-bianjiIcon" @click="openEditReference('edit', item, subItem)"></i>
                    <i class="iconfont icon-shanchuicon" @click="judgeDeleteWay(item, subItem)"></i>
                    <i class="iconfont icon-xiangshangjiantou"
                      v-if="currentSelectedHospitalCode!=='0000'"
                      @click.stop="upMoveProjectFn(ind, index)">
                    </i>
                    <i class="iconfont icon-xiangxiajiantou"
                      v-if="currentSelectedHospitalCode!=='0000'"
                      @click.stop="downMoveProjectFn(ind, index)">
                    </i>
                  </p>
                </div>
              </div>
         	  </div>
         	</li>
         </ul>
         <div class="courses-blank-tip" v-if="courseListData.length === 0">
           <p v-if="currentSelectedHospitalCode !== '0000'">暂无内容，现在 <span @click="openProjectSelect">添加检查项？</span></p>
           <p v-else>暂无内容，现在 <span @click="editBaseCourse(0)">新增科目？</span></p>
         </div>
       </div>
      </div>
    </div>
  </div>
  <!--弹窗部分-->
  <div class="shadow-bg" v-if="isShadow"></div>
  <!--医院名称编辑弹窗-->
  <edit-hospital-dialog 
    v-if="isHospitalEdit" 
    :editHospitalDialogType="editHospitalDialogType" 
    @close-edit="closeEditHospital"
    @save-hospital="saveHospital"
    :hospitalData="editHospitalDialogData">
  </edit-hospital-dialog>
  <!--科目编辑弹窗-->
  <add-course-dialog
    v-if="isCourseEdit" 
    :baseEditCourseDialogType="baseEditCourseDialogType" 
    @close-edit="closeBaseEditCourse" 
    :baseCourseData="baseCourseData">
  </add-course-dialog>
  <!--项目选择树结构弹窗-->
  <select-project-dialog
    v-if="isProjectSelect" 
    :hospitalCode="currentSelectedHospitalCode" 
    @close-select="closeProjectSelect">
  </select-project-dialog>
  <!--项目编辑弹窗-->
  <edit-reference-dialog
    v-if="isEditReference" 
    :editReferencesData="editReferencesData" 
    :editReferencesDialogType="editReferencesDialogType" 
    @close-edit="closeEditReference">
  </edit-reference-dialog>
</div>
</template>

<script>
import HospitalManageApi from '@/fetch/report/hospitalManage'
import * as tool from '@/util/tool'

import editHospitalDialog from '@/components/system/hospitalManage/editHospitalDialog'
import addCourseDialog from '@/components/system/hospitalManage/addCourseDialog'
import selectProjectDialog from '@/components/system/hospitalManage/selectProjectDialog'
import editReferenceDialog from '@/components/system/hospitalManage/editReferenceDialog'

export default {
  name: 'HospitalManage',
  components: {
    editHospitalDialog,
    addCourseDialog,
    selectProjectDialog,
    editReferenceDialog
  },
  data () {
    return {
      // IE浏览器渐变色文字样式兼容性
      isIE: false,
      // right-wrap的loading
      isLoading: false,
      // 左侧医院
      isBase: true,
      searchHospital: null,
      hospitalListData: null,
      hospitalListDataAll: null,
      currentSelectedHospitalCode: '0000',
      // 医院编辑弹窗
      isShadow: false,
      isHospitalEdit: false,
      editHospitalDialogType: 0,
      editHospitalDialogData: null,
      // 右侧科目
      courseListData: [],
      // 模板科目编辑弹窗
      isCourseEdit: false,
      baseEditCourseDialogType: 0,
      baseCourseData: null,
      // 项目树弹窗
      isProjectSelect: false,
      // 参考值编辑弹窗
      isEditReference: false,
      editReferencesDialogType: 0,
      editReferencesData: null
    }
  },
  computed: {
    currentSelectedHospitalName () {
      if (this.hospitalListDataAll) {
        for (let i = 0; i < this.hospitalListDataAll.length; i++) {
          if (this.hospitalListDataAll[i].code === this.currentSelectedHospitalCode) {
            return this.hospitalListDataAll[i].name
          }
        }
      }
      return '指标库管理'
    }
  },
  mounted () {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      this.isIE = true
    }
    this.getHospitalList()
    this.getCourseList('0000')
    // 前端埋点
    window.Countly.track_pageview('管理平台——机构管理页')
  },
  watch: {
    searchHospital () {
      this.searchHospitalFn()
    }
  },
  methods: {
    getHospitalList () {
      HospitalManageApi.getHospitalList()
        .then(res => {
          if (res.code === 'success') {
            res.data.sort((a, b) => {
              return a.code - b.code
            })
            this.hospitalListData = res.data
            this.hospitalListDataAll = res.data
          }
        })
        .catch(() => {
        })
    },
    // 选中该医院，清空其他医院身上的active
    selectHospital (event, index, hospitalCode) {
      this.isLoading = true
      let len = this.hospitalListData.length
      for (let i = 0; i <= len; i++) {
        if (Object.prototype.toString.call(this.$refs['hospitalItem' + i]) === '[object Array]') {
          this.removeActiveClass(this.$refs['hospitalItem' + i][0])
        } else {
          this.removeActiveClass(this.$refs['hospitalItem' + i])
        }
      }
      if (Object.prototype.toString.call(this.$refs['hospitalItem' + index]) === '[object Array]') {
        this.$refs['hospitalItem' + index][0].className += ' active'
      } else {
        this.$refs['hospitalItem' + index].className += ' active'
      }
      // 标记点击了模板库
      if (index === 0) {
        this.isBase = true
      } else {
        this.isBase = false
      }
      this.currentSelectedHospitalCode = hospitalCode
      this.getCourseList(hospitalCode)
    },
    removeActiveClass (element) {
      let className = element.className
      let reg = / active/g
      if (reg.test(className)) {
        element.className = className.replace(reg, function () {
          return ''
        })
      }
    },
    // 搜索医院
    searchHospitalFn () {
      let searchContent = this.searchHospital
      if (searchContent === '') {
        this.hospitalListData = this.hospitalListDataAll
        return
      }
      this.hospitalListData = this.hospitalListDataAll.filter((item) => {
        if (item.code.indexOf(searchContent) !== -1 || item.name.indexOf(searchContent) !== -1) {
          return true
        }
      })
    },
    // 打开增加或编辑医院机构弹窗
    editHospital (type, hospitalItemData) {
      this.editHospitalDialogType = type
      // 新增, type = 0
      if (type === 0) {
        let newCode = this.getNewHospitalCode()
        if (!newCode) {
          tool.toast({
            type: 'warning',
            title: '机构已满，请删除后再添加'
          })
          return
        }
        let newHospitalInfo = {
          'code': newCode,
          'level': '1',
          'id': '',
          'name': ''
        }
        this.editHospitalDialogData = newHospitalInfo
      // 编辑, type = 1
      } else if (type === 1) {
        this.editHospitalDialogData = hospitalItemData
      }
      this.isShadow = true
      this.isHospitalEdit = true
    },
    // 增加机构时计算获得code
    getNewHospitalCode () {
      let code = 1
      for (let i = 0; i < this.hospitalListData.length; i++) {
        if (Number(this.hospitalListData[i].code) === code) {
          code++
        } else {
          break
        }
      }
      if (code > 9999) return undefined
      let codeString = String(code)
      while (codeString.length < 4) {
        codeString = '0' + codeString
      }
      return codeString
    },
    // 保存医院信息
    saveHospital (hospitalInfo) {
      HospitalManageApi.editHospital(hospitalInfo.id, hospitalInfo.code, hospitalInfo.name, hospitalInfo.level)
        .then(res => {
          if (res.code === 'success') {
            tool.toast({
              type: 'success',
              title: '保存成功'
            })
            this.getHospitalList()
            this.closeEditHospital()
          }
        })
        .catch(() => {
          tool.toast({
            type: 'error',
            title: '保存失败'
          })
          this.closeEditHospital()
        })
    },
    closeEditHospital () {
      this.isShadow = false
      this.isHospitalEdit = false
    },
    // 校验，删除医院功能
    checkDeleteHospital (hospitalInfo) {
      HospitalManageApi.checkDeleteHospital(hospitalInfo.id, hospitalInfo.code)
        .then((res) => {
          if (res.data) {
            this.deleteHospital(hospitalInfo)
          } else {
            tool.toast({
              type: 'warning',
              title: '机构下有检查项目未删除，不可删除'
            })
          }
        })
        .catch(() => {})
    },
    async deleteHospital (hospitalInfo) {
      await this.$store.dispatch('checkSure', {title: '你确定要删除 ' + hospitalInfo.name + ' 吗?', msg: '删除后不可修复，确认删除该机构吗？'})
      HospitalManageApi.deleteHospital(hospitalInfo.id, hospitalInfo.code)
        .then(res => {
          if (res.code === 'success') {
            tool.toast({
              type: 'success',
              title: '删除成功'
            })
            this.getHospitalList()
          }
        })
        .catch(() => {
          tool.toast({
            type: 'error',
            title: '删除失败'
          })
        })
    },
    // 点击选中医院后获取右侧科目项目信息
    getCourseList (hospitalCode, callback) {
      HospitalManageApi.getCourseList(hospitalCode)
        .then(res => {
          if (res.code === 'success') {
            let data = JSON.parse(JSON.stringify(res.data))
            for (let i = 0; i < data.courseList.length; i++) {
              let course = data.courseList[i]
              if (course.projectDetails === null) course.projectDetails = []
              for (let j = 0; j < course.projectDetails.length; j++) {
                let project = course.projectDetails[j]
                if (project.references === null) {
                  project.references = []
                }
                for (let k = 0; k < project.references.length; k++) {
                  let reference = project.references[k]
                  if (reference.referenceParam === null || reference.referenceParam === 'null') {
                    let obj = {
                      'unit': null,
                      'referenceType': null,
                      'referenceValue': null,
                      'referenceText': null,
                      'decimalsPlace': null,
                      'referenceCharType': null
                    }
                    reference.referenceParam = obj
                  } else {
                    let referenceParam = JSON.parse(reference.referenceParam)
                    if (referenceParam.referenceType === '0') {
                      referenceParam.referenceText = tool.referenceValueFormat(referenceParam.referenceValue)
                    } else {
                      referenceParam.referenceText = referenceParam.referenceValue
                    }
                    reference.referenceParam = referenceParam
                  }
                }
              }
            }
            this.isLoading = false
            this.courseListData = data.courseList
            this.$nextTick(() => {
              if (typeof callback === 'function') {
                callback()
              }
            })
          }
        })
        .catch(() => {
        })
    },
    // 打开或编辑科目
    editBaseCourse (type, courseInfo) {
      this.baseEditCourseDialogType = type
      if (type === 0) {
        // 新增
        this.baseCourseData = {
          'courseCode': '',
          'courseName': '',
          'iconUrl': '',
          'hospitalCode': this.currentSelectedHospitalCode,
          'courseGender': '-1'
        }
      } else if (type === 1) {
        // 编辑
        this.baseCourseData = {
          'courseCode': courseInfo.courseCode,
          'courseName': courseInfo.courseName,
          'iconUrl': courseInfo.iconUrl,
          'hospitalCode': this.currentSelectedHospitalCode,
          'courseGender': courseInfo.courseGender
        }
      }
      this.isShadow = true
      this.isCourseEdit = true
    },
    closeBaseEditCourse (closeWay) {
      // closeWay = 'close'/'saveFinish'
      if (closeWay === 'saveFinish') {
        this.getCourseList(this.currentSelectedHospitalCode, this.scrollToBottomFn)
      }
      this.isShadow = false
      this.isCourseEdit = false
    },
    // 删除科目项目的时候，需要判断是模板还是医院
    judgeDeleteWay (courseInfo, projectInfo) {
      this.isLoading = true
      if (this.currentSelectedHospitalCode === '0000') {
        this.checkBaseDeleteCourse(courseInfo, projectInfo)
      } else {
        this.checkDeleteCourse(courseInfo, projectInfo)
      }
    },
    // 模板科目项目的校验删除与删除
    checkBaseDeleteCourse (courseInfo, projectInfo) {
      let courseCode = courseInfo.courseCode
      let projectCode = projectInfo ? projectInfo.projectCode : ''

      HospitalManageApi.baseCheckDeleteCourse(courseCode, projectCode)
        .then(res => {
          this.isLoading = false
          if (res.data) {
            this.baseDeleteCourse(courseInfo, projectInfo)
          } else {
            let title = projectCode === '' ? '有机构正在使用此科目，不可删除' : '有机构正在使用此项目，不可删除'
            tool.toast({
              type: 'warning',
              title: title
            })
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    async baseDeleteCourse (courseInfo, projectInfo) {
      let projectCode = projectInfo ? projectInfo.projectCode : ''
      let msg = '删除后不可修复，确认删除该科目吗？'
      if (projectCode !== '') {
        msg = '删除后不可修复，确认删除该项目吗？'
      }
      await this.$store.dispatch('checkSure', {title: '你确定要删除 ' + courseInfo.courseName + ' 吗?', msg: msg})
      HospitalManageApi.baseDeleteCourse(courseInfo.courseCode, projectCode)
        .then(res => {
          if (res.code === 'success') {
            tool.toast({
              type: 'success',
              title: '删除成功'
            })
            this.getCourseList('0000')
          }
        })
        .catch(() => {
          tool.toast({
            type: 'error',
            title: '删除失败'
          })
        })
    },
    // 非模板科目项目的校验删除与删除
    checkDeleteCourse (courseInfo, projectInfo) {
      let hospitalCode = this.currentSelectedHospitalCode
      let courseCode = courseInfo.courseCode
      let projectCode = projectInfo ? projectInfo.projectCode : ''

      HospitalManageApi.checkDeletCourse(hospitalCode, courseCode, projectCode)
        .then(res => {
          this.isLoading = false
          if (res.data) {
            this.deleteCourse(courseInfo, projectInfo)
          } else {
            let title = projectCode === '' ? '报告列表或回收站有报告正在使用此科目，不可删除' : '报告列表或回收站有报告正在使用此项目，不可删除'
            tool.toast({
              type: 'warning',
              title: title
            })
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    async deleteCourse (courseInfo, projectInfo) {
      let projectCode = projectInfo ? projectInfo.projectCode : ''
      let title = '你确定要删除 ' + courseInfo.courseName + ' 吗?'
      let msg = '删除后不可修复，确认删除该科目吗？'
      if (projectCode !== '') {
        title = '你确定要删除 ' + projectInfo.projectName + ' 吗?'
        msg = '删除后不可修复，确认删除该项目吗？'
      }
      await this.$store.dispatch('checkSure', {title: title, msg: msg})
      let hospitalCode = this.currentSelectedHospitalCode
      HospitalManageApi.deleteCourse(hospitalCode, courseInfo.courseCode, projectCode)
        .then(res => {
          if (res.code === 'success') {
            tool.toast({
              type: 'success',
              title: '删除成功'
            })
            this.getCourseList(hospitalCode)
          }
        })
        .catch(() => {
          tool.toast({
            type: 'error',
            title: '删除失败'
          })
        })
    },
    // 打开项目选择弹窗
    openProjectSelect () {
      this.isShadow = true
      this.isProjectSelect = true
    },
    closeProjectSelect (closeWay) {
      if (closeWay === 'saveFinish') {
        this.getCourseList(this.currentSelectedHospitalCode, this.scrollToBottomFn)
      }
      this.isShadow = false
      this.isProjectSelect = false
    },
    // 打开参考值编辑弹窗
    openEditReference (openWay, courseInfo, projectInfo) {
      if (openWay === 'add') {
        this.editReferencesDialogType = 0
        let editInfo = {
          'hospitalCode': this.currentSelectedHospitalCode,
          'hospitalName': this.currentSelectedHospitalName,
          'courseCode': courseInfo.courseCode,
          'courseName': courseInfo.courseName,
          'courseGender': courseInfo.courseGender,
          'projectCode': '',
          'projectName': '',
          'projectGender': courseInfo.courseGender,
          'references': []
        }
        this.editReferencesData = editInfo
      } else if (openWay === 'edit') {
        this.editReferencesDialogType = 1
        let editInfo = {
          'hospitalCode': this.currentSelectedHospitalCode,
          'hospitalName': this.currentSelectedHospitalName,
          'courseCode': courseInfo.courseCode,
          'courseName': courseInfo.courseName,
          'courseGender': courseInfo.courseGender,
          'projectCode': projectInfo.projectCode,
          'projectName': projectInfo.projectName,
          'projectGender': projectInfo.projectGender,
          'references': projectInfo.references
        }
        this.editReferencesData = editInfo
      }
      this.isShadow = true
      this.isEditReference = true
    },
    getHospitalName () {
      for (let i = 0; i < this.hospitalListDataAll.length; i++) {
        if (this.hospitalListDataAll[i].code === this.currentSelectedHospitalCode) {
          return this.hospitalListDataAll[i].name
        }
      }
      return '指标库管理'
    },
    closeEditReference (closeWay) {
      if (closeWay === 'saveFinish') {
        this.getCourseList(this.currentSelectedHospitalCode)
      }
      this.isShadow = false
      this.isEditReference = false
    },
    // 点击展开收回科目操作
    courseTitleClickFn (index) {
      let titles = document.querySelectorAll('.hospital-manage-wrap .check-course-title')
      if (titles[index].className.indexOf('check-course-title-active') === -1) {
        titles[index].className = 'check-course-title check-course-title-active'
      } else {
        titles[index].className = 'check-course-title'
      }
    },
    // 点击上下科目移动箭头，调换位置
    upMoveCourseFn (ind) {
      if (ind === 0) return
      this.exchangeFoldStatue(ind, ind - 1)
      setTimeout(() => {
        let moveCourseArr = this.courseListData.splice(ind, 1)
        this.courseListData.splice(ind - 1, 0, moveCourseArr[0])
        this.courseSortFn()
      }, 100)
    },
    downMoveCourseFn (ind) {
      if (ind === this.courseListData.length - 1) return
      this.exchangeFoldStatue(ind, ind + 1)
      setTimeout(() => {
        let moveCourseArr = this.courseListData.splice(ind, 1)
        this.courseListData.splice(ind + 1, 0, moveCourseArr[0])
        this.courseSortFn()
      }, 100)
    },
    exchangeFoldStatue (i, j) {
      let titles = document.querySelectorAll('.hospital-manage-wrap .check-course-title')
      titles[i].className = 'check-course-title'
      titles[j].className = 'check-course-title'
    },
    // 保存course排序
    courseSortFn () {
      let courseSortList = []
      let len = this.courseListData.length
      this.courseListData.forEach((course, i) => {
        courseSortList.push({
          'courseCode': course.courseCode,
          'courseSort': len - i
        })
      })
      HospitalManageApi.courseSort(this.currentSelectedHospitalCode, JSON.stringify(courseSortList))
        .then(res => {
        })
        .catch(() => {})
    },
    // 点击上下项目移动箭头
    upMoveProjectFn (courseIndex, projectIndex) {
      let moveProjectArr = this.courseListData[courseIndex].projectDetails.splice(projectIndex, 1)
      this.courseListData[courseIndex].projectDetails.splice(projectIndex - 1, 0, moveProjectArr[0])
      this.projectSortFn(courseIndex)
    },
    downMoveProjectFn (courseIndex, projectIndex) {
      let moveProjectArr = this.courseListData[courseIndex].projectDetails.splice(projectIndex, 1)
      this.courseListData[courseIndex].projectDetails.splice(projectIndex + 1, 0, moveProjectArr[0])
      this.projectSortFn(courseIndex)
    },
    // 保存项目排序
    projectSortFn (courseIndex) {
      let projectSortList = []
      let courseCode = this.courseListData[courseIndex].courseCode
      let projectDetails = this.courseListData[courseIndex].projectDetails
      let len = projectDetails.length
      projectDetails.forEach((project, i) => {
        projectSortList.push({
          'courseCode': courseCode,
          'projectCode': project.projectCode,
          'projectSort': len - i
        })
      })
      HospitalManageApi.projectSort(this.currentSelectedHospitalCode, JSON.stringify(projectSortList))
        .then(res => {
        })
        .catch(() => {})
    },
    // 新增科目后滚动到底部
    scrollToBottomFn () {
      let wrapHeight = this.$refs.checkStoreWrap.clientHeight
      let ulHeight = this.$refs.checkStoreUl.clientHeight
      if (ulHeight - wrapHeight > 0) {
        this.$refs.checkStoreWrap.scrollTop = ulHeight - wrapHeight + 40
      }
    },
    sortFn () {
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}
.hospital-manage-wrap {
  padding: 24px 24px 15px;
  height: calc(100% - 39px);
  background-color: #fff;
  font-size: 12px;
  overflow-x: scroll;
}
.hospital-manage-inner-wrap {
  min-width: 900px;
  height: 100%;
}
.left-wrap {
  width: 17.73%;
  height: 100%;
  float: left;
  box-shadow: inset -1px 0 0 0 #F5F5F5;
  line-height: 30px;
  box-sizing: border-box;
  padding-right: 16px;
}
.top-template {
  margin-bottom: 32px;
}
.top-template h3 {
  font-size: 14px;
  color: #515152;
  margin-bottom: 8px;
  text-indent: 1px;
}
.indicator-store {
  cursor: pointer;
  text-indent: 10px;
}
.check-organization-title {
  margin-bottom: 8px;
}
.check-organization-title .check-organization-text {
  color: #515152;
  font-size: 14px;
}
.add-organization {
  float: right;
  font-size: 12px;
  font-weight: normal;
  color: #03BFEE;
  cursor: pointer;
}
.search-hospital {
  position: relative;
}
.search-hospital input {
  border-radius: 3px;
  border: 1px solid #DEDEDE;
  height: 28px;
  width: 100%;
  font-size: 12px;
  line-height: 28px;
  text-indent: 8px;
}
.search-hospital i {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 16px;
  line-height: 30px;
  padding: 0 8px;
}
.hospital-list-wrap {
  padding-top: 8px;
  color: #515152;
}
.hospital-item {
  height: 30px;
  overflow: hidden;
}
.hospital-list-wrap .hospital-item .hospital-name {
  cursor: pointer;
  font-size: 12px;
  display: inline-block;
  width: calc(100% - 35px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-indent: 10px;
} 
.hospital-list-wrap .hospital-item i {
  cursor: pointer;
  font-size: 12px;
  float: right;
  display: none;
  font-weight: normal;
  color: #515152;
}
.hospital-list-wrap .hospital-item:hover i {
  display: inline-block;
}
.hospital-list-wrap .hospital-item .icon-bianjiIcon {
  margin-right: 8px;
}
.hospital-manage-wrap .left-wrap .active {
  background-color: #EAF4FD;
  color: #03BFEE;
  font-weight: bold;
}
.right-wrap {
  width: 82.27%;
  height: 100%;
  float: left;
}
.right-inner-wrap {
  padding-left: 24px;
  height: 100%;
}
.check-store-title {
  position: relative;
  padding-bottom: 27px;
  border-bottom: 1px solid #EBEBEB;
}
.check-store-title .check-store-text {
  font-size: 16px;
  line-height: 24px;
  color: #515152;
}
.check-store-title .add-item-btn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  padding: 0 16px;
  cursor: pointer;
}
.check-store-wrap {
  height: calc(100% - 52px);
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
}
.check-course-title {
  box-shadow: inset 0 -1px 0 0 #EBEBEB;
  position: relative;
  font-size: 0;
  cursor: pointer;
}
.check-course-title .grey-arrow {
  font-size: 12px;
  color: #D8D8D8;
  vertical-align: middle;
  transform: rotate(0);
  transition: .3s linear;
}
.check-course-title .course-icon {
  font-size: 28px;
  vertical-align: middle;
  margin-left: 14px;
  background-image: -webkit-gradient(linear, 0 0, right bottom, from(#03BFEE), to(#1DE9B6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.check-course-title .ie-color {
  color: #03BFEE;
}
.check-course-title .check-course-text {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  color: #000;
  line-height: 40px;
  font-weight: bold;
  margin-left: 13px;
}
.course-operate {
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: calc(83.7% + 32px);
}
.course-operate i {
  display: inline-block;
  margin-right: 17px;
  font-size: 12px;
  line-height: 40px;
  cursor: pointer;
}
.course-operate span {
  display: inline-block;
  width: 12px;
  margin-right: 17px;
}
.course-operate span:nth-last-of-type(1) {
  margin-right: 0;
}
.check-store-title .add-item-btn i {
  display: inline-block;
  margin-right: 8px;
}
.check-item-wrap {
  background-color: #F7F7F9;
  color: rgba(0,0,0,0.85);
  box-shadow: inset 0 -1px 0 0 #EBEBEB;
  max-height: 0;
  overflow: hidden;
  transition: .1s linear;
}
.check-course-title-active .grey-arrow {
  transform: rotate(90deg);
}
.check-course-title-active+.check-item-wrap {
  max-height: 99999px;
}
.check-item-row {
  width: 100%;
  padding: 9px 0px;
}
.check-item-wrap .no-padding-row {
  padding: 0;
}
.check-item-row:after {
  content: '';
  display: block;
  clear: both;
}
.check-item-row > div {
  float: left;
  min-height: 26px;
}
.check-item-col1 {
  width: 19.91%;
}
.check-item-col2 {
  width: 63.77%
}
.check-item-col2 > div:after {
  content: '';
  display: block;
  clear: both;
}
.check-item-col2-inner1 {
  float: left;
  width: 74.67%;
}
.check-item-col2-inner2 {
  float: left;
  width: 25.33%;
}
.check-item-col3 {
  width: 16.3%;
}
.check-item-col3 .col-content {
  white-space: nowrap;
}
.col-title {
  padding-left: 32px;
  line-height: 40px;
  font-weight: bold;
}
.col-content {
  padding-left: 32px;
  line-height: 18px;
  min-height: 26px;
}
.col-content span {
  display: block;
  line-height: 18px;
  margin-bottom: 8px;
}
.check-item-col3 i {
  display: inline-block;
  font-size: 12px;
  margin-right: 13px;
  cursor: pointer;
}
.courses-blank-tip {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #8E8E8F;
}
.courses-blank-tip span {
   color: #03BFEE;
   font-weight: bold;
   cursor: pointer;
}
/*弹窗背景遮罩*/
.shadow-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 90;
}
</style>
