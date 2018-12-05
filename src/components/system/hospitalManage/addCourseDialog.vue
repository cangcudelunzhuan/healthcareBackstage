<template>
<div class="add-course-dialog" ref="baseCourseDialog">
  <div class="wrap-inner">
    <h3 class="hsq-dialog-title">
      {{editCourseDialogTitle}}
      <div class="hsq-btn-close" @click="closeEdit"></div>
    </h3>
    <div class="hsq-dialog-content dialog-content">
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix"><em>*</em> 科目名称</span>
        <el-input
          class="info-input" 
          v-model="courseName" 
          placeholder="请输入科目名称"
          >
        </el-input>
      </div>
      <div class="hsq-dialog-content-row ">
        <span class="hsq-content-prefix"><em>*</em> 所属性别</span>
        <el-select
          v-model="courseGender"
          :disabled="baseCourseData.hospitalCode === '0000' ? false : true"
          @change="genderTipShow">
          <el-option
            v-for="item in genderOption"
            :key="item.prop"
            :label="item.label"
            :value="item.prop">
          </el-option>
        </el-select>
        <p class="gender-tip"
          v-if="baseEditCourseDialogType != 0">
          &nbsp;<span v-if="genderTipFlag">{{genderTipText}}</span>
        </p>
      </div>
      <div class="hsq-dialog-content-row" v-if="baseCourseData.hospitalCode === '0000'">
        <span class="hsq-content-prefix"><em>*</em> 科目Icon</span>
        <div class="icons-wrap" id="icons-wrap">
          <span v-for="(item, index) in iconArr" class="selectIcon" @click.stop="selectIconFn($event, item, index)">
            <i class="iconfont" :class="[item, {active: iconUrl == item}, {ieColor: iconUrl == item && isIE}]"></i>
            <span class="chenggong-span"><i class="el-icon-check"></i></span>
          </span>
        </div>
      </div>
    </div>
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="saveNewCourse">确定</div>
      <div class="cancel-btn" @click.stop="closeEdit">取消</div>
    </div>
  </div>
</div>
</template>

