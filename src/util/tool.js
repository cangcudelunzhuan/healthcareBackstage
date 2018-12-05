/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import store from '../vuex/store'
import '../countly/countly.min.js'

/**
 *   Toast公共方法
 */
export function toast (toastState) {
  store.dispatch('showToast', toastState)
  let time = 4000
  if (toastState.type === 'error') {
    time = 8000
  }
  setTimeout(() => {
    store.dispatch('hideToast')
  }, time)
}

export function deepExtend (out) {
  out = out || {}
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i]
    if (!obj) {
      continue
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          out[key] = deepExtend(out[key], obj[key])
        } else {
          out[key] = obj[key]
        }
      }
    }
  }
  return out
}

export function getFileUrl (sourceId) {
  let url
  if (navigator.userAgent.indexOf('MSIE') >= 1) { // IE
    url = sourceId.value
  } else if (navigator.userAgent.indexOf('Firefox') > 0) { // Firefox
    url = window.URL.createObjectURL(sourceId.files.item(0))
  } else if (navigator.userAgent.indexOf('Chrome') > 0) { // Chrome
    url = window.URL.createObjectURL(sourceId.files.item(0))
  } else {
    url = sourceId.value
  }
  return url
}

export function preImg (sourceId, targetId, targetId2) {
  let url = getFileUrl(sourceId)
  let imgPre = document.getElementById(targetId)
  let imgPreLarge = document.getElementById(targetId2)
  imgPre.src = url
  imgPreLarge.src = url
}

export function dateFormat (date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

// 用于产生数值型参考值的显示方式
export function referenceValueFormat (value) {
  let arr = value.split('|')
  let min
  let max
  if (arr[0].indexOf('>=') !== -1) {
    min = arr[0].split('>=')[0]
  } else {
    min = arr[0].split('>')[0]
  }
  if (arr[1].indexOf('<=') !== -1) {
    max = arr[1].split('<=')[1]
  } else {
    max = arr[1].split('<')[1]
  }
  if (min === '0' && max === '∞') return '0 - ∞'
  if (min === max) return min
  if (min === '0') {
    return '<' + max
  }
  if (max === '∞') {
    return '>' + min
  }
  return min + ' - ' + max
}

// 前端埋点方法
export function accessLog (inf) {
  let img = new Image(1, 1)
  let src = 'https://dt.geely.com/log/analysis/log.gif?args=' + encodeURIComponent(JSON.stringify(inf))
  img.src = src
}

// 使用countly前端埋点
export function initCountly () {
  window.Countly.init({
    app_key: '74bc9eebb9f6e7eceddc7ad68cda8fc0433df4d4',
    url: 'https://ub-api.geely.com/'
  })
  window.Countly.track_sessions()
  window.Countly.track_pageview()
  window.Countly.track_scrolls()
  window.Countly.track_clicks()
  window.Countly.track_links()
  window.Countly.track_forms()
  window.Countly.track_errors()
}

export function countlyUserDetail (info) {
  window.Countly.user_details(info)
}

export function countlyLogin () {
  window.Countly.add_event({
    key: '用户登陆',
    count: 1
  })
}

export function countlyLogout () {
  window.Countly.add_event({
    key: '用户登出',
    count: 1
  })
}
