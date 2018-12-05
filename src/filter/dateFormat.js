class DateFormat {
  getYearDate (unixTime, flag) { // 返回年月日
    if (!unixTime) {
      return ''
    }
    let time = (flag !== undefined) ? flag : true
    let date = new Date(unixTime)
    let year = date.getFullYear()
    let month = '0' + (date.getMonth() + 1)
    let day = '0' + date.getDate()
    if (time === true) {
      let hours = '0' + date.getHours()
      let minutes = '0' + date.getMinutes()
      let second = '0' + date.getSeconds
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + day.substring(day.length - 2, day.length) + ' ' + hours.substring(hours.length - 2, hours.length) + ':' + minutes.substring(minutes.length - 2, minutes.length) + ':' + second.substring(second.length - 2, second.length)
    } else if (time === false) {
      return year + '-' + month.substring(month.length - 2, month.length) + '-' + day.substring(day.length - 2, day.length)
    }
  }
}

export default new DateFormat()
