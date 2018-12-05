<template>
  <div class="edit-block"
    v-loading="loading.active"
    :element-loading-text="loading.text">
    <h3 class="project-name">阳性指标复查时间安排</h3>
    <div class="subtitle">
      <span>复查项目及时间</span>
      <div class="preview-btn" @click="addNew">新增</div>
    </div>
    <div class="review-item-wrap">
      <div class="review-item" v-for="(item, $index) in reviewList" :key="$index">
        <span>{{ $index + 1 }}、{{ item.title }} / </span>
        <el-date-picker
        v-model="item.reexaminationTime"
        type="month"
        format="yyyy年MM月"
        value-format="yyyy-MM"
        placeholder="选择复查时间">
        </el-date-picker>
        <el-button type="text" @click="delReviewItem($index)">删除</el-button>
      </div>
    </div>
    <div class="blank-tip" v-if="reviewList.length === 0">
      <p>暂无内容，现在 <span @click="addNew">添加？</span></p>
    </div>
    <div class="subtitle" v-if="reviewList.length !== 0">
      <span>推送内容<el-tooltip content="推送规则：设置好推送规则后，会员将于项目复查时间前一个月的25号XX点在微信公众号，吉利C3 APP订阅号（仅吉利员工），个人手机短信，收到复查推送消息。若15号为节假日，则顺延后一天提醒。" placement="right" popper-class="tip-popper-from-title" effect="dark">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </span>
      <div class="preview-btn" @click="generateReviewPushList">快速生成推送内容</div>
    </div>
    <div class="front-word-wrap">
      <editable-label :text="frontWord" @update="updateFrontWord($event)" v-if="reviewList.length !== 0"></editable-label>
    </div>
    <div class="edit-item" v-for="(item, $index) in reviewPushList" :key="$index" v-if="reviewList.length !== 0">
      <div class="edit-title">{{ $index + 1 }}、{{ item.reexaminationTime }}</div>
      <div class="editable-wrap"><editable-label :text="item.title" @update="updateReviewPushList($event, $index, 'title')"></editable-label></div>
    </div>
    <div class="blank-tip" v-if="reviewList.length !== 0 && reviewPushList.length === 0">
      <p>暂无推送内容，现在 <span @click="generateReviewPushList">快速生成？</span></p>
    </div>
    <div class="summary-btn-wrap">
      <div class="summary-btn" @click="saveFn">保存</div>
      <div class="summary-btn" @click="openPushPreveiw">推送效果预览</div>
    </div>
    <!--弹窗部分-->
    <div class="shadow-bg" v-if="isShadow"></div>
    <!--项目选择树结构弹窗-->
    <select-project-dialog
      v-if="isProjectSelect"
      :reviewList="reviewList"
      :hospitalCode="schemeInfo.hospitalId"
      @add-new-project="addNewProject"
      @close-select="closeProjectSelect">
    </select-project-dialog>
    <phone-push-preview
      v-if="isPhonePushPreveiw"
      :frontWord="frontWord"
      :dataList="reviewPushList"
      @close-dialog="closePushPreview">
    </phone-push-preview>
  </div>
</template>

<script>

import loadingMinin from '@/util/loadingMixin'
import { toast } from '@/util/tool'
import promoteManageApi from '@/fetch/report/promoteManage'
import editableLabel from './editableLabel'
import selectProjectDialog from './selectProjectDialog'
import phonePushPreview from './phonePushPreview'
// import editableTextarea from './editableTextarea'