<script>
import HospitalManageApi from '@/fetch/report/hospitalManage'
import * as tool from '@/util/tool'
export default {
  name: 'AddCourseDialog',
  props: [ 'baseEditCourseDialogType', 'baseCourseData' ],
  data () {
    return {
      // IE浏览器渐变色文字样式兼容性
      isIE: false,
      editCourseDialogTitle: '新建科目',
      courseCode: '',
      courseName: '',
      courseGender: '-1',
      genderTipFlag: false,
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
      iconUrl: null,
      // iconfont类名数组
      iconArr: ['icon-yibanxiangmujiancha', 'icon-neike', 'icon-waike', 'icon-yanke', 'icon-erbihouke', 'icon-fuke', 'icon-xindiantu', 'icon-gumidu', 'icon-binglike', 'icon-Chuxishiyan', 'icon-Bchao', 'icon-CT', 'icon-cigongzhen', 'icon-jingluduopuleTCD', 'icon-shenghua', 'icon-niaoshengongneng', 'icon-tangleidaixie', 'icon-xieyechanggui', 'icon-niaoyechanggui', 'icon-fenbianchanggui', 'icon-jiazhuangxiangongneng', 'icon-gongjingfenmiwujiancha', 'icon-zhongliubiaozhiwu', 'icon-tanhuqishiyan', 'icon-putaotang', 'icon-baidaichanggui', 'icon-mianyiqiudanbaibuti', 'icon-ningxiegongneng', 'icon-xibaomianyigongnengquantaoxiangkongfu', 'icon-xingjisuquantao', 'icon-xieniandu', 'icon-yigansanxijiancha', 'icon-yiganbingduDNAdingliang', 'icon-yidaosuCtai', 'icon-Xpian']
    }
  },
  computed: {
    genderTipText () {
      if (this.courseGender === '-1') {
        return '项目及参考值性别可更改'
      } else if (this.courseGender === '0') {
        return '项目及参考值性别将同步更换为男性，不可更改'
      } else if (this.courseGender === '1') {
        return '项目及参考值性别将同步更换为女性，不可更改'
      } else {
        return ''
      }
    }
  },
  created () {
    // 判断是否为IE
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      this.isIE = true
    }
  },
  mounted () {
    if (this.baseEditCourseDialogType === 0) {
      this.editCourseDialogTitle = '新建科目'
    } else {
      this.editCourseDialogTitle = '编辑科目'
    }
    this.courseCode = this.baseCourseData.courseCode
    this.courseName = this.baseCourseData.courseName
    this.iconUrl = this.baseCourseData.iconUrl
    this.courseGender = this.baseCourseData.courseGender
  },
  methods: {
    closeEdit () {
      this.$emit('close-edit', 'close')
    },
    genderTipShow () {
      this.genderTipFlag = true
    },
    saveNewCourse () {
      if (this.courseName === '') {
        tool.toast({
          type: 'warning',
          title: '请填写科目名称'
        })
        return
      }
      if (!this.iconUrl) {
        tool.toast({
          type: 'warning',
          title: '请选择科目Icon'
        })
        return
      }
      // 当科目性别从全性别变为男\女的时候，弹出警告
      // 模板调用的编辑科目名称、icon接口
      if (this.baseCourseData.hospitalCode === '0000') {
        HospitalManageApi.baseEditCourse(this.courseCode, this.courseName, this.iconUrl, this.courseGender)
          .then(res => {
            if (res.code === 'success') {
              tool.toast({
                type: 'success',
                title: '保存成功'
              })
              this.$emit('close-edit', 'saveFinish')
            }
          })
          .catch(() => {
          })
      } else {
      // 非模板调用的编辑科目名称
        HospitalManageApi.editCourse(this.courseCode, this.baseCourseData.hospitalCode, this.courseName)
          .then(res => {
            if (res.code === 'success') {
              tool.toast({
                type: 'success',
                title: '保存成功'
              })
              this.$emit('close-edit', 'saveFinish')
            }
          })
          .catch(() => {
          })
      }
    },
    selectIconFn (event, item, index) {
      let icons = this.$refs.baseCourseDialog.querySelectorAll('.selectIcon')
      for (let i = 0; i < icons.length; i++) {
        let firstIcon = icons[i].querySelector('i')
        if (i === index) {
          firstIcon.classList.add('active')
          if (this.isIE) {
            icons[i].classList.add('ieColor')
          }
        } else {
          firstIcon.classList.remove('active')
          if (this.isIE) {
            icons[i].classList.remove('ieColor')
          }
        }
      }
      this.iconUrl = item
    }
  }
}
</script>

<style scoped>
.add-course-dialog {
  width: 480px;
  background-color: #fff;
  position: fixed;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80%;
  overflow-y: auto;
  z-index: 99;
}
.wrap-inner {
  padding: 0 24px;
}
.dialog-content {
  padding-bottom: 16px;
}
.info-input {
  display: inline-block;
  width: 350px;
}
.gender-tip {
  color: #f00;
  padding-left: 76px;
}
.icons-wrap {
  display: inline-block;
  vertical-align: top;
  width: 356px;
  font-size: 26px;
  line-height: 44px;
  margin-left: -6px;
}
.icons-wrap:after {
  content: '';
  display: block;
  clear: both;
}
.icons-wrap>span {
  float: left;
  width: 44px;
  height: 44px;
  text-align: center;
  border: 1px solid #F5F5F5;
  box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
  border-radius: 8px;
  color: #D9D9D9;
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  position: relative;
}
.icons-wrap>span:nth-of-type(6n) {
  margin-right: 0px;
}
.icons-wrap i {
  font-size: 26px;
}
.chenggong-span {
  display: none;
}
.icons-wrap .active {
  background-image: -webkit-gradient(linear, 0 0, right bottom, from(#03BFEE), to(#1DE9B6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.icons-wrap .active+.chenggong-span {
  display: inline-block;
  position: absolute;
  right: -3px;
  top: -3px;
  color: #fff;
  font-weight: bold;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(-48deg, #1DE9B6 0%, #03BFEE 98%);
}
.chenggong-span i {
  font-size: 10px;
  line-height: 16px;
  color: #fff;
  font-weight: bold;
  vertical-align: top;
}
.icons-wrap .ieColor {
  color: #03BFEE;
}
/*兼容ie，文字渐变色变为固定颜色*/
</style>
