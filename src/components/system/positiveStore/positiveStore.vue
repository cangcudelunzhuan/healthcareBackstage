<template>
<div class="positive-store-wrap" v-loading.fullscreen.lock="pageLoading" element-loading-text="请稍等...">
  <div class="inner-wrap">
    <div class="left-tree-wrap">
      <el-tree
        :props="defaultProps" 
        :data="treeData" 
        node-key="courseName" 
        :default-expanded-keys="defaultExpanded" 
        @node-click="treeClickFn"
        :render-content="renderTreeContent"
      >
      </el-tree>
    </div>
    <div class="right-table-wrap">
      <h2 class="table-title">{{tableTitle}}-阳性结果解释及病因</h2>
      <button class="add-btn" @click.stop.prevent="openEdit">新增解释</button>
      <div class="table-wrap" v-loading.lock="tableLoading" element-loading-text="加载中...">
        <table>
          <thead>
            <tr>
              <th><div>判断条件</div></th>
              <th><div>阳性指标</div></th>
              <th><div>医学解释</div></th>
              <th><div>常见病因</div></th>
              <th><div>操作</div></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData">
              <td><div>{{item.compareText}}</div></td>
              <td><div>{{item.result}}</div></td>
              <td><div>{{item.explan}}</div></td>
              <td class="reason-td">
                <div v-for="causeItem,index in item.cause">
                  <span>
                    <em v-if="item.cause.length > 1">{{index+1}}.</em>
                    {{causeItem}}
                  </span>
                </div>
              </td>
              <td class="operate-td">
                <div>
                  <span @click="openEdit(item)">编辑</span>
                  <span @click="deleteExplain(item)">删除</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="new-explain" v-show="isShadow" v-loading="editIsLoading">
    <h3 class="new-explain-title">
      <p>{{newExplainTitle}}</p>
      <div class="btn-close" @click="closeEdit"></div>
    </h3>
    <div class="new-explain-content">
      <div class="new-explain-row">
        <span class="content-prefix">项目名称</span>
        <el-input 
          v-model="newExplainName"
          :disabled="true"
          class="name-input"
        >
        </el-input>
        <span class="input-seperate">-</span>
        <el-select v-model="newExplainCompareValue" placeholder="请选择" class="type-select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="relative-item-wrap">
        <!--添加的关联项目插入这里-->
      </div>
      <div class="new-explain-row">
        <div class="add-relative" @click.stop="addRelativeFn">添加关联项目</div>
      </div>
      <div class="new-explain-row">
        <span class="content-prefix"><em>*</em> 检查结论</span>
        <el-input
          class="explain-textarea"
          type="textarea"
          resize="none"
          :autosize="{maxRows: 1}"
          placeholder="请输入"
          v-model="checkResultText">
        </el-input>
      </div>
      <div class="new-explain-row">
        <span class="content-prefix"><em>*</em> 医学解释</span>
        <el-input
          class="explain-textarea"
          type="textarea"
          resize="none"
          :autosize="{minRows: 2, maxRows: 4}"
          placeholder="请输入"
          v-model="medicalExplainText">
        </el-input>
      </div>
      <div class="new-explain-row">
        <span class="content-prefix"><em>*</em> 常见病因</span>
        <el-input
          class="explain-textarea"
          type="textarea"
          resize="none"
          :autosize="{minRows: 2, maxRows: 4}"
          placeholder="请输入"
          v-model="usualCauseText">
        </el-input>
      </div>
    </div>
    <!--使用通用样式btn-->
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="checkAddable">确定</div>
      <div class="cancel-btn" @click.stop="closeEdit">取消</div>
    </div>
  </div>
  <div class="shadow-bg" v-show="isShadow"></div>
</div>
</template>