export default {
  mixins: [loadingMinin],
  components: {
    editableLabel,
    selectProjectDialog,
    phonePushPreview
//    editableTextarea
  },
  props: ['schemeInfo'],
  data () {
    return {
      summary: '健康总评内容',
      isShadow: false,
      isProjectSelect: false,
//      currentSelectedHospitalCode: '0000',
      reviewList: [],
//      reviewList: [{
//        name: '复查乳腺B超1',
//        time: ''
//      }, {
//        name: '乳腺B超2',
//        time: ''
//      }, {
//        name: '乳腺B超3',
//        time: ''
//      }],
      frontWord: '',
      reviewPushList: [],
//      reviewPushList: [{
//        time: '2018年3月',
//        content: '复查乳腺B超1'
//      }, {
//        time: '2018年4月',
//        content: '复查乳腺B超2'
//      }, {
//        time: '近期',
//        content: '复查乳腺B超3'
//      }]
      isPhonePushPreveiw: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.showLoading('正在获取..')
      let getReexaminationTime = promoteManageApi.getReexaminationTime(this.schemeInfo.id)
        .then(res => {
//          this.hideLoading()
//          res.data.forEach((item, index) => {
//            item.courseCode = '001'
//            item.projectCode = '00' + (index + 1)
//          })
          return res.data
//          this.reviewList = res.data
//          this.$emit('content-state-change', false)
        })
        .catch(() => {
//          this.hideLoading()
        })
      let getReexaminationMessage = promoteManageApi.getReexaminationMessage(this.schemeInfo.id)
        .then(res => {
//          this.hideLoading()
          return res.data
//          this.reviewPushList = res.data
//          this.$emit('content-state-change', false)
        })
        .catch(() => {
//          this.hideLoading()
        })
      Promise.all([getReexaminationTime, getReexaminationMessage])
        .then(([res1, res2]) => {
          this.hideLoading()
          this.reviewList = res1
          this.reviewPushList = res2
          if (res2.length > 0) {
            this.frontWord = this.reviewPushList[0].templete || '根据您的体检报告，对您的阳性指标复查时间安排建议如下：'
          }
          this.$emit('content-state-change', false)
        })
        .catch(() => {
          this.hideLoading()
        })
    },
    addNew () {
      this.isShadow = true
      this.isProjectSelect = true
    },
    addNewProject (projects) {
      projects.forEach(item => {
        this.reviewList.push({
          title: item.name,
          reexaminationTime: '',
          courseCode: item.parentCode,
          projectCode: item.code
        })
      })
      this.$emit('content-state-change', true)
    },
    delReviewItem (index) {
      this.reviewList.splice(index, 1)
      this.$emit('content-state-change', true)
    },
    closeProjectSelect (closeWay) {
//      if (closeWay === 'saveFinish') {
//        this.getCourseList(this.currentSelectedHospitalCode, this.scrollToBottomFn)
//      }
      this.isShadow = false
      this.isProjectSelect = false
    },
    generateReviewPushList () {
//      console.log(this.reviewList)
      let sortMap = {}
      this.reviewList.forEach(item => {
        let key = item.reexaminationTime || '未定时间'
        sortMap[key] = sortMap[key] ? sortMap[key] + '、' + item.title : item.title
      })
      let sortArr = Object.keys(sortMap).map(key => {
        return {
          reexaminationTime: key === '未定时间' ? '未定时间' : key.replace('-', '年') + '月',
          time: key,
          title: '复查' + sortMap[key]
        }
      }).sort((a, b) => {
        if (a.time === '未定时间') return 1
        if (b.time === '未定时间') return -1
        return new Date(a.time.replace('-', '/') + '/01') - new Date(b.time.replace('-', '/') + '/01')
      })
      this.reviewPushList = sortArr
      this.frontWord = '根据您的体检报告，对您的阳性指标复查时间安排建议如下：'
      this.$emit('content-state-change', true)
    },
    updateFrontWord (v) {
      this.frontWord = v
      this.$emit('content-state-change', true)
    },
    updateReviewPushList (v, $index, key) {
      this.reviewPushList[$index][key] = v
      this.$forceUpdate()
      this.$emit('content-state-change', true)
    },
    openPushPreveiw () {
      this.isPhonePushPreveiw = true
    },
    closePushPreview () {
      this.isPhonePushPreveiw = false
    },
    saveFn (redirect) {
      let reexaminationTimeLack = false
      this.reviewList.forEach((item, index) => {
        item.sort = index + 1
        item.schemeId = this.schemeInfo.id
        delete item.id
        delete item.createUser
        delete item.createTime
        delete item.updateUser
        delete item.updateTime
        if (!item.reexaminationTime) {
          reexaminationTimeLack = true
        }
      })
      if (reexaminationTimeLack) {
        toast({
          type: 'error',
          title: '部分项目未选择复查时间'
        })
        return new Error('部分项目未选择复查时间')
      }
      this.reviewPushList.forEach((item, index) => {
        item.sort = index + 1
        item.schemeId = this.schemeInfo.id
        item.templete = this.frontWord || ''
        delete item.id
        delete item.createUser
        delete item.createTime
        delete item.updateUser
        delete item.updateTime
      })
      this.showLoading('正在保存..')
      let updateReexaminationTime = promoteManageApi.updateReexaminationTime(this.reviewList, this.schemeInfo.id)
        .then(res => {
          return res
//          toast({
//            type: 'success',
//            title: '保存成功'
//          })
//          this.hideLoading()
//          this.$emit('content-state-change', false)
//          this.$emit('to-next-course')
        })
//        .catch(() => {
//          this.hideLoading()
//        })
      let updateReexaminationMessage = promoteManageApi.updateReexaminationMessage(this.reviewPushList, this.schemeInfo.id)
        .then(res => {
          return res
//          toast({
//            type: 'success',
//            title: '保存成功'
//          })
//          this.hideLoading()
//          this.$emit('content-state-change', false)
//          this.$emit('to-next-course')
        })
//        .catch(() => {
//          this.hideLoading()
//        })
      Promise.all([updateReexaminationTime, updateReexaminationMessage])
        .then(([res1, res2]) => {
          this.hideLoading()
          if (res1.code === 'success' && res2.code === 'success') {
            toast({
              type: 'success',
              title: '保存成功'
            })
            this.$emit('content-state-change', false)
            this.$emit('to-next-course', this.reviewList.length)
            if (redirect) {
              this.$store.dispatch('changePromotePath', 'reportList')
            }
          }
//          this.$emit('to-next-course')
        })
//        .catch((err) => {
        .catch(() => {
//          console.log(err)
          this.hideLoading()
        })
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
.el-tooltip {
  color: #515152;
  font-size: 12px;
  margin-left: 8px;
}
.front-word-wrap {
  margin-bottom: 4px;
  /*margin-left: -8px;*/
  /*margin-top: -8px;*/
  font-weight: bold;
}
.edit-item {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 3px;
  padding: 16px 24px ;
  margin-bottom: 16px;
}
.edit-item:hover {
  background: #F7F7F9;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
}
.edit-title {
  font-size: 14px;
  line-height: 21px;
  margin-bottom: 8px;
  font-weight: bold;
}
.editable-wrap {
  /*position: relative;*/
  /*padding-left: 60px;*/
  /*margin-top: 2px;*/
}
/*.edit-item .editable-wrap:first-child {*/
  /*padding-left: 0;*/
  /*padding-right: 60px;*/
/*}*/
/*.editable-wrap>label {*/
  /*position: absolute;*/
  /*top: 0;*/
  /*left: 0;*/
  /*line-height: 37px;*/
/*}*/
/*.editable-wrap button {*/
  /*position: absolute;*/
  /*top: 0;*/
  /*right: 0;*/
  /*border: none!important;*/
/*}*/
.subtitle {
  position: relative;
  color: #000;
  font-size: 14px;
  line-height: 24px;
  padding-bottom: 16px;
}
.subtitle span {
  font-weight: bold;
}
.preview-btn {
  float: right;
  /*width: 120px;*/
  padding: 0 16px;
  height: 28px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  margin-right: 12px;
  background-color: #fff;
}
.preview-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.edit-block .preview-btn {
  position: absolute;
  top: 0px;
  right: 0;
  margin-right: 0;
}
.summary-btn-wrap {
  padding-bottom: 20px;
}
.summary-btn-wrap:after {
  content: '';
  display: block;
  clear: both;
}
.summary-btn-wrap .summary-btn {
  float: right;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  line-height: 28px;
  padding: 0 16px;
  cursor: pointer;
}
.summary-btn-wrap .summary-btn:nth-of-type(2) {
  margin-right: 8px;
}
.summary-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.summary-btn-wrap .summary-btn:last-of-type(1) {
  margin-right: 0;
}
/*弹窗背景遮罩*/
.shadow-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 90;
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
