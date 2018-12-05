/**
 * 系统管理-Excel报表管理
 */
import {
  fetchGet,
  fetchPost,
  fetchApplicationJson
} from '@/fetch/api'

export default {
  // 改变报告状态，已删除，待审核
  editReportStatus (ids, hospitalCodes, status, reportContext) {
    let params = {
      ids,
      hospitalCodes,
      status,
      reportContext
    }
    return fetchPost('/reportBack/editReportStatus', params)
  },
  // 体检列表
  getCheckupList (pageSize, pageNum, key, grade, reportType, status, recycle) {
    let params = {
      userCode: sessionStorage.getItem('userEmpNo'),
      numPerPage: pageSize,
      pageNum: pageNum,
      serachText: key,
      grade: grade,
      reportType: reportType,
      status: status,
      recycle: recycle
    }
    return fetchGet('/report/getCheckupList', params)
  },
  // 机构-医院列表
  getHospitalList () {
    return fetchGet('/hospital/hospitalList')
  },
  // 搜索会员
  searchMember (key) {
    return fetchGet('/reportBack/selectEmpList', { key })
  },
  // 新增报告-会员基础信息
  addBaseInfo (info) {
    return fetchPost('/reportBack/addBaseReport', info)
  },
  // 获取报告的基本信息，传入report id
  getReportBaseInfo (id) {
    return fetchGet('/reportBack/selectBaseReport', {id})
  },
  // 科目列表(具体科目)查询
  getCourseList (hospitalCode, empNo, checkupTime, courseCode) {
    let params = {
      hospitalCode,
      empNo,
      checkupTime,
      courseCode
    }
    return fetchGet('/reportBack/selectCourseList', params)
  },
  // 报告已填写结果查询
  getReportSavedData (hospitalCode, empNo, checkupTime, status) {
    status = status || ''
    let params = {
      hospitalCode,
      empNo,
      checkupTime,
      status
    }
    return fetchGet('/reportBack/selectReport', params)
  },
  // 录入结果时匹配阳性结果指标
  getKpiResult (courseCode, projectCode, referenceParam, result) {
    let params = {
      courseCode,
      projectCode,
      referenceParam,
      result
    }
    return fetchGet('reportBack/getKpiResult', params)
  },
  // 查询项目下所有阳性指标解释
  explain (courseCode, projectCode) {
    let params = {
      courseCode: courseCode,
      projectCode: projectCode
    }
    return fetchGet('/kpi/explain', params)
  },
  // LXL报告管理下的previewPage页的查询日志列表
  getDateListResult (hospitalCode, checkupTime, empNo) {
    let params = {
      hospitalCode,
      checkupTime,
      empNo
    }
    return fetchGet('/reportBack/selectDetailLogList', params)
  },
  // 保存录入结果
  saveReport (hospitalCode, overviewId, courseCode, reportContext, rd) {
    let urlStr = `/reportBack/editReport?hospitalCode=${hospitalCode}&overviewId=${overviewId}&courseCode=${courseCode}&reportContext=${reportContext}`
    let params = JSON.stringify(rd)
    return fetchApplicationJson(urlStr, params)
  },
  // LXL促进方案下的previewPage页的查询日志列表
  getPromotionDateListResult (code) {
    let params = {
      code
    }
    return fetchGet('/reportBack/selectLogList', params)
    // return fetchGet('/reportBack/selectDetailLogList', params)
  }
}
