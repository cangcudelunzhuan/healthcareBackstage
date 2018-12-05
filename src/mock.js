/**
 * Created by JianBo.Wang on 2018/6/19.
 */
const Mock = require('mockjs')

Mock.mock(/\/bliss\/ope\/userList/, 'get', {
  'code|1': 'success',
  'message|1': '成功',
  'data|1': {
    'items|20': [{
      'opeName|1': '@cname',
      'empAccount|1': '@name',
      'empId|1': '@zip',
      'depName|1': '@ctitle(3, 10)',
      'pemNum|1': '@natural(60, 1400)',
      'updateTime|1': '@date("yyyy-MM-dd")'
    }],
    'total|1-1400': 100
  }
})
