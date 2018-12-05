<template>
<div class="edit-project-dialog-wrap">
  <div class="wrap-inner">
    <h3 class="hsq-dialog-title">
      <span>{{dialogTitle}}</span>
      <div class="hsq-btn-close" @click="closeEdit"></div>
    </h3>
    <div class="hsq-dialog-content dialog-content" v-loading="isLoading">
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix">所属科目</span>
        <el-input
          class="input-size1" 
          :disabled="true" 
          v-model="editReferencesData.courseName">
        </el-input>
        <!--<span class="hsq-content-prefix prefix-second">所属性别</span>
        <el-select class="input-brief"
          disabled
          v-model="gender">
          <el-option
            v-for="item in genderOption"
            :key="item.prop"
            :label="item.label"
            :value="item.prop">
          </el-option>
        </el-select>-->
      </div>
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix"><em>*</em> 项目名称</span>
        <el-input
          class="input-size1" 
          v-model="projectName" 
          >
        </el-input>
      </div>
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix"><em>*</em> 所属性别</span>
        <el-select class="input-brief" v-model="projectGender" :disabled="gender !== '-1'" @change="changeProjectGender">
          <el-option
            v-for="item in genderOption"
            :key="item.prop"
            :label="item.label"
            :value="item.prop">
          </el-option>
        </el-select>
      </div>
      <div class="reference-wrap">
        <div class="hsq-dialog-content-row single-reference" v-for="(reference, index) in references">
          <div class="single-reference-top">
            <span class="hsq-content-prefix">参考值{{index+1}}</span>
            <el-select v-model="reference.referenceParam.referenceType" class="select-size1 " @change="referenceTypeChange(reference, reference.referenceParam.referenceType)" :disabled="editableFlag[index] === false">
              <el-option
                v-for="item in referenceTypeOptions"
                :key="item.value"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
            <div class="fn-btns">
              <el-checkbox v-model="reference.referenceParam.defaultFlag" @change="changedefaultFlag(index)">默认参考值</el-checkbox>
              <span class="fn-btn" @click="deleteFn(index)">删除</span>
            </div>
          </div>
          <div class="single-reference-bottom">
            <!-- 数值型 -->
            <div class="reference-num" v-if="reference.referenceParam.referenceType == '0'">
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">最小值</span>
                <el-input 
                  v-model="reference.referenceParam.referenceValue[0]" 
                  class="input-size2" 
                   v-if="reference.referenceParam.referenceType == '0'" 
                   :disabled="editableFlag[index] === false"
                   >
                  <el-select 
                    v-model="reference.referenceParam.referenceValue[1]" 
                    slot="prepend" class="select-size2" 
                    :disabled="editableFlag[index] === false">
                    <el-option
                      v-for="item in gtOptions" 
                      :label="item.label" 
                      :value="item.key"
                      >
                    </el-option>
                  </el-select>
                </el-input>
                <span class="hsq-content-prefix prefix-second">最大值</span>
                <el-input 
                  v-model="reference.referenceParam.referenceValue[3]" 
                  class="input-size2" 
                   v-if="reference.referenceParam.referenceType == '0'" 
                   :disabled="editableFlag[index] === false">
                  <el-select 
                    v-model="reference.referenceParam.referenceValue[2]" 
                    slot="prepend" class="select-size2" 
                    :disabled="editableFlag[index] === false">
                    <el-option
                      v-for="item in ltOptions" 
                      :label="item.label" 
                      :value="item.key">
                    </el-option>
                  </el-select>
                </el-input>
              </div>
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">结果小数位</span>
                <el-select 
                  v-model="reference.referenceParam.decimalsPlace" 
                  class="select-size3" 
                  :disabled="editableFlag[index] === false">
                   <el-option
                      v-for="item in decimalsOptions" 
                      :label="item.label" 
                      :value="item.key">
                    </el-option>
                </el-select>
                <span class="hsq-content-prefix prefix-second">单位</span>
                <el-input 
                  class="input-size3" 
                  v-model="reference.referenceParam.unit" 
                  placeholder="单位" 
                  :disabled="editableFlag[index] === false">
                </el-input>
              </div>
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">所属性别</span>
                <el-select 
                  class="select-size1" 
                  v-model="reference.referenceParam.gender" 
                  :disabled="projectGender !== '-1'">
                  <el-option
                    v-for="item in genderOption"
                    :key="item.prop"
                    :label="item.label"
                    :value="item.prop">
                  </el-option>
                </el-select>
              </div>
            </div>
            <!-- 阴阳型 -->
            <div class="reference-yinyang" v-if="reference.referenceParam.referenceType == '1'">
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">参考值</span>
                <el-select 
                  class="select-size1" 
                  v-if="reference.referenceParam.referenceType == '1'" 
                  v-model="reference.referenceParam.referenceValue" 
                  :disabled="editableFlag[index] === false">
                  <el-option
                    v-for="item in yinyangOptions" 
                    :label="item.label" 
                    :value="item.key">
                  </el-option>
                </el-select>
              </div>
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">所属性别</span>
                <el-select  
                  class="select-size1" 
                  v-model="reference.referenceParam.gender" 
                  :disabled="projectGender !== '-1'">
                  <el-option
                    v-for="item in genderOption"
                    :key="item.prop"
                    :label="item.label"
                    :value="item.prop">
                  </el-option>
                </el-select>
              </div>
            </div>
            <!-- 文字型 -->
            <div class="reference-text" v-if="reference.referenceParam.referenceType == '2'">
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">参考值</span>
                <el-select 
                  class="select-size1" 
                  v-if="reference.referenceParam.referenceType == '2'" 
                  v-model="reference.referenceParam.referenceCharType" 
                  @change="charTypeChangeFn(reference)" 
                  :disabled="editableFlag[index] === false">
                  <el-option
                    v-for="item in chardefaultFlagOptions" 
                    :label="item.value" 
                    :value="item.key">
                  </el-option>
                </el-select>
                <div>
                  <el-input 
                    class="input-textarea" 
                    v-if="reference.referenceParam.referenceType == '2' && (reference.referenceParam.referenceCharType == '2' || reference.referenceParam.referenceCharType == '3')" 
                    v-model="reference.referenceParam.referenceValue" 
                    type="textarea" 
                    :autosize="{ minRows: 2, maxRows: 4 }" 
                    placeholder="请输入内容" 
                    :disabled="editableFlag[index] === false">
                  </el-input>
                </div>
              </div>
              <div class="hsq-dialog-content-row">
                <span class="hsq-content-prefix">所属性别</span>
                <el-select 
                  class="select-size1" 
                  v-model="reference.referenceParam.gender" 
                  :disabled="projectGender !== '-1'">
                  <el-option
                    v-for="item in genderOption"
                    :key="item.prop"
                    :label="item.label"
                    :value="item.prop">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="add-relative" @click="addRelativeFn">新增参考值</p>
    </div>
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="saveReference">确定</div>
      <div class="cancel-btn" @click.stop="closeEdit">取消</div>
    </div>
  </div>
