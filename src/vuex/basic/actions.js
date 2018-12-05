// import Vue from 'vue'
import dialog from '@/util/dialog.js'

export const actions = {
  // 确认筛选
  checkSure ({commit, state}, params) {
    return new Promise((resolve, reject) => {
      dialog.confirm(params.msg, params.title, function () {
        resolve({result: true})
      })
    })
  }
}
