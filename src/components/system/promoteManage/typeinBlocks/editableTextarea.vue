<template>
  <div class="editable-textarea">
    <div class="display" @click="toEditing($event)" v-if="!editing" :class="{ 'display-empty': !text }">
      <!--<span>{{text}}</span><div class="edit-icon-wrap"><i class="el-icon-edit"></i></div>-->
      <!--<span v-html="displayText">{{text || '请输入'}}</span>-->
      <!--<span v-html="displayText"></span>-->
      <div class="display-inner">
        <span v-for="(textDisItem, $index) in displayText">
          <em v-if="displayText.length > 1 && !hideAlpha">{{sortNum[$index]}}.</em>
          <!--{{textDisItem}}<br />-->
          <span v-html="textDisItem"></span>
        </span>
      </div>
    </div>
    <div class="editing" v-if="editing" v-clickoutside="saveEdit">
      <el-input type="textarea" :rows="3" resize="none" v-model="editInput" placeholder="请输入内容" ref="input" @keyup.enter.native="saveEdit"></el-input><div class="edit-icon-wrap"><i class="el-icon-check" @click="saveEdit"></i><i class="el-icon-close" @click="cancelEdit($event)"></i></div>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'editable-textarea',
  props: ['text', 'hideAlpha'],
  directives: { Clickoutside },
  data () {
    return {
      editInput: '',
      editing: false,
      sortNum: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
    }
  },
  computed: {
    displayText () {
//      return this.text ? this.text.split('|').join('<br/>') : '请输入'
      return this.text ? this.text.split('|') : ['请输入']
    }
  },
  methods: {
    toEditing (e) {
      e.stopPropagation()
//      this.editInput = this.text
      this.editInput = this.text.replace(/&nbsp;/g, ' ').replace(/<br\/>/g, '\n')
      this.editing = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    saveEdit () {
      this.$emit('update', this.editInput.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'))
      this.editing = false
    },
    cancelEdit (e) {
      e.stopPropagation()
      this.editing = false
    }
  }
}
</script>

<style scoped>
.display span {
  /*display: inline-block;*/
  /*font-size: 14px;*/
  /*color: rgba(0,0,0,0.75);*/
  /*border-radius: 2px;*/
  /*padding-left: 8px;*/
  /*padding-right: 8px;*/
  /*line-height: 21px;*/
  /*box-sizing: border-box;*/
  display: block;
  font-size: 14px;
  color: rgba(0,0,0,0.75);
  border-radius: 2px;
  padding-left: 8px;
  padding-right: 8px;
  /*height: 35px;*/
  line-height: 35px;
  box-sizing: border-box;
}
/*.sumary-edit-block .display span {*/
  /*width: 100%;*/
  /*min-height: 100px;*/
/*}*/
.sumary-edit-block .display-inner {
  width: 100%;
  min-height: 100px;
}
.display-inner {
  border: 1px solid transparent;
}
.display.display-empty .display-inner, .display:hover .display-inner {
  border-color: #03BFEE;
  /*border: 1px solid #03BFEE;*/
  background: #FFFFFF;
  box-sizing: border-box;
}
em {
  font-style: normal;
}
.display em~span {
  display: inline;
}
/*.display span {*/
  /*border: 1px solid transparent;*/
/*}*/
/*.display.display-empty span, .display:hover span {*/
  /*border-color: #03BFEE;*/
  /*!*border: 1px solid #03BFEE;*!*/
  /*background: #FFFFFF;*/
  /*box-sizing: border-box;*/
/*}*/
i {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.display .edit-icon-wrap {
  vertical-align: top;
  margin-top: 3px;
  display: none;
}
.display:hover .edit-icon-wrap {
  display: inline-block;
}
.edit-icon-wrap {
  display: inline-block;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
  box-sizing: border-box;
}
.editing {
  padding-right: 59px;
  position: relative;
  /*height: 37px;*/
}
.editing i {
  color: #03BFEE;
}
.editing .edit-icon-wrap {
  /*position: absolute;*/
  /*right: 0;*/
  /*top: 3px;*/
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -14px;
}
.el-icon-check {
  position: relative;
  margin-right: 1px;
}
.el-icon-check:after {
  content: '';
  width: 1px;
  height: 12px;
  background: #E3E3E5;
  position: absolute;
  display: block;
  top: 7px;
  right: -1px;
}
</style>