<script>
import PositiveStoreApi from '@/fetch/report/reportPositiveStore'
import * as tool from '@/util/tool'
import Vue from 'vue'
export default {
  name: 'PositiveStore',
  data () {
    return {
      pageLoading: false,
      // 科目树结构
      defaultProps: {
        children: 'projectList',
        label: 'courseName'
      },
      treeData: null,
      treeSelected: null,
      defaultExpanded: [],
      // 表格数据
      tableLoading: false,
      tableData: null,
      tableTitle: '',
      // 新增解释数据
      isShadow: false,
      editIsLoading: false,
      newExplainTitle: '新建解释',
      newExplainId: '',
      newExplainName: '',
      newExplainCompareValue: '-1',
      // 保存编辑时的最初compareValue，与当前值compareValue一致的时候，也能保存。不判定为重复
      originCompareValue: '',
      options: [{
        value: '-1',
        label: '结果正常'
      }, {
        value: '1',
        label: '结果偏高'
      }, {
        value: '2',
        label: '结果偏低'
      }, {
        value: '6',
        label: '结果呈阳性'
      }, {
        value: '7',
        label: '结果呈弱阳性'
      }, {
        value: '4',
        label: '结果文本不一致'
      }],
      relativeWrap: document.getElementById('relative-item-wrap'),
      relativeComponentsArr: [],
      checkResultText: '',
      medicalExplainText: '',
      usualCauseText: ''
    }
  },
  computed: {
    // 根据选中的项目，获得同科目下的所有项目，用于添加关联
    relativeProjectArr () {
      if (this.treeSelected === null) {
        return []
      } else {
        let parentCode = this.treeSelected.parentCode
        let parentObj = this.treeData.filter((item) => {
          return item.courseCode === parentCode
        })[0]
        let relativeProjectArr = []
        parentObj.projectList.forEach((item) => {
          if (item.courseCode === this.treeSelected.courseCode) return
          relativeProjectArr.push({
            'value': parentCode + item.courseCode,
            'label': item.courseName
          })
        })
        return relativeProjectArr
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 前端埋点
    window.Countly.track_pageview('管理平台——阳性指标库')
    this.$nextTick(() => {
      this.relativeWrap = document.getElementById('relative-item-wrap')
    })
  },
  methods: {
    // 获取树，为了形成树，子级项目projectCode -> courseCode， projectName -> courseName, 对应组件el-tree
    // 添加父级code parentCode属性
    init (defaultClickNode) {
      PositiveStoreApi.checkProject()
        .then((res) => {
          let courseList = res.data.courseList
          let treeData = []
          for (let i = 0; i < courseList.length; i++) {
            let obj = {}
            obj.courseCode = courseList[i].courseCode
            obj.courseName = courseList[i].courseName
            obj.existExplain = true
            obj.projectList = []
            if (courseList[i].projectList === null) courseList[i].projectList = []
            for (let j = 0; j < courseList[i].projectList.length; j++) {
              let childObj = {}
              childObj.courseCode = courseList[i].projectList[j].projectCode
              childObj.courseName = courseList[i].projectList[j].projectName
              childObj.existExplain = courseList[i].projectList[j].existExplain
              childObj.parentCode = courseList[i].courseCode
              obj.projectList.push(childObj)
            }
            treeData.push(obj)
          }
          // 默认展开树结构中的第一个科目，选中第一个项目
          this.defaultExpanded = [treeData[0].courseName]
          this.treeData = treeData
          this.treeClickFn({
            courseName: treeData[0].projectList[0].courseName,
            courseCode: treeData[0].projectList[0].courseCode,
            parentCode: treeData[0].courseCode
          })
        })
        .catch(() => {
        })
    },
    renderTreeContent (h, { node, data, store }) {
      if (data.existExplain) {
        return (
          <span class='custom-tree-node'>
              <span>{node.label}</span>
          </span>
        )
      } else {
        return (
          <span class='custom-tree-green'>
              <span>{node.label}</span>
          </span>
        )
      }
    },
    // 点击树，刷新列表
    treeClickFn (clickData) {
      if (!clickData.parentCode) return
      // 当前选中项目信息保存下来，编辑新增时用于查询关联项目
      this.treeSelected = clickData
      // table部分标题更改，显示加载
      this.tableLoading = true
      this.tableTitle = clickData.courseName
      let courseCode = clickData.parentCode
      let projectCode = clickData.courseCode
      PositiveStoreApi.explain(courseCode, projectCode)
        .then((res) => {
          // 当res.data[i].cause换成数组，以解释中的中文'|'分开
          let tableData = []
          for (let i = 0; i < res.data.length; i++) {
            let obj = {}
            for (let attr in res.data[i]) {
              if (attr === 'cause') {
                let arr = []
                if (res.data[i].cause === null) {
                  arr = []
                } else {
                  arr = res.data[i].cause.split('|')
                }
                obj.cause = arr
              } else if (attr === 'compareValue') {
                obj.compareValue = res.data[i].compareValue
                switch (obj.compareValue) {
                  case '-1':
                    obj.compareText = '结果正常'
                    break
                  case '1':
                    obj.compareText = '结果偏高'
                    break
                  case '2':
                    obj.compareText = '结果偏低'
                    break
                  case '6':
                    obj.compareText = '结果呈阳性'
                    break
                  case '7':
                    obj.compareText = '结果呈弱阳性'
                    break
                  case '4':
                    obj.compareText = '结果文本不一致'
                    break
                  default:
                    obj.compareText = '待定'
                    break
                }
              } else {
                obj[attr] = res.data[i][attr]
              }
            }
            tableData.push(obj)
          }
          this.tableData = tableData
          this.tableLoading = false
        })
        .catch(() => {})
    },
    // 新增、编辑页面出现
    openEdit (itemData) {
      // 新增时替换名称
      if (!itemData.id) {
        if (!this.treeSelected) return
        this.newExplainTitle = '新建解释'
        this.newExplainId = ''
        this.newExplainName = this.treeSelected.courseName
        this.newExplainCompareValue = '-1'
        this.originCompareValue = ''
        this.isShadow = true
        return
      }
      // 编辑时调用接口获取相关信息
      this.newExplainTitle = '编辑解释'
      this.isShadow = true
      PositiveStoreApi.explainDetail(itemData.id)
        .then((res) => {
          if (res.code === 'success') {
            this.newExplainId = res.data.id
            this.newExplainName = res.data.projectName
            this.newExplainCompareValue = res.data.compareValue
            this.originCompareValue = res.data.compareValue
            this.checkResultText = res.data.result
            this.medicalExplainText = res.data.explan
            this.usualCauseText = res.data.cause
            // 关联项目信息
            let projects = JSON.parse(res.data.projects)
            if (projects === '') return
            projects = projects.filter((item) => {
              if (item.reportCode === res.data.reportCode) {
                return false
              } else {
                return true
              }
            })
            for (let i = 0; i < projects.length; i++) {
              this.addRelativeFn()
              this.relativeComponentsArr[i].relativeCode = projects[i].reportCode
              this.relativeComponentsArr[i].relativeCompareValue = projects[i].compareValue
            }
          }
        })
        .catch(() => {})
    },
    // 关闭新增、编辑页面
    closeEdit () {
      this.newExplainId = ''
      this.newExplainCompareValue = '-1'
      this.relativeWrap.innerHTML = ''
      this.relativeComponentsArr = []
      this.checkResultText = ''
      this.medicalExplainText = ''
      this.usualCauseText = ''
      this.isShadow = false
    },
    // 新增关联项目
    addRelativeFn () {
      let options = this.options
      let relativeProjectArr = this.relativeProjectArr
      let NewRelative = Vue.extend({
        template: `<div class="new-explain-row">
          <span class="content-prefix">关联项目</span>
          <el-select
            v-model="relativeCode"
            class="name-input"
          >
            <el-option
              v-for="item in relativeProjectArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="input-seperate">-</span>
          <el-select v-model="relativeCompareValue" placeholder="请选择" class="type-select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>`,
        data () {
          return {
            relativeCode: relativeProjectArr[0].value,
            relativeProjectArr: relativeProjectArr,
            options: options,
            relativeCompareValue: '-1'
          }
        }
      })

      let component = new NewRelative().$mount()
      this.relativeWrap.appendChild(component.$el)
      this.relativeComponentsArr.push(component)
    },
    async deleteExplain (itemData) {
      let id = itemData.id
      await this.$store.dispatch('checkSure', {title: '你确定要删除吗?', msg: '删除后不可修复，确认删除该解释吗？'})
      this.pageLoading = true
      PositiveStoreApi.delExplain(id)
        .then((res) => {
          if (res.code === 'success') {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id === id) {
                this.tableData.splice(i, 1)
                break
              }
            }
            tool.toast({
              type: 'success',
              title: '删除成功'
            })
            // 删除成功后检查当前项目和关联项目下是否解释为空
            // 判断当前选中项目，看右侧table是否还有数据
            if (this.tableData.length === 0) {
              // 更改左侧树的颜色
              let parentCode = this.treeSelected.parentCode
              let projectCode = this.treeSelected.courseCode
              this.turnTreeProjectGrey(parentCode, projectCode)
            }
            // 有关联项目的情况需要调用接口查询关联项目，无解释则置灰
            if (itemData.projects !== '') {
              let deleteProjectsInfo = []
              let projects = JSON.parse(itemData.projects)
              projects.forEach((project) => {
                if (project.reportCode !== itemData.reportCode) {
                  deleteProjectsInfo.push(project.reportCode)
                }
              })
              for (let i = 0; i < deleteProjectsInfo.length; i++) {
                let courseCode = deleteProjectsInfo[i].substring(0, 3)
                let projectCode = deleteProjectsInfo[i].substring(3, 6)
                PositiveStoreApi.explain(courseCode, projectCode)
                  .then((res) => {
                    if (res.data.length === 0) {
                      this.turnTreeProjectGrey(courseCode, projectCode)
                    }
                  })
                  .catch(() => {})
              }
            }
            this.pageLoading = false
          }
        })
        .catch(() => {
          tool.toast({
            type: 'error',
            title: '删除失败'
          })
          this.pageLoading = false
        })
    },
    turnTreeProjectGrey (parentCode, projectCode) {
      for (let i = 0; i < this.treeData.length; i++) {
        if (this.treeData[i].courseCode === parentCode) {
          for (let j = 0; j < this.treeData[i].projectList.length; j++) {
            if (this.treeData[i].projectList[j].courseCode === projectCode) {
              this.$set(this.treeData[i].projectList[j], 'existExplain', false)
              break
            }
          }
        }
      }
    },
    // 点击确定，校验该判断条件是否能添加
    checkAddable () {
      // 校验该解释是否可添加，必须是单项目。同时考虑编辑的情况，编辑的compareValue与originCompareValue一致，可直接保存
      // 规则：单项目时解释compareValue不重复，文本不一致时校验文本；多项目时不限制
      if (this.originCompareValue === this.newExplainCompareValue || this.relativeComponentsArr.length !== 0) {
        this.saveExplain()
      } else {
        let courseCode = this.treeSelected.parentCode
        let projectCode = this.treeSelected.courseCode
        let compareValue = this.newExplainCompareValue
        let kpiResult = this.checkResultText
        this.editIsLoading = true
        PositiveStoreApi.checkAddable(courseCode, projectCode, compareValue, kpiResult)
        .then((res) => {
          if (res.data) {
            tool.toast({
              type: 'warning',
              title: '该判断条件已存在，无法再添加'
            })
            this.editIsLoading = false
            return
          } else {
            this.saveExplain()
          }
        })
        .catch(() => {
          this.editIsLoading = false
        })
      }
    },
    // 点击确定，保存
    saveExplain () {
      this.editIsLoading = false
      let id = this.newExplainId
      let reportCode = this.treeSelected.parentCode + this.treeSelected.courseCode
      let compareValue = this.newExplainCompareValue
      if (!compareValue) {
        tool.toast({
          type: 'warning',
          title: '请选择判断条件'
        })
        return
      }
      let result = this.checkResultText
      if (!result || result.trim() === '') {
        tool.toast({
          type: 'warning',
          title: '请填写检查结论'
        })
        return
      }
      let explan = this.medicalExplainText
      if (!explan || explan.trim() === '') {
        tool.toast({
          type: 'warning',
          title: '请填写医学解释'
        })
        return
      }
      let cause = this.usualCauseText
      if (!cause || cause.trim() === '') {
        tool.toast({
          type: 'warning',
          title: '请填写常见病因'
        })
        return
      }
      let projects = []
      // 保存项目code和关联项目code，用于保存后将左侧树相应项目的existExplain变为true
      let projectsCodeArr = [reportCode]
      let sameFlag = false
      this.relativeComponentsArr.forEach((item) => {
        // 校验不能有相同的项目
        for (let i = 0; i < projects.length; i++) {
          if (projects[i].reportCode === item.relativeCode) {
            sameFlag = true
            return
          }
        }
        projects.push({
          'reportCode': item.relativeCode,
          'compareValue': item.relativeCompareValue
        })
        projectsCodeArr.push(item.relativeCode)
      })
      if (sameFlag) {
        tool.toast({
          type: 'warning',
          title: '不能选择相同关联项目'
        })
        return
      }
      // projects在没有关联项的时候，传入''。有关联项的时候传入关联项和自身信息对象
      if (projects.length === 0) {
        projects = ''
      } else {
        projects.push({
          'reportCode': reportCode,
          'compareValue': compareValue
        })
        projects = JSON.stringify(projects)
      }
      this.editIsLoading = true
      PositiveStoreApi.editExplain(id, reportCode, compareValue, result, explan, cause, projects)
        .then((res) => {
          tool.toast({
            type: 'success',
            title: '保存成功'
          })
          this.editIsLoading = false
          this.closeEdit()
          // 主动触发点击，刷新右侧数据
          this.treeClickFn(this.treeSelected)
          // 更改左侧树的颜色，对照projectsCodeArr中存在courseCode+projectCode，则存在解释设为true
          for (let i = 0; i < this.treeData.length; i++) {
            let parentCode = this.treeData[i].courseCode
            for (let j = 0; j < this.treeData[i].projectList.length; j++) {
              let projectCode = parentCode + this.treeData[i].projectList[j].courseCode
              if (projectsCodeArr.indexOf(projectCode) !== -1) {
                this.$set(this.treeData[i].projectList[j], 'existExplain', true)
              }
            }
          }
        })
        .catch(() => {
          this.editIsLoading = false
          tool.toast({
            type: 'error',
            title: '保存失败'
          })
        })
    }
  }
}
</script>

