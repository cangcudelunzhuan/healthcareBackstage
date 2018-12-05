/*
 * Created by Siqi.Huang on 08/31/2018
 */
import { fetchGet, fetchPost, fetchApplicationJson } from '@/fetch/api'

export default {
  // 机构（医院）列表
  getHospitalList () {
    return fetchGet('/hospital/hospitalList')
  },
  // 增加、修改机构
  editHospital (id, code, name, level) {
    let params = {
      id,
      code,
      name,
      level
    }
    return fetchPost('/hospital/editHospital', params)
  },
  // 校验删除机构
  checkDeleteHospital (id, code) {
    let params = {
      id,
      code
    }
    return fetchGet('/hospital/checkDeleteHospital', params)
  },
  // 删除机构
  deleteHospital (id, code) {
    let params = {
      id,
      code
    }
    return fetchGet('/hospital/deleteHospital', params)
  },
  // 获取医院对应的科目-项目列表信息
  getCourseList (hospitalCode) {
    let params = {
      hospitalCode: hospitalCode
    }
    return fetchGet('/hospital/courseList', params)
  },
  // 模板添加科目
  baseEditCourse (courseCode, courseName, iconUrl, courseGender) {
    let params = {
      courseCode,
      courseName,
      iconUrl,
      courseGender
    }
    return fetchPost('/hospital/base/editCourse', params)
  },
  // 模板校验删除科目
  baseCheckDeleteCourse (courseCode, projectCode) {
    let params = {
      courseCode,
      projectCode
    }
    return fetchGet('/hospital/base/checkDelete', params)
  },
  // 模板删除科目
  baseDeleteCourse (courseCode, projectCode) {
    let params = {
      courseCode,
      projectCode
    }
    return fetchGet('/hospital/base/delete', params)
  },
  // 非模板修改科目名称
  editCourse (code, parentCode, name) {
    let params = {
      code,
      parentCode,
      name
    }
    return fetchPost('/hospital/editCourse', params)
  },
  // 非模板校验删除科目
  checkDeletCourse (hospitalCode, courseCode, projectCode) {
    let params = {
      hospitalCode,
      courseCode,
      projectCode
    }
    return fetchGet('/hospital/checkDelete', params)
  },
  // 非模板删除科目
  deleteCourse (hospitalCode, courseCode, projectCode) {
    let params = {
      hospitalCode,
      courseCode,
      projectCode
    }
    return fetchGet('/hospital/delete', params)
  },
  // 获取科目-项目树
  checkProject () {
    return fetchGet('/kpi/checkProject')
  },
  // 根据医院获取已添加科目项目
  selectedCourseProjects (hospitalCode) {
    return fetchGet('/hospital/selectedCourseProjects', { hospitalCode })
  },
  // 为医院添加树中选取的科目项目
  addCourses (hospitalCode, projects) {
    let params = {
      hospitalCode,
      projects
    }
    return fetchPost('/hospital/addCourses', params)
  },
  // 编辑参考值下拉框参数
  getComboxList () {
    return fetchGet('/hospital/comboxList')
  },
  // 参考值编辑弹窗，删除参考值
  deleteReference (id) {
    return fetchGet('hospital/deleteReference', { id })
  },
  // 校验参考值是否可更改
  checkReference (hospitalCode, courseCode, projectCode, referenceCode) {
    let params = {
      hospitalCode,
      courseCode,
      projectCode,
      referenceCode
    }
    return fetchGet('/hospital/checkReference', params)
  },
  // 保存项目和参考值
  editReferences (info) {
    let params = {
      courseCode: info.courseCode,
      courseName: info.courseName,
      courseGender: info.courseGender,
      hospitalCode: info.hospitalCode,
      hospitalName: info.hospitalName,
      projectCode: info.projectCode,
      projectName: info.projectName,
      projectGender: info.projectGender,
      references: info.references
    }
    params = JSON.stringify(params)
    return fetchApplicationJson('/hospital/edit', params)
  },
  // 科目排序
  courseSort (hospitalCode, courseSortList) {
    let params = {
      hospitalCode,
      courseSortList
    }
    return fetchGet('/hospital/courseSort', params)
  },
  // 项目排序
  projectSort (hospitalCode, projectSortList) {
    let params = {
      hospitalCode,
      projectSortList
    }
    return fetchGet('/hospital/projectSort', params)
  }
}
