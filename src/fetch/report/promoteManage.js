/**
 * 系统管理-促进方案管理
 */
import {
  // fetchGet
  fetchPost,
  fetchApplicationJson
} from '@/fetch/api'

export default {
  // 获取各栏目是否有内容
  getPromoteSchemeSelect (id) {
    // let params = {
    //   id
    // }
    return fetchPost('/scheme/promote/getPromoteSchemeSelect?id=' + id)
  },
  // 阳性指标对比
  getCompareReport (schemeId, empNo, checkupTime) {
    let params = {
      // schemeId,
      empNo,
      checkupTime
    }
    // return fetchGet('/scheme/positive/compareReport/' + schemeId, params)
    return fetchPost('/scheme/positive/compareReport/' + schemeId, params)
  },
  // 阳性解释、病因-列表
  getPositiveIndex (schemeId) {
    return fetchPost('/scheme/positive/positiveIndex/' + schemeId)
  },
  // 阳性解释、病因-更新
  updatePositiveIndex (healthPostIndexList, schemeId) {
    // let params = {
    //   healthPostIndexList
    // }
    // return fetchApplicationJson('/scheme/positive/addPositiveIndex/' + schemeId, params)
    return fetchApplicationJson('/scheme/positive/addPositiveIndex/' + schemeId, healthPostIndexList)
  },
  // 健康促进方案-列表
  getHealthWellnessScheme (schemeId) {
    return fetchPost('/scheme/wellness/healthWellnessScheme/' + schemeId)
  },
  // 健康促进方案-更新
  updateHealthWellnessScheme (healthWellnessSchemeList, schemeId) {
    // let params = {
    //   healthWellnessSchemeList
    // }
    // return fetchApplicationJson('/scheme/wellness/addWellnessScheme/' + schemeId, params)
    return fetchApplicationJson('/scheme/wellness/addWellnessScheme/' + schemeId, healthWellnessSchemeList)
  },
  // 营养饮食保健方案-列表
  getHealthDietScheme (schemeId) {
    return fetchPost('/scheme/diet/healthDietScheme/' + schemeId)
  },
  // 营养饮食保健方案-更新
  updateHealthDietScheme (healthDietSchemeList, schemeId) {
    // let params = {
    //   healthDietSchemeList
    // }
    // return fetchApplicationJson('/scheme/diet/addHealthDietScheme/' + schemeId, params)
    return fetchApplicationJson('/scheme/diet/addHealthDietScheme/' + schemeId, healthDietSchemeList)
  },
  // 健康总评-列表
  getHealthCareSummary (schemeId) {
    return fetchPost('/scheme/summary/healthCareSummary/' + schemeId)
  },
  // 健康总评-更新
  // updateHealthCareSummary (id, remark, schemeId) {
  //   let params = {
  //     id,
  //     remark
  //   }
  //   return fetchPost('/scheme/diet/addHealthDietScheme/' + schemeId, params)
  // },
  updateHealthCareSummary (remark, templete, schemeId) {
    let params = {
      schemeId,
      templete,
      remark
    }
    return fetchApplicationJson('/scheme/summary/addhealthCareSummary/' + schemeId, params)
    // return fetchApplicationJson('/scheme/diet/addHealthDietScheme/' + schemeId + '?remark=' + remark + '&schemeId=' + schemeId)
  },
  // 复查时间-列表
  getReexaminationTime (schemeId) {
    return fetchPost('/scheme/reexamination/reexaminationTime/' + schemeId)
  },
  // 复查时间-更新
  updateReexaminationTime (list, schemeId) {
    // let params = {
    //   list
    // }
    // return fetchApplicationJson('/scheme/reexamination/addReexaminationTime/' + schemeId, params)
    return fetchApplicationJson('/scheme/reexamination/addReexaminationTime/' + schemeId, list)
  },
  // 复查时间消息-列表
  getReexaminationMessage (schemeId) {
    return fetchPost('/scheme/reexamination/reexaminationMessage/' + schemeId)
  },
  // 复查时间消息-更新
  updateReexaminationMessage (list, schemeId) {
    // let params = {
    //   list
    // }
    // return fetchApplicationJson('/scheme/reexamination/addReexaminationMessage/' + schemeId, params)
    return fetchApplicationJson('/scheme/reexamination/addReexaminationMessage/' + schemeId, list)
  }
}