<style scoped>
table  {
  border-collapse:collapse;
}
th,
td {
  padding:0;
}
th {
  font-weight:normal;
}
.positive-store-wrap {
  height: calc(100% - 4.8rem);
  padding: 2.4rem 2.4rem 1.5rem 2.4rem;
  color: #515152;
  background-color: #fff;
  font-size: 12px;
}
.inner-wrap {
  /*min-width: 112.8rem;*/
  height: 100%;
}
.left-tree-wrap {
  height: 100%;
  width: 17.73%;
  float: left;
  margin-right: 2.4rem;
  box-shadow: inset -1px 0 0 0 #F5F5F5;
  overflow: scroll;
}
.right-table-wrap {
  width: calc(82% - 2.4rem);
  height: 100%;
  float: left;
  position: relative;
}
.table-title {
  font-size: 16px;
  line-height: 2.4rem;
  padding-top: 0.3rem;
  margin-bottom: 2.7rem;
}
.add-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 8rem;
  height: 3rem;
  border: 1px solid #D9D9D9;
  font-size: 12px;
  line-height: 3rem;
  color: #000;
  background-color: #fff;
  border-radius: 2px;
  cursor: pointer;
}
.table-wrap {
  height: calc(100% - 5.7rem);
  overflow: scroll;
  color: rgba(0,0,0,0.85);
}
.table-wrap table {
  width: 100%;
  text-align: left;
  font-size: 12px;
  line-height: 1.8rem;
}
.table-wrap thead {
  border-top: 1px solid #EBEBEB;
  border-bottom: 1px solid #EBEBEB;
  width: 100%;
}
.table-wrap thead th {
  padding: 11px 0;
  font-weight: bold;
}
.table-wrap thead th:nth-of-type(1) {
 width: 16.84%;
 text-indent: 0.8rem;
}
.table-wrap thead th:nth-of-type(2) {
 width: 15.93%;
}
.table-wrap thead th:nth-of-type(3) {
  width: 36.95%;
}
.table-wrap thead th:nth-of-type(4) {
  width: 21.68%
}
.table-wrap thead th:nth-of-type(5) {
  width: 8.5%;
}
.table-wrap tbody tr {
  border-bottom: 1px solid #EBEBEB;
}
.table-wrap tbody tr td {
  padding: 9px 0;
  vertical-align: top;
}
.table-wrap tbody tr td:nth-of-type(1) div {
  text-indent: 0.9rem;
}
.table-wrap tbody tr td div {
  padding-right: 24px;
  word-break: break-all;
}
.table-wrap .reason-td span {
  display: block;
}
.table-wrap .reason-td span em {
  font-style: normal;
}
.table-wrap .operate-td span {
  display: inline-block;
  width: 45%;
  min-width: 24px;
  color: #03BFEE;
  cursor: pointer;
}
.table-wrap .operate-td span:hover {
  color: #1F2D3D;
}
.new-explain {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 99;
  width: 50rem;
  min-width: 600px;
  padding: 0 2.4rem;
}
.new-explain-title {
  font-size: 14px;
  line-height: 21px;
  padding: 16px 0 1.8rem 0;
  border-bottom: 2px solid #8B919A;
  position: relative;
  font-weight: normal;
}
.new-explain-title .btn-close {
  position: absolute;  
  right: 0;
  top: 21px;
  width: 12px;
  height: 12px;
  background: url(../../../../static/images/close-icon.png) no-repeat;
  cursor: pointer;
}
.new-explain-content {
  font-size: 0;
  padding-bottom: 24px;
  border-bottom: 2px solid #8B919A;
}
.new-explain-row {
  margin-top: 16px;
}
.new-explain-content .content-prefix {
  display: inline-block;
  width: 60px;
  text-align: right;
  font-weight: bold;
  font-size: 12px;
  line-height: 30px;
  margin-right: 16px;
}
.new-explain-content .content-prefix em {
  font-style: normal;
  color: #f00;
  font-size: 16px;
  vertical-align: middle;
}
.new-explain-content .name-input {
  display: inline-block;
  width: 288px;
  height: 30px;
  box-sizing: border-box;
}
.new-explain-content .input-seperate {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin: 0 8px;
  color: #4F4F4F;
}
.new-explain-content .type-select {
  width: 212px;
}
.new-explain-content .add-relative {
  margin-left: 76px;
  border: 1px dotted #D9D9D9;
  border-radius: 2px;
  font-size: 12px;
  color: #03BFEE;
  line-height: 30px;
  text-align: center;
  background-color: #FAFAFA;
  cursor: pointer;
}
.new-explain-content .explain-textarea {
  display: inline-block;
  width: calc(100% - 76px);
  vertical-align: top;
  font-size: 12px;
}
.shadow-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 90;
}
</style>
