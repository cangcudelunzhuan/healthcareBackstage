<template>
  <div class="editable-label">
    <!--<div class="display" @click="toEditing($event)" v-if="!editing">-->
    <div class="display" @click="toEditing($event)" v-if="!editing" :class="{ 'display-empty': !text }">
      <!--<span>{{text || '请输入'}}</span><div class="edit-icon-wrap"><i class="el-icon-edit"></i></div>-->
      <div class="display-inner">
        <span v-for="(textDisItem, $index) in textDis">
          <em v-if="textDis.length > 1">{{sortNum[$index]}}.</em>
          <span v-html="textDisItem"></span>
        </span>
      </div><div class="edit-icon-wrap"><i class="el-icon-edit"></i></div>
    </div>
    <div class="editing" v-if="editing" v-clickoutside="saveEdit">
    <!--<div class="editing" v-clickoutside="saveEdit">-->
      <el-input v-model="editInput" placeholder="请输入内容" ref="input" @keyup.enter.native="saveEdit"></el-input><div class="edit-icon-wrap"><i class="el-icon-check" @click="saveEdit"></i><i class="el-icon-close" @click="cancelEdit($event)"></i></div>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'editable-label',
  props: ['text'],
  computed: {
    textDis () {
      return this.text ? this.text.split('|') : ['请输入']
    }
  },
  directives: { Clickoutside },
  data () {
    return {
      editInput: '',
      editing: false,
      sortNum: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
    }
  },
  methods: {
    toEditing (e) {
      e.stopPropagation()
//      this.editInput = this.text
      this.editInput = this.text.replace(/&nbsp;/g, ' ')
      this.editing = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    saveEdit () {
      this.$emit('update', this.editInput.replace(/\s/g, '&nbsp;'))
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
.display {
  position: relative;
  padding-right: 59px;
  /*height: 37px;*/
}
.display span {
  display: block;
  font-size: 14px;
  color: rgba(0,0,0,0.75);
  border-radius: 2px;
  padding-left: 8px;
  padding-right: 8px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /*max-width: 90%;*/
  /*border: 1px solid #03BFEE;*/
  /*background: #FFFFFF;*/
  width: 100%;
}
/*.display.display-empty span, .display:hover span {*/
  /*border: 1px solid #03BFEE;*/
  /*background: #FFFFFF;*/
/*}*/
.display .display-inner {
  border: 1px solid transparent;
}
.display.display-empty .display-inner, .display:hover .display-inner {
  /*border: 1px solid #03BFEE;*/
  border-color: #03BFEE;
  background: #FFFFFF;
  box-sizing: border-box;
}
em {
  font-style: normal;
}
.display em~span {
  display: inline;
}
i {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.display .edit-icon-wrap {
  /*vertical-align: top;*/
  /*margin-top: 3px;*/
  display: none;
  position: absolute;
  right: 29px;
  /*top: 3px;*/
  top: 50%;
  margin-top: -14px;
}
.display:hover .edit-icon-wrap {
  /*display: inline-block;*/
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
  height: 37px;
}
.editing i {
  color: #03BFEE;
}
.editing .edit-icon-wrap {
  position: absolute;
  right: 0;
  top: 3px;
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