</div>
</template>

<script>
import HospitalManageApi from '@/fetch/report/hospitalManage'
import * as tool from '@/util/tool'
export default {
  name: 'EditReferenceDialog',
  props: [ 'editReferencesDialogType', 'editReferencesData' ],
  data () {
    return {
      isLoading: true,
      dialogTitle: '新建项目及参考值',
      projectName: '',
      // 科目性别
      gender: '-1',
      // 项目性别
      projectGender: '-1',
      genderOption: [{
        prop: '-1',
        label: '全性别'
      }, {
        prop: '0',
        label: '男'
      }, {
        prop: '1',
        label: '女'
      }],
      // 下拉框默认类型
      referencedefaultFlagType: null,
      // 类型选择下拉选框选项
      referenceTypeOptions: null,
      // 大于小于下拉选框选项
      ltOptions: [{
        label: '≤',
        key: '<='
      }, {
        label: '<',
        key: '<'
      }],
      gtOptions: [{
        label: '≥',
        key: '>='
      }, {
        label: '>',
        key: '>'
      }],
      // 小数位数下拉选框选项
      decimalsOptions: [{
        label: '0',
        key: 0
      }, {
        label: '1',
        key: 1
      }, {
        label: '2',
        key: 2
      }, {
        label: '3',
        key: 3
      }, {
        label: '4',
        key: 4
      }],
      // 阴性、弱阳性下拉选框选项
      yinyangOptions: [{
        label: '阴性',
        key: '阴性'
      }, {
        label: '弱阳性',
        key: '弱阳性'
      }],
      // 文字型默认提供的几个选项
      chardefaultFlagOptions: null,
      // 标记参数是否可以编辑，有报告使用时不可编辑
      editableFlag: [],
      references: [
      ]
    }
  },
  created () {
    if (this.editReferencesDialogType === 0) {
      this.dialogTitle = '新建项目及参考值'
    } else {
      this.dialogTitle = '编辑项目及参考值'
    }
    this.gender = this.editReferencesData.courseGender
    this.projectName = this.editReferencesData.projectName
    this.projectGender = this.editReferencesData.projectGender ? this.editReferencesData.projectGender : '-1'
    this.editableFlag = []
    this.init()
  },
  methods: {
    init () {
      // 初始化获取医院、科目、项目信息，获取下拉框类型
      HospitalManageApi.getComboxList()
        .then(res => {
          if (res.code === 'success') {
            this.referenceTypeOptions = res.data.referenceType
            this.chardefaultFlagOptions = res.data.referenceCharType
            this.referencedefaultFlagType = res.data.referenceType[0].key
            this.editableFlag = []
            // 新增
            if (this.editReferencesData.references.length === 0) {
              let obj = {
                id: '',
                referenceCode: '01',
                referenceParam: {
                  'referenceType': this.referencedefaultFlagType,
                  'referenceValue': [ '', '>=', '<=', '' ],
                  'decimalsPlace': 0,
                  'referenceCharType': '1',
                  'unit': '',
                  'defaultFlag': true,
                  'gender': this.projectGender
                }
              }
              this.references.push(obj)
              this.editableFlag.push(true)
              this.isLoading = false
            } else {
              // 编辑
              let refInfo = JSON.parse(JSON.stringify(this.editReferencesData.references))
              for (let i = 0; i < refInfo.length; i++) {
                if (refInfo[i].referenceParam.referenceType === '0') {
                  let result = []
                  let bothArr = refInfo[i].referenceParam.referenceValue.split('|')
                  let ltStr = bothArr[0]
                  let gtStr = bothArr[1]
                  if (ltStr.indexOf('>=') !== -1) {
                    result[0] = ltStr.split('>=').join('')
                    result[1] = '>='
                  } else if (ltStr.indexOf('>') !== -1) {
                    result[0] = ltStr.split('>').join('')
                    result[1] = '>'
                  }
                  if (gtStr.indexOf('<=') !== -1) {
                    result[2] = '<='
                    result[3] = gtStr.split('<=').join('')
                  } else if (gtStr.indexOf('<') !== -1) {
                    result[2] = '<'
                    result[3] = gtStr.split('<').join('')
                  }
                  refInfo[i].referenceParam.referenceValue = result
                }
                // 传入参考值可能为null，替换成默认为-1
                let passinReferenceGender = refInfo[i].referenceParam.gender ? refInfo[i].referenceParam.gender : '-1'
                // 参考值性别，当projectGender为全性别-1，等于传入的自己。否则跟随projectGender
                let referenceGender = this.projectGender === '-1' ? passinReferenceGender : this.projectGender
                refInfo[i].referenceParam.gender = referenceGender
                // 校验参考值是否可编辑
                this.checkReference(refInfo[i].referenceCode, i)
              }
              this.references = refInfo
            }
          }
        })
        .catch(() => {})
    },
    // 验证参考值是否可以编辑
    checkReference (referenceCode, index) {
      let hospitalCode = this.editReferencesData.hospitalCode
      let courseCode = this.editReferencesData.courseCode
      let projectCode = this.editReferencesData.projectCode
      HospitalManageApi.checkReference(hospitalCode, courseCode, projectCode, referenceCode)
        .then((res) => {
          this.$set(this.editableFlag, index, res.data)
          if (index === this.references.length - 1) {
            this.isLoading = false
          }
        })
        .catch(() => {})
    },
    // 参考值选择类型不同，初始化数据
    referenceTypeChange (reference, referenceType) {
      switch (referenceType) {
        case '0':
          this.$set(reference.referenceParam, 'referenceValue', [ '', '>=', '<=', '' ])
          this.$set(reference.referenceParam, 'decimalsPlace', 0)
          this.$set(reference.referenceParam, 'unit', '')
          break
        case '1':
          this.$set(reference.referenceParam, 'referenceValue', '阴性')
          break
        case '2':
          this.$set(reference.referenceParam, 'referenceValue', '未见明显异常')
          this.$set(reference.referenceParam, 'referenceCharType', '1')
          break
        default:
          break
      }
    },
    charTypeChangeFn (reference) {
      if (reference.referenceParam.referenceCharType === '1') {
        reference.referenceParam.referenceValue = '未见明显异常'
      } else if (reference.referenceParam.referenceCharType === '0') {
        reference.referenceParam.referenceValue = '无'
      } else {
        reference.referenceParam.referenceValue = ''
      }
    },
    // 改变项目性别属性，更新参考值的性别
    changeProjectGender () {
      for (let i = 0; i < this.references.length; i++) {
        this.$set(this.references[i].referenceParam, 'gender', this.projectGender)
      }
    },
    // 增加新的关联参考值
    getNewReferenceCode () {
      let referenceCodesArr = []
      this.references.forEach((reference) => {
        referenceCodesArr.push(reference.referenceCode)
      })
      let code = 1
      while (referenceCodesArr.indexOf(addZero(code)) !== -1) {
        code++
      }
      function addZero (num) {
        if (num < 10) {
          return '0' + num.toString()
        } else {
          return num.toString()
        }
      }
      return addZero(code)
    },
    addRelativeFn () {
      let obj = {
        id: '',
        referenceCode: this.getNewReferenceCode(),
        referenceParam: {
          'referenceType': this.referencedefaultFlagType,
          'referenceValue': [ '', '>=', '<=', '' ],
          'decimalsPlace': 0,
          'referenceCharType': '1',
          'unit': '',
          'gender': this.projectGender,
          'defaultFlag': false
        }
      }
      this.editableFlag.push(true)
      this.references.push(obj)
    },
    closeEdit () {
      this.$emit('close-edit', 'saveFinish')
    },
    changedefaultFlag (index) {
      this.references.forEach((reference, i) => {
        if (i === index) {
          reference.referenceParam.defaultFlag = true
        } else {
          reference.referenceParam.defaultFlag = false
        }
      })
    },
    // 删除参考值
    deleteFn (index) {
      // 删除时先校验至少一个参考值，再校验editableFlag是否可编辑删除。
      // 无id的参考值，直接页面移除。有id的调用接口删除
      if (this.references.length === 1) {
        tool.toast({
          type: 'warning',
          title: '至少需要一个参考值'
        })
        return
      }
      if (this.editableFlag[index]) {
        if (this.references[index].id === '') {
          this.references.splice(index, 1)
        } else {
          this.isLoading = true
          HospitalManageApi.deleteReference(this.references[index].id)
            .then(res => {
              if (res.data) {
                this.references.splice(index, 1)
                tool.toast({
                  type: 'success',
                  title: '删除成功'
                })
              }
              this.isLoading = false
            })
            .catch(() => {})
        }
      } else {
        tool.toast({
          type: 'warning',
          title: '该参考值不可删除'
        })
        return
      }
    },
    saveReference () {
      if (this.projectName === '') {
        tool.toast({
          type: 'warning',
          title: '请填写项目名称'
        })
        return
      }
      // 保存时必须选中一个默认参考值
      let hasdefaultFlag = false
      this.references.forEach((reference) => {
        if (reference.referenceParam.defaultFlag) hasdefaultFlag = true
      })
      if (!hasdefaultFlag) {
        tool.toast({
          type: 'warning',
          title: '请选择一个默认参考值'
        })
        return
      }
      let editInfo = {
        'hospitalCode': this.editReferencesData.hospitalCode,
        'hospitalName': this.editReferencesData.hospitalName,
        'courseCode': this.editReferencesData.courseCode,
        'courseName': this.editReferencesData.courseName,
        'courseGender': this.gender,
        'projectCode': this.editReferencesData.projectCode,
        'projectName': this.projectName,
        'projectGender': this.projectGender
      }
      let references = []
      for (let i = 0; i < this.references.length; i++) {
        let loopReference = this.references[i]
        let singleReference = {
          'id': loopReference.id,
          'referenceCode': loopReference.referenceCode,
          'referenceParam': {
            'gender': loopReference.referenceParam.gender,
            'defaultFlag': loopReference.referenceParam.defaultFlag
          }
        }
        let singleRefParam = singleReference.referenceParam
        if (loopReference.referenceParam.referenceType === '0') {
          // 数值型，处理referenceValue
          let referenceValue = loopReference.referenceParam.referenceValue
          if (referenceValue[0] === '') referenceValue[0] = '0'
          if (referenceValue[3] === '' || referenceValue[3] === '∞') referenceValue[3] = Infinity
          if (isNaN(Number(referenceValue[0])) || isNaN(Number(referenceValue[3]))) {
            tool.toast({
              type: 'warning',
              title: '请在数值型参考值的“结果”填写数字'
            })
            return
          }
          if (Number(referenceValue[3]) < Number(referenceValue[0])) {
            tool.toast({
              type: 'warning',
              title: '数值型参考值“结果”最大值不能小于最小值'
            })
            return
          }
          let referValue3 = referenceValue[3] === Infinity ? '∞' : referenceValue[3]
          singleRefParam.referenceValue = referenceValue[0] + referenceValue[1] + '|' + referenceValue[2] + referValue3
          singleRefParam.decimalsPlace = Number(loopReference.referenceParam.decimalsPlace)
          singleRefParam.unit = loopReference.referenceParam.unit
          singleRefParam.referenceType = loopReference.referenceParam.referenceType
        } else if (loopReference.referenceParam.referenceType === '1') {
          singleRefParam.referenceValue = loopReference.referenceParam.referenceValue
          singleRefParam.referenceType = loopReference.referenceParam.referenceType
        } else if (loopReference.referenceParam.referenceType === '2') {
          singleRefParam.referenceCharType = loopReference.referenceParam.referenceCharType
          singleRefParam.referenceValue = loopReference.referenceParam.referenceValue
          singleRefParam.referenceType = loopReference.referenceParam.referenceType
        }
        singleReference.referenceParam = JSON.stringify(singleRefParam)
        references.push(singleReference)
      }
      editInfo.references = references

      this.isLoading = true
      HospitalManageApi.editReferences(editInfo)
        .then(res => {
          if (res.code === 'success') {
            if (res.data) {
              tool.toast({
                type: 'success',
                title: '保存成功'
              })
              this.isLoading = false
              this.$emit('close-edit', 'saveFinish')
            }
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.edit-project-dialog-wrap {
  position: fixed;
  z-index: 99;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80%;
  width: 648px;
  overflow-y: auto;
  background-color: #fff;
  line-height: 30px;
}
.wrap-inner {
  padding: 0 10px 0 24px;
}
.dialog-content {
  position: relative;
}
.reference-wrap {
  /*max-height: 500px;
  overflow-y: auto;*/
}
.hsq-dialog-content-row {
  font-size: 0;
}
.input-brief {
  display: inline-block;
  width: 210px;
}
.prefix-second {
  margin-left: 16px;
}
.single-reference {
  background-color: #F7F7F9;
  padding: 0 24px;
  margin-right: 16px;
}
.single-reference-top {
  border-bottom: 1px solid rgba(0,0,0,.08);
  padding: 15px 0;
  position: relative;
}
.single-reference-top .fn-btns {
  position: absolute;
  right: 0;
  top: 15px;
  font-size: 18px;
}
.single-reference-top .fn-btn {
  display: inline-block;
  color: #03BFEE;
  cursor: pointer;
  margin-left: 16px;
  font-size: 12px;
  line-height: 18px;
}
.single-reference-bottom {
  padding-bottom: 16px;
}
.select-size1 {
  display: inline-block;
  width: 186px;
  vertical-align: top;
}
.input-size2 {
  vertical-align: top;
  width: 186px;
  overflow: hidden;
}
.input-size1 {
  display: inline-block;
  width: 512px;
}
.select-size3 {
  display: inline-block;
  width: 186px;
}
.input-size3 {
  display: inline-block;
  width: 186px;
}
.select-size2 {
  display: inline-block;
  width: 50px;
}
.select-size4 {
  display: inline-block;
  width: 357px;
}
.input-textarea {
  padding-left: 76px;
  display: inline-block;
  width: calc(100% - 80px);
  margin-top: 16px;
}
.add-relative {
  font-size: 12px;
  line-height: 30px;
  color: #03BFEE;
  cursor: pointer;
  text-align: center;
  margin: 16px 16px 24px 0px;
  background: #FAFAFA;
  border: 1px dotted #D9D9D9;
  border-radius: 2px;
}
</style>
