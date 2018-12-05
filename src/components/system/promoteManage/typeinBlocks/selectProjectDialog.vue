<template>
<div class="select-project-dialog-wrap">
  <div class="wrap-inner">
    <h3 class="hsq-dialog-title">
                新增体检项目
      <div class="hsq-btn-close" @click="closeSelect"></div>
    </h3>
    <div class="hsq-dialog-content">
      <div class="hsq-dialog-content-row">
        <el-input
          class="search-input"
          suffix-icon="el-icon-search"
          placeholder="请输入科目/项目名称"
          v-model="filterText"
          >
        </el-input>
      </div>
      <div class="tree-wrap">
        <el-tree
          ref="tree"
          class="project-tree"
          :data="treeData"
          v-loading="!isReady"
          :props="defaultProps"
          node-key="courseCode"
          :default-checked-keys="defaultCheckedProjectKey"
          show-checkbox
          default-expand-all
          :filter-node-method="filterNode"
          >
        </el-tree>
      </div>
    </div>
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="saveNewProject">确定</div>
      <div class="cancel-btn" @click.stop="closeSelect">取消</div>
    </div>
  </div>
</div>
</template>

<script>
import HospitalManageApi from '@/fetch/report/hospitalManage'
import * as tool from '@/util/tool'

export default {
  name: 'SelectProjectDialog',
  props: [ 'hospitalCode', 'reviewList' ],
  data () {
    return {
      filterText: '',
      // 搜索科目的时候，保存父级courseCode
      filterParentCode: [],
      treeData: null,
      unhandledTreeData: null,
      defaultProps: {
        children: 'projectList',
        label: 'courseName'
      },
      // 保存时筛选已存在科目code
      existedCourseKey: [],
      // 存储默认选中置灰的项目
      defaultCheckedProjectKey: [],
      isTreeDataReady: false,
      isSelectedDataReady: false
    }
  },
  computed: {
    isReady: {
      get () {
        return this.isTreeDataReady && this.isSelectedDataReady
      },
      set (newValue) {
        return newValue
      }
    }
  },
  watch: {
    isReady () {
      if (this.isReady) {
        // 处理api请求来的treeData，与已选api得到的数据对照，添加项目disabled属性置灰
        for (let i = 0; i < this.unhandledTreeData.length; i++) {
          let projectList = this.unhandledTreeData[i].projectList
          for (let j = 0; j < projectList.length; j++) {
            if (this.defaultCheckedProjectKey.indexOf(projectList[j].courseCode) !== -1) {
              projectList[j].disabled = true
            }
          }
        }
        // 根据项目添加disabled的情况，反推哪些科目需要添加disabled
        for (let i = 0; i < this.unhandledTreeData.length; i++) {
          let projectList = this.unhandledTreeData[i].projectList
          let flag = true
          // 没有项目的科目需要判断是否存在于existedCourseKey中，有项目的科目根据项目情况推到是否disabled
          if (projectList.length === 0) {
            if (this.existedCourseKey.indexOf(this.unhandledTreeData[i].courseCode) === -1) {
              flag = false
            } else {
              this.unhandledTreeData[i].disabled = true
              this.defaultCheckedProjectKey.push(this.unhandledTreeData[i].courseCode)
//              console.log(this.unhandledTreeData[i])
            }
          } else {
            for (let j = 0; j < projectList.length; j++) {
              if (!projectList[j].hasOwnProperty('disabled') || !projectList[j].disabled) {
                flag = false
                break
              }
            }
          }
          if (flag) this.unhandledTreeData[i].disabled = true
        }
        this.treeData = this.unhandledTreeData
//        console.log(this.treeData, this.existedCourseKey)
      }
    },
    filterText (val) {
      this.filterParentCode = []
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // 获取科目项目树
//      HospitalManageApi.checkProject()
      HospitalManageApi.getCourseList(this.hospitalCode)
        .then((res) => {
          if (res.code !== 'success') return
//          console.log(res)
          let courseList = res.data.courseList
          let treeData = []
          for (let i = 0; i < courseList.length; i++) {
            let obj = {}
            obj.courseCode = courseList[i].courseCode
            obj.courseName = courseList[i].courseName
            obj.courseGender = courseList[i].courseGender
            obj.sort = courseList[i].sort
            obj.projectList = []
            if (courseList[i].projectDetails === null) courseList[i].projectDetails = []
            for (let j = 0; j < courseList[i].projectDetails.length; j++) {
              let childObj = {}
              childObj.courseCode = courseList[i].courseCode + courseList[i].projectDetails[j].projectCode
              childObj.courseName = courseList[i].projectDetails[j].projectName
              childObj.parentCode = courseList[i].courseCode
              childObj.projectGender = courseList[i].projectDetails[j].projectGender
              obj.projectList.push(childObj)
            }
            treeData.push(obj)
          }
          this.unhandledTreeData = treeData
          this.isTreeDataReady = true
        })
        .catch(() => {})
      // 获取已选项目信息
//      HospitalManageApi.selectedCourseProjects(this.hospitalCode)
//        .then((res) => {
//          // 保存已经存在的科目/项目，保存时筛选出去
//          let defaultCheckedProjectKey = []
//          let existedCourseKey = []
//          for (let i = 0; i < res.data.length; i++) {
//            defaultCheckedProjectKey.push(res.data[i].courseCode + res.data[i].projectCode)
//            if (existedCourseKey.indexOf(res.data[i].courseCode) === -1) {
//              existedCourseKey.push(res.data[i].courseCode)
//            }
//          }
//          this.defaultCheckedProjectKey = defaultCheckedProjectKey
//          this.existedCourseKey = existedCourseKey
//          this.isSelectedDataReady = true
//        })
//        .catch(() => {})
      // 将已选的复查项目回填
      let defaultCheckedProjectKey = []
      let existedCourseKey = []
      for (let i = 0; i < this.reviewList.length; i++) {
        defaultCheckedProjectKey.push(this.reviewList[i].courseCode + this.reviewList[i].projectCode)
        if (existedCourseKey.indexOf(this.reviewList[i].courseCode) === -1) {
          existedCourseKey.push(this.reviewList[i].courseCode)
        }
      }
      this.defaultCheckedProjectKey = defaultCheckedProjectKey
      this.existedCourseKey = existedCourseKey
      this.isSelectedDataReady = true
    },
    saveNewProject () {
      if (!this.isReady) return
      // 保存的数据分为三部分，一部分是添加无子项的科目，一部分是新添加的项目，一部分是新添加的有子项的科目
      let projects = []
      let checkedDataAll = this.$refs.tree.getCheckedNodes()
//      console.log(checkedDataAll)
      // 把选中但是没有项目的科目先保存起来
      let emptyCourse = checkedDataAll.filter((item) => {
        if (item.hasOwnProperty('projectList') && item.projectList.length === 0) {
          return true
        } else {
          return false
        }
      })
      let emptyCourseInfo = []
      for (let i = 0; i < emptyCourse.length; i++) {
        let obj = {
          'code': emptyCourse[i].courseCode,
          'name': emptyCourse[i].courseName,
          'parentCode': this.hospitalCode,
          'level': 2,
          'gender': emptyCourse[i].courseGender,
          'sort': emptyCourse[i].sort
        }
        emptyCourseInfo.push(obj)
      }
//      console.log(emptyCourseInfo)
      checkedDataAll = checkedDataAll.filter((item) => {
        // 过滤掉置灰已选的
        if (item.hasOwnProperty('disabled')) {
          return false
        // 过滤掉父级科目
        } else if (!item.hasOwnProperty('parentCode') || !item.parentCode) {
          return false
        } else {
          return true
        }
      })
      checkedDataAll.forEach((item) => {
        let obj = {
          'code': item.courseCode.substring(3, 6),
          'name': item.courseName,
          'parentCode': item.parentCode,
          'gender': item.projectGender,
          'level': 3
        }
        projects.push(obj)
      })
      // 筛选出了添加的项目，再加上应该填的科目
//      let addCourseInfo = []
//      for (let i = 0; i < projects.length; i++) {
//        if (this.existedCourseKey.indexOf(projects[i].parentCode) === -1) {
//          // 防止一个新科目下多个项目，重复添加科目
//          let flag = false
//          for (let k = 0; k < addCourseInfo.length; k++) {
//            if (addCourseInfo[k].code === projects[i].parentCode) {
//              flag = true
//              break
//            }
//          }
//          if (flag) continue
//          // 添加科目信息到数组
//          let name = ''
//          for (let j = 0; j < this.treeData.length; j++) {
//            if (this.treeData[j].courseCode === projects[i].parentCode) {
//              name = this.treeData[j].courseName
//              break
//            }
//          }
//          // 遍历treeData去获取科目的sort和courseGender
//          let courseGender
//          let sort
//          for (let m = 0; m < this.treeData.length; m++) {
//            if (this.treeData[m].courseCode === projects[i].parentCode) {
//              courseGender = this.treeData[m].courseGender
//              sort = this.treeData[m].sort
//              break
//            }
//          }
//          let obj = {
//            'code': projects[i].parentCode,
//            'name': name,
//            'parentCode': this.hospitalCode,
//            'level': 2,
//            'gender': courseGender,
//            'sort': sort
//          }
//          addCourseInfo.push(obj)
//        }
//      }
//      projects = projects.concat(addCourseInfo)
//      projects = projects.concat(emptyCourseInfo)
      if (projects.length === 0) {
        tool.toast({
          type: 'warning',
          title: '未选中新的科目/项目，无法保存'
        })
        return
      }
      this.isReady = false
//      console.log(projects)
      this.$emit('add-new-project', projects)
      this.$emit('close-select', 'close')
//      HospitalManageApi.addCourses(this.hospitalCode, JSON.stringify(projects))
//        .then((res) => {
//          if (res.code === 'success') {
//            tool.toast({
//              type: 'success',
//              title: '保存成功'
//            })
//            this.isReady = true
//            this.$emit('close-select', 'saveFinish')
//          }
//        })
//        .catch(() => {
//          tool.toast({
//            type: 'error',
//            title: '保存失败'
//          })
//        })
    },
    closeSelect () {
      this.$emit('close-select', 'close')
    },
    filterNode (value, data) {
      if (!value) return true
      // 保证搜索科目的时候，它的项目也显示
      if (data.courseName.indexOf(value) !== -1) {
        if (data.hasOwnProperty('projectList')) {
          this.filterParentCode.push(data.courseCode)
        }
        return true
      } else {
        if (this.filterParentCode.indexOf(data.courseCode.substring(0, 3)) !== -1) {
          return true
        }
        return false
      }
    }
  }
}
</script>

<style scoped>
.select-project-dialog-wrap {
  width: 480px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.wrap-inner {
  padding: 0 24px;
}
.tree-wrap {
  height: 300px;
  overflow: scroll;
  margin-bottom: 24px;
  margin-top: 16px;
  font-size: 12px;
}
.project-tree {
  height: 100%;
}
</style>
