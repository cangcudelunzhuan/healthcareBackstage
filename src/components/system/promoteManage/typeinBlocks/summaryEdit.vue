<template>
  <div class="edit-block sumary-edit-block">
    <h3 class="project-name">健康总评</h3>
    <div class="preview-btn" @click="quickGenrate">快速生成健康总评</div>
    <div class="front-word-wrap">
      <editable-label :text="frontWord" @update="updateFrontWord($event)"></editable-label>
    </div>
    <div class="edit-item">
      <editable-textarea :text="summary" @update="updateSummary($event)"></editable-textarea>
    </div>
    <div class="summary-btn-wrap">
      <div class="summary-btn" @click="saveFn">保存继续填写</div>
    </div>
  </div>
</template>

<script>

import loadingMinin from '@/util/loadingMixin'
import { toast } from '@/util/tool'
import promoteManageApi from '@/fetch/report/promoteManage'
import editableLabel from './editableLabel'
import editableTextarea from './editableTextarea'

export default {
  mixins: [loadingMinin],
  components: {
    editableLabel,
    editableTextarea
  },
  props: ['schemeInfo'],
  data () {
    return {
      frontWord: '今年体检总体情况尚可，建议主要如下：',
      summary: '健康总评内容'
    }
  },
  created () {
    this.getHealthCareSummary()
  },
  methods: {
    getHealthCareSummary () {
      this.showLoading('正在获取..')
      promoteManageApi.getHealthCareSummary(this.schemeInfo.id)
        .then(res => {
          this.hideLoading()
          this.summary = res.data.remark
          this.frontWord = res.data.templete || '今年体检总体情况尚可，建议主要如下：'
          this.$emit('content-state-change', false)
        })
        .catch(() => {
          this.hideLoading()
        })
    },
    updateSummary (v) {
      this.summary = v
      this.$emit('content-state-change', true)
//      this.$forceUpdate()
    },
    updateFrontWord (v) {
      this.frontWord = v
    },
    quickGenrate () {
      let getHealthWellnessScheme = promoteManageApi.getHealthWellnessScheme(this.schemeInfo.id)
        .then(res => {
          return res.data
//          this.hideLoading()
//          this.dataList = res.data
//          this.$emit('content-state-change', false)
        })
        .catch(() => {})
      let getHealthDietScheme = promoteManageApi.getHealthDietScheme(this.schemeInfo.id)
        .then(res => {
          return res.data
//          this.hideLoading()
//          this.dataList = res.data
//          this.$emit('content-state-change', false)
        })
        .catch(() => {})
      this.showLoading('正在快速生成..')
      Promise.all([getHealthWellnessScheme, getHealthDietScheme])
        .then(([res1, res2]) => {
          toast({
            type: 'success',
            title: '快速生成成功'
          })
          this.hideLoading()
          let res = res1.concat(res2)
          this.summary = res.map(item => {
            return item.title
          }).join('|')
          this.frontWord = '今年体检总体情况尚可，建议主要如下：'
          this.$emit('content-state-change', false)
        })
        .catch(() => {
          this.hideLoading()
        })
    },
    saveFn (redirect) {
      this.showLoading('正在保存..')
      promoteManageApi.updateHealthCareSummary(this.summary, this.frontWord, this.schemeInfo.id)
        .then(res => {
          toast({
            type: 'success',
            title: '保存成功'
          })
          this.hideLoading()
          this.$emit('content-state-change', false)
          this.$emit('to-next-course', this.summary.length)
          if (redirect) {
            this.$store.dispatch('changePromotePath', 'reportList')
          }
        })
        .catch(() => {
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
.front-word-wrap {
  margin-bottom: 4px;
  /*margin-left: -8px;*/
  margin-top: -8px;
  font-weight: bold;
}
.edit-item {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 3px;
  padding: 16px 24px ;
}
.edit-item:hover {
  background: #F7F7F9;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
}
/*.editable-wrap {*/
  /*position: relative;*/
  /*padding-left: 60px;*/
  /*margin-top: 2px;*/
/*}*/
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
  margin-top: 16px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  line-height: 28px;
  padding: 0 16px;
  cursor: pointer;
}
.summary-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.summary-btn-wrap .summary-btn:last-of-type(1) {
  margin-right: 0;
}
</style>

