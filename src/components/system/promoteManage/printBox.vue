<template id="">
  <div class="WordSection1">
    <div class="print-content">
      <div class="title">幸福千万家会员{{info.empName}}全年健康促进方案</div>
      <div class="datep">（{{info.checkupTime|daterange}}）</div>
      <dl class="print-item"  v-if="nav.show==='0'" v-for="(nav, navindex) in navdata">
        <dt><h3>{{navindex+1 | formatNum}}、{{nav.title}}</h3></dt>
        <dd :class="{haspadding:nav.id!=='2',fontdd:nav.id!=='1'&&nav.id!=='2'}">
          <template id="" v-if="nav.id === '1'">
            <div class="templete">{{nav.data.templete}}</div>
            <div class="fontp" v-for="(item, index) in nav.data.remark" >
              <template id="" v-if="nav.data.remark.length>1">
                {{index+1+'、'}}
              </template>
              {{item}}
            </div>
          </template>
          <template id="" v-if="nav.id === '2'">
            <table class="tablebox"  cellspacing="0" v-if="nav.data.hospitals">
              <tbody>
                <tr class="faback">
                  <th class="tNormalFont" style="width:16%">体检医院</th>
                  <td class="tNormalFont" v-for="item in nav.data.hospitals"
                  :style="{width:88/(nav.data.hospitals.length)+'%'}">{{item.value}}</td>
                </tr>
                <tr class="">
                  <th class="tNormalFont">体检时间</th>
                  <td class="normal" v-for="item in nav.data.checkupTime">
                    {{item.substr(0, 4)+'年'+item.substr(4, 2)+'月' + item.substr(6, 2)+'日'}}
                  </td>
                </tr>
                <tr class="">
                  <th class="tNormalFont">检查项目</th>
                  <td class="normal" v-for="item in nav.data.checkupTime">
                    结果值
                  </td>
                </tr>
                <template id="" v-for = "item in nav.data.courses">
                  <tr v-for = "pro in item.projects">
                    <th class="tNormalFont">{{pro.projectName}}</th>
                    <td class="normal" v-for = "dat in pro.dateProjects" :class="{high:dat.referenceValue}">
                      <div id="" class="fontType" v-if="dat.compareValue.indexOf('3') !== -1 || dat.compareValue.indexOf('4') !== -1">
                        <div :class="{'redfont': dat.compareValue.indexOf('4') !== -1}"
                        v-for="(emContent, indexs) in dat.result.split('|')">
                          <b v-if="dat.result.split('|').length > 1">{{indexs|sortNum}}</b>
                          {{emContent}}
                        </div>
                      </div>
                      <div id="" v-else :class="{redfont:dat.compareValue === '1' || dat.compareValue === '2' || dat.compareValue === '6' || dat.compareValue === '7'}">
                        {{dat.result}}
                        <img src="static/images/up.png" v-if="dat.compareValue === '1'" class="updown" width="15" height="15">
                        <img src="static/images/down.png" v-if="dat.compareValue === '2'" class="updown" width="15" height="15">
                      </div>
                      <div class="referenceValu"  v-if="dat.referenceUnit">
                        <template id="" v-if = "dat.compareValue === '1' || dat.compareValue === '2'">
                          ({{dat.referenceValue | referenceValueFormat}})
                        </template>
                        {{dat.referenceUnit}}
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
          <template id="" v-if="nav.id === '3'">
            <section class="fontddItem" v-for = "(item, index) in nav.data">
              <div class="smalltitle">{{index+1+'、'+item.title}}</div>
              <div class="fontItem">
                <table style="width:100%" cellspacing="0" class="catable">
                  <tr>
                    <td class="ddtitle" valign="top">医学解释:</td>
                    <td valign="top">
                      <span class="fontItemSpan">{{item.remark}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="ddtitle" valign="top">常见病因:</td>
                    <td valign="top">
                      <div class="fontItemSpan" v-if="item.cause">
                        <div v-for="(cause, c) in item.cause.split('|')">
                          <template id="" v-if="item.cause.split('|').length>1">
                            {{c|sortNum}}
                          </template>
                          {{cause}}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <!-- <span class="ddtitle">医学解释:</span>
                <span class="fontItemSpan">{{item.remark}}</span> -->
              </div>
              <!-- <div class="fontItem">
                <table style="width:100%">

                </table>
              </div> -->
            </section>
          </template>
          <template id="" v-if="nav.id === '4'">
            <template id="" v-for="(child, cin) in nav.children" v-if="child.show === '0'">
              <div class="smalltitle">{{child.title}}</div>
              <div class="templete" v-if="child.data[0].templete">{{child.data[0].templete}}</div>
              <section class="fontddItem" v-for="(item, index) in child.data">
                <div class="childT smalltitle" style="font-weight:bold">{{index+1+'、'+item.title}}</div>
                <div class="fontItem columnitem" style="text-indent:2em">
                  <template class="fontddItem-p" v-for="(re, rin) in item.remark.split('|')">
                    <!-- <template id="" v-if="item.remark.split('|').length>1">
                      {{rin | sortNum}}
                    </template> -->
                    <div id="" v-html="re">
                    </div>
                  </template>
                </div>
              </section>
            </template>
          </template>
          <template id="" v-if="nav.id === '5'">
            <section class="fontddItem">
              <div class="templete" style="text-indent:0">根据您的体检报告，对您的阳性指标复查时间安排建议如下：</div>
              <!-- <div  v-for="(item, index) in nav.data.datelist">
                <div class="childT" style="line-height:30px;margin-top:16px">
                  {{index+1}}、{{item}}
                  <p id="" v-for="(tit, tin) in nav.data[item]">
                    {{tin | sortNum}} {{tit}}
                  </p>
                </div>
              </div> -->
              <div class="templete" style="text-indent:0" v-for="(item, index) in nav.data">
                  {{index+1}}、{{item.reexaminationTime}} {{item.title}}
              </div>
              <!-- <div  v-for="(item, index) in nav.data">
                <div class="childT dateline">

                </div>
              </div> -->
            </section>
          </template>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script type="text/javascript">
import promoteManageApi from '@/fetch/report/promoteManage'
import formatNum from '@/util/formatNum'
export default {
  props: ['schemeInfo'],
  mounted () {
    this.getData()
  },
  data () {
    return {
      HealthCareList: {},
      tableList: [],
      Positive: [],
      HealthWellList: [],
      HealthDieList: [],
      ReexList: [],
      navdata: [],
      compareTitle: ''
    }
  },
  computed: {
    info () {
      return this.schemeInfo
    }
  },
  methods: {
    async getData () {
      let vm = this
      let [
        promote,
        HealthCareList,
        PositiveIndex,
        HealthWell,
        HealthDie,
        Reex
      ] = await Promise.all([
        promoteManageApi.getCompareReport(
          this.info.id,
          this.info.empNo,
          this.info.checkupTime),
        promoteManageApi.getHealthCareSummary(this.info.id),
        promoteManageApi.getPositiveIndex(this.info.id),
        promoteManageApi.getHealthWellnessScheme(this.info.id),
        promoteManageApi.getHealthDietScheme(this.info.id),
        // promoteManageApi.getReexaminationTime(this.info.id)
        promoteManageApi.getReexaminationMessage(this.info.id)

      ])
      // let promote = await promoteManageApi.getCompareReport(
      //   this.info.id,
      //   this.info.empNo,
      //   this.info.checkupTime)
      vm.tableList = promote.data || []
      let timeArr = promote.data.checkupTime || []
      vm.compareTitle = vm.getcompareTitle(timeArr)
      // let HealthCareList = await promoteManageApi.getHealthCareSummary(this.info.id)
      let remark = []
      let templete = ''
      if (HealthCareList.data) {
        remark = HealthCareList.data.remark.split('|')
        templete = HealthCareList.data.templete
      }
      vm.HealthCareList.remark = remark
      vm.HealthCareList.templete = templete
      vm.remark = remark
      // let PositiveIndex = await promoteManageApi.getPositiveIndex(this.info.id)
      vm.Positive = PositiveIndex.data || []
      // 医生专家制定的健康促进方案
      // let HealthWell = await promoteManageApi.getHealthWellnessScheme(this.info.id)
      vm.HealthWellList = HealthWell.data || []
      // 营养饮食方案
      // let HealthDie = await promoteManageApi.getHealthDietScheme(this.info.id)
      vm.HealthDieList = HealthDie.data || []
      // 复查
      // let Reex = await promoteManageApi.getReexaminationTime(this.info.id)
      // let reexaminationTimeArr = vm.getReexaminationTimeArr(Reex.data)
      // vm.ReexList = reexaminationTimeArr
      vm.ReexList = Reex.data
      vm.getNavdata()
      vm.$emit('Close')
    },
    getcompareTitle (timeArr) {
      let sum = []
      let y
      let yN
      // 去重排序求最大最小值差 转中文
      if (timeArr.length > 0) {
        let yArr = []
        timeArr.map((item, i) => {
          yArr.push(parseInt(item.substr(0, 4)))
        })
        sum = [...new Set(yArr)]
        sum.sort((a, b) => { return a - b })
        y = formatNum.SectionToChinese(sum[sum.length - 1] - sum[0] + 1)
        yN = formatNum.SectionToChinese(timeArr.length)
        let sumY = Array.from(sum, (x) => `${x}年`)
        return `${y}年(${yN}次)体检阳性指标说明(${sumY.join(',')})`
      } else {
        return `一年(零次)体检阳性指标说明`
      }
    },
    getReexaminationTimeArr (data) {
      let reexlist = data || []
      let reexaminationTimeArr = {}
      let datelist = []
      reexaminationTimeArr.datelist = []
      reexlist.map((item, i) => {
        if (!(item.reexaminationTime in reexaminationTimeArr)) {
          reexaminationTimeArr[item.reexaminationTime] = []
          datelist.push(parseInt(item.reexaminationTime.replace('-', ''), 10))
        }
        reexaminationTimeArr[item.reexaminationTime].push(item.title)
      })
      datelist.sort((a, b) => { return a - b })
      datelist.map((item, i) => {
        let str = item.toString()
        let it = `${str.substr(0, 4)}-${str.substr(4, 2)}`
        reexaminationTimeArr.datelist.push(it)
      })
      return reexaminationTimeArr
    },
    getNavdata () {
      let vm = this
      let years = vm.info.checkupTime.substr(0, 4)
      let navdata = [{
        id: '1',
        title: '健康总评',
        data: vm.HealthCareList,
        show: (vm.HealthCareList.remark.length > 0) || (vm.HealthCareList.templete !== '') ? '0' : '1'
      }, {
        id: '2',
        title: vm.compareTitle,
        data: vm.tableList,
        show: vm.tableList.hospitals ? '0' : '1'
      }, {
        id: '3',
        title: `${years}年体检阳性指标解释、病因`,
        data: vm.Positive,
        show: vm.Positive.length > 0 ? '0' : '1'
      }, {
        id: '4',
        title: '全年健康促进方案',
        data: [],
        show: (vm.HealthWellList.length > 0 || vm.HealthDieList.length > 0) ? '0' : '1',
        children: [
          {
            id: '4-1',
            title: '(一)医生专家制定的健康促进方案',
            data: vm.HealthWellList,
            show: vm.HealthWellList.length > 0 ? '0' : '1'
          }, {
            id: '4-2',
            title: '(二)营养饮食方案',
            data: vm.HealthDieList,
            show: vm.HealthDieList.length > 0 ? '0' : '1'
          }
        ]
      }, {
        id: '5',
        title: '阳性指标复查时间安排',
        data: vm.ReexList,
        // show: vm.ReexList.datelist.length > 0 ? '0' : '1'
        show: vm.ReexList.length > 0 ? '0' : '1'
      }]
      navdata.map((item, i) => {
        if (item.show === '0') {
          vm.navdata.push(item)
        }
      })
    }
  }
}
</script>
<style media="screen">
  .printdialog .el-dialog__header{
    display: none;
  }
  .printdialog.el-dialog{
    border-radius: 0px;
    margin-bottom: 0
  }
  .printdialog .el-dialog__body{
    padding: 20px 0
  }
  .print-content{
    margin: 0px 80px;
    text-align: center;
    border-top:1px solid #ebebeb;
    justify-content: center;
    font-family: "KaiTi"
  }
  .print-content .title{
    font-size: 30px;
    line-height: 30px;
    color: #515152;
    font-weight: bold;
    text-align: center;
    margin-top: 80px
  }
  .datep {
    color: #212122;
    font-size: 20px;
    line-height: 20px;
    margin-top: 25px;
    text-align: center;
    margin-bottom: 47px
  }
  .print-item{
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 32px
  }
  .print-item dt{
    border-bottom: 1px solid #ebebeb
  }
  .print-item dt h3{
    font-size: 24px;
    color: #000;
    padding-bottom: 24px;
    line-height: 24px;
    font-weight: bold;
  }
  .print-item dd {
    padding: 24px 0;
    word-wrap:break-word
  }
  .print-item dd.haspadding{
    padding: 24px 44px
  }
  .fontp{
    font-size: 20px;
    line-height: 32px;
    color: #000000 75%
  }
  .tablebox{
    border: 1px solid #dedede;
    width: 100%
  }
  .tablebox th, .tablebox td{
    padding: 16px 0;
    text-align: center;
  }
  .tablebox tr{
    position: relative;
  }
  .tablebox tr + tr td, .tablebox tr + tr th{
    border-top: 1px solid #dedede
  }
  .tablebox th + td, .tablebox td + td{
    border-left: 1px solid #dedede
  }
  .tablebox td.normal{
    font-size: 20px
  }
  .faback th, .faback td{
    background: #fafafa
  }
  .tNormalFont{
    font-size: 16px;
    font-weight: bold;
  }
  .fontdd{
    font-size: 20px;
    color: #000
  }
  .fontdd h3, .fontdd h4, .smalltitle{
    font-weight: bold;
    line-height: 32px;
    margin: 24px 0 16px 0;
    opacity: 0.75;
    font-size: 20px
  }
  .fontItem .ddtitle{
    font-weight: bold;
    opacity: 0.75;
    margin-right: 10px;
    width: 100px;
    flex-shrink: 0
  }
  .fontItem{
    line-height: 32px;
    display: flex;
  }
  .fontItem + .fontItem{
    margin-top: 16px
  }
  .fontddItem + .fontddItem{
    margin-top: 34px
  }
  .fontddItem-p{
    font-size: 20px;
    color: #000;
    opacity: 0.75;
    line-height: 32px;
    text-indent: 2em
  }
  .referenceValu{
    font-size: 20px;
    line-height: 30px;
    color: #000;
    opacity: 0.75;
    font-weight: normal;
  }
  .high{
    font-size: 20px;
    line-height: 30px;
    font-weight: bold;
  }
  .redfont{
    color: #FA476F
  }
  .normal i{
    font-size: 10px
  }
  .print-content{
    position: relative;
  }
  .updown{
    width: 15px;
    height: 15px
  }
  .fontdd h3.childT{
    margin-top: -5px;
  }
  .columnitem{
    flex-direction: column;
  }
  .templete{
    margin-bottom:16px;
    font-weight:bold;
    font-size:20px;
    line-height:32px;
    text-indent:2em;
    color:#000;
    opacity: 0.75
  }
  .PageNext{page-break-after: always;}
</style>
