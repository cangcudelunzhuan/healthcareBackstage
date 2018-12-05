import Vue from 'vue'

class Dialog {
  confirm (mes, title, func) {
    if (!mes) {
      mes = '确定取消吗'
    }
    let inner = `<div class="innerBox">
                    <i class="iconfont">&#xe6d6;</i>
                    <div class="innerBoxRight">
                      <h3 class="title">${title}</h3>
                      <p class="msg">${mes}</p>
                    </div>
                  </div>`
    Vue.prototype.$confirm(inner, '', {
      customClass: 'hasNoTitle',
      confirmButtonText: '确定',
      dangerouslyUseHTMLString: true,
      // type: type,
      // center: true,
      showClose: false
    }).then(_ => {
      func()
    }).catch(_ => {

    })
  }
  alert (info, func) {
    let inner = `<div class="innerBox">
                    <div class="innerBoxRight">
                      <p class="msg">${info.mes}</p>
                    </div>
                  </div>`
    Vue.prototype.$alert(inner, '', {
      customClass: 'hasNoTitle center',
      dangerouslyUseHTMLString: true,
      confirmButtonText: info.confirmButtonText,
      showClose: false
    }).then(_ => {
      func()
    }).catch(_ => {

    })
  }
}
export default new Dialog()
