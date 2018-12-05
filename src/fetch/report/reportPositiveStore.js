import { fetchGet, fetchPost } from '@/fetch/api'

export default {
  // 获取科目-项目树
  checkProject () {
    return fetchGet('/kpi/checkProject')
  },
  // 查询项目下已有解释
  explain (courseCode, projectCode) {
    let params = {
      courseCode: courseCode,
      projectCode: projectCode
    }
    return fetchGet('/kpi/explain', params)
  },
  // 获取解释详情
  explainDetail (id) {
    let params = {
      id: id
    }
    return fetchGet('/kpi/explainDetail', params)
  },
  // 检验解释是否唯一，能否添加（单项目时解释不重复，文本不一致时校验文本；多项目时不限制）
  checkAddable (courseCode, projectCode, compareValue, kpiResult) {
    let params = {
      courseCode,
      projectCode,
      compareValue,
      kpiResult
    }
    return fetchGet('/kpi/checkUnCompareVal', params)
  },
  // 新增或编辑解释
  editExplain (id, reportCode, compareValue, result, explan, cause, projects) {
    let params = {
      id: id,
      reportCode: reportCode,
      compareValue: compareValue,
      result: result,
      explan: explan,
      cause: cause,
      projects: projects
    }
    return fetchPost('/kpi/editExplain', params)
  },
  // 病因解释删除
  delExplain (id) {
    let params = {
      id: id
    }
    return fetchGet('/kpi/delExplain', params)
  }
}
