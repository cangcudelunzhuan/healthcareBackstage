<template>
  <div class="edit-block">
    <!--<h3 class="project-name">阳性指标对比：两年（三次）体检阳性指标说明（2015年、2016年）</h3>-->
    <h3 class="project-name">{{ chineseNum[yearCount] }}年（{{ chineseNum[timeCount] }}次）阳性指标对比（{{ yearEnum }}）</h3>
    <div class="index-table" v-if="tdata.length > 0">
      <el-table
        :data="tdata"
        border
        :stripe="false"
        :fit="true"
        style="width: 100%">
        <el-table-column
          prop="index"
          label="体检医院"
          align="left"
          width="105">
        </el-table-column>
        <el-table-column v-for="(item, $index) in tcolumns"
          :key="$index"
          :label="item.name"
          class-name="subItem-content"
          align="center">
          <template slot-scope="scope">
            <!--<div v-html="scope.row[item.key]"></div>-->
            <!--数值和阴阳类型数据-->
            <span v-if="scope.row[item.key].compareValue == '0' || scope.row[item.key].compareValue == '1' || scope.row[item.key].compareValue == '2' || scope.row[item.key].compareValue == '5' || scope.row[item.key].compareValue == '6' || scope.row[item.key].compareValue == '7'">
              <span
                class="content-span"
                :class="{'text-red': scope.row[item.key].compareValue == 1 || scope.row[item.key].compareValue == 2 || scope.row[item.key].compareValue == 6 || scope.row[item.key].compareValue == 7, 'text-num': !isNaN(Number(scope.row[item.key].result))}"
              >{{scope.row[item.key].result}}
                  <up-arrow-icon class="num-icon" v-if="scope.row[item.key].compareValue == 1"></up-arrow-icon>
                  <down-arrow-icon class="num-icon" v-if="scope.row[item.key].compareValue == 2"></down-arrow-icon>
                </span>
              <span class="unit-span"><span v-if="scope.row[item.key].referenctDis">（{{ scope.row[item.key].referenctDis }}）</span>{{scope.row[item.key].referenceUnit}}</span>
            </span>
            <!--文字型数据有可能出现多条用“|”隔开的情况，劈开之后再循环-->
            <span v-if="scope.row[item.key].compareValue.indexOf('3') != -1 || scope.row[item.key].compareValue.indexOf('4') != -1">
              <em
                class="text-content-wrap"
                :class="{'text-red': scope.row[item.key].compareValue.indexOf('4') != -1}"
                v-for="(emContent,index) in scope.row[item.key].result.split('|')"
              >
                <b v-if="scope.row[item.key].result.split('|').length != 1">{{sortNum[index]}}</b>{{emContent}}
              </em>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="blank-tip" v-else>
      <p>暂无内容</p>
    </div>
  </div>
</template>

<script>
import UpArrowIcon from '@/assets/SVG/UpArrowSVG.vue'
import DownArrowIcon from '@/assets/SVG/DownArrowSVG.vue'
import promoteManageApi from '@/fetch/report/promoteManage'

export default {
  props: ['schemeInfo'],
  components: {
    UpArrowIcon,
    DownArrowIcon
  },
  data () {
    return {
      tcolumns: [],
//      tcolumns: [{
//        key: 'hsp1',
//        name: '浙一国际医学中心杭州明州医院'
//      }, {
//        key: 'hsp2',
//        name: '浙二国际医学中心杭州明州医院'
//      }, {
//        key: 'hsp3',
//        name: '浙三国际医学中心杭州明州医院'
//      }],
      tdata: [],
      yearCount: 0,
      timeCount: 0,
      yearEnum: '',
      sortNum: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'],
      chineseNum: ['零', '一', '两', '三', '四', '五', '六', '七', '八', '九', '十']
//      tdata: tdata
    }
  },
  created () {
    this.getCompareReport()
  },
  methods: {
    getCompareReport () {
      promoteManageApi.getCompareReport(this.schemeInfo.id, this.schemeInfo.empNo, this.schemeInfo.checkupTime)
        .then(res => {
          let data = res.data
          if (data === 'success') {
            this.$emit('del-pos-table-course')
          }
          let yearSet = new Set()
          let tcolumns = []
          data.checkupTime.forEach((item, index) => {
            tcolumns.push({
              key: item,
              name: data.hospitals[index].value
            })
            yearSet.add(parseInt(item.substring(0, 4)))
          })

          //
          let yearArr = [...yearSet].sort()
          this.yearCount = yearArr[yearArr.length - 1] - yearArr[0] + 1
          this.timeCount = tcolumns.length
          this.yearEnum = yearArr.join('年、') + '年'

          let tcolumnsLength = tcolumns.length
          let tdata = []

          let row = {
            index: '体检时间'
          }
          for (let i = 0; i < tcolumnsLength; i++) {
            row[tcolumns[i].key] = {
              compareValue: '3',
              result: data.checkupTime[i]
            }
          }
          tdata.push(row)

          row = {
            index: '检查项目'
          }
          for (let i = 0; i < tcolumnsLength; i++) {
            row[tcolumns[i].key] = {
              compareValue: '3',
              result: '结果值'
            }
          }
          tdata.push(row)
          data.courses.forEach(course => {
            course.projects.forEach(project => {
              row = {
                index: project.projectName
              }
              for (let i = 0; i < tcolumnsLength; i++) {
                let dataProject = project.dateProjects[i]
                if (dataProject.compareValue === '1' || dataProject.compareValue === '2') {
                  dataProject.referenctDis = this.referenceValueFormat(dataProject.referenceValue)
                }
                row[tcolumns[i].key] = dataProject
//                row[tcolumns[i].key] = project.dateProjects[i]
              }
              tdata.push(row)
            })
          })
          this.tcolumns = tcolumns
          this.tdata = tdata
        })
        .catch(() => {})
    },
    // 用于产生数值型参考值的显示方式
    referenceValueFormat (value) {
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
  }
}
</script>

<style scoped>
  .edit-block {
    position: relative;
  }
  .project-name {
    color: #000;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 16px;
  }
  /*.subItem-content {*/
    /*box-sizing: border-box;*/
    /*padding: 16px 8px;*/
    /*text-align: center;*/
    /*float: left;*/
    /*vertical-align: middle;*/
    /*font-size: 0;*/
  /*}*/
  .subItem-content span {
    font-size: 12px;
    line-height: 18px;
    display: inline-block;
  }
  .subItem-content .text-content-wrap {
    /*display: inline-block;*/
    display: block;
    text-align: center;
    /*width: 110px;*/
  }
  .subItem-content .text-content-wrap b {
    font-weight: normal;
  }
  .subItem-content em {
    font-style: normal;
  }
  .subItem-content .num-icon {
    width: 10px;
    height: 12px;
  }
  .subItem-content .unit-span {
    display: block;
    color: #000;
    font-size: 12px;
    margin-top: 8px;
  }
  .subItem-content .text-red {
    color: #FA476F;
  }
  .subItem-content .text-num {
    font-size: 14px;
    font-weight: bold;
  }
  .blank-tip {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #8E8E8F;
  }
  .blank-tip span {
    color: #03BFEE;
    font-weight: bold;
    cursor: pointer;
  }
</style>
