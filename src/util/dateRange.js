class Format {
  dateRange (data) {
    if (!data) {
      return ''
    }
    let thisyear = data.substr(0, 4)
    let m = data.substr(4, 2)
    if (m === '01') {
      return thisyear + '年' + m + '月-' + thisyear + '年' + '12月'
    }
    let nextyear = parseInt(thisyear, 10) + 1
    return thisyear + '年' + m + '月-' + nextyear + '年' + (parseInt(m) - 1).toString() + '月'
  }
}
export default new Format()
