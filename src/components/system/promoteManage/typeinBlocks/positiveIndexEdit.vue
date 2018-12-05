<template>
  <div class="edit-block"
    v-loading="loading.active"
    :element-loading-text="loading.text">
    <!--<h3 class="project-name">2016年体检阳性指标解释、病因</h3>-->
    <!--<h3 class="project-name">阳性指标解释、病因</h3>-->
    <h3 class="project-name">{{ schemeInfo.checkupTime.substring(0, 4) }}年阳性指标解释、病因</h3>
    <div class="preview-btn" @click="addNew">新&nbsp;增</div>
    <div class="edit-item" v-for="(item, $index) in positiveIndexList" :key="$index">
      <!--<editable-label :text="item.title" class="positive-index-title" @update="updatePositiveIndex($event, $index, 'title')"></editable-label>-->
      <div class="editable-wrap"><label>{{ $index + 1 }}、</label><editable-label :text="item.title" @update="updatePositiveIndex($event, $index, 'title')"></editable-label><el-button type="text" @click="delItem($index)">删除</el-button></div>
      <div class="editable-wrap"><label>医学解释：</label><editable-label :text="item.remark" @update="updatePositiveIndex($event, $index, 'remark')"></editable-label></div>
      <div class="editable-wrap"><label>常见病因：</label><editable-label :text="item.cause" @update="updatePositiveIndex($event, $index, 'cause')"></editable-label></div>
    </div>
    <div class="blank-tip" v-if="positiveIndexList.length === 0">
      <p>暂无内容，现在 <span @click="addNew">添加？</span></p>
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
      positiveIndexList: []
//      positiveIndexList: [{
//        title: '1、人乳头瘤病毒（HPV）52型DNA阳性',
//        explain: '是一种是上脾性DNS病毒',
//        reason: '主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播',
//        p: '主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播主要通过性接触传播，也可听过日常生活用品、皮肤、唾液、乳液、胃肠道等传播'
//      }]
    }
  },
  created () {
    this.getPositiveIndex()
  },
  methods: {
    getPositiveIndex () {
      this.showLoading('正在获取..')
      promoteManageApi.getPositiveIndex(this.schemeInfo.id)
        .then(res => {
          this.hideLoading()
          this.positiveIndexList = res.data
          this.$emit('content-state-change', false)
        })
        .catch(() => {
          this.hideLoading()
        })
    },
    updatePositiveIndex (v, $index, key) {
      this.positiveIndexList[$index][key] = v
      this.$forceUpdate()
      this.$emit('content-state-change', true)
    },
    delItem (index) {
      this.positiveIndexList.splice(index, 1)
      this.$emit('content-state-change', true)
    },
    addNew () {
      this.positiveIndexList.push({
        title: '',
        cause: '',
        remark: ''
      })
      this.$emit('content-state-change', true)
      this.$nextTick(() => {
        document.querySelector('#promoteTypeinWrap').scrollTop = 10000
      })
    },
    saveFn (redirect) {
      this.positiveIndexList.forEach((item, index) => {
        item.sort = index + 1
        item.schemeId = this.schemeInfo.id
        delete item.id
        delete item.createUser
        delete item.createTime
        delete item.updateUser
        delete item.updateTime
      })
      this.showLoading('正在保存..')
      promoteManageApi.updatePositiveIndex(this.positiveIndexList, this.schemeInfo.id)
        .then(res => {
          toast({
            type: 'success',
            title: '保存成功'
          })
          this.hideLoading()
          this.$emit('content-state-change', false)
          this.$emit('to-next-course', this.positiveIndexList.length)
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
  .editable-wrap {
    position: relative;
    padding-left: 60px;
    margin-top: 2px;
  }
  .edit-item .editable-wrap:first-child {
    /*padding-left: 0;*/
    padding-left: 20px;
    padding-right: 60px;
    font-weight: bold;
  }
  .editable-wrap>label {
    position: absolute;
    top: 0;
    left: 0;
    line-height: 37px;
  }
  .editable-wrap button {
    position: absolute;
    top: 0;
    right: 0;
    border: none!important;
  }
  .preview-btn {
    float: right;
    width: 54px;
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
    /*margin-top: 16px;*/
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
