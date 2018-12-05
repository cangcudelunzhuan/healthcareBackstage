<template>
<div class="edit-hospital-dialog-wrap">
  <div class="wrap-inner">
    <h3 class="hsq-dialog-title">
      {{editHospitalDialogTitle}}
      <div class="hsq-btn-close" @click="closeEdit"></div>
    </h3>
    <div class="dialog-content hsq-dialog-content">
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix">机构编号</span>
        <el-input
          class="hospital-code"
          :disabled="true"
          v-model="hospitalData.code"
          >
        </el-input>
      </div>
      <div class="hsq-dialog-content-row">
        <span class="hsq-content-prefix"><em>*</em> 机构名称</span>
        <el-input
          class="hospital-code"
          v-model="hospitalName"
          >
        </el-input>
      </div>
    </div>
    <div class="hsq-btns">
      <div class="confirm-btn" @click.stop="saveHospital">确定</div>
      <div class="cancel-btn" @click.stop="closeEdit">取消</div>
    </div>
  </div>
</div>
</template>

<script>
import * as tool from '@/util/tool'
export default {
  name: 'EditHospitalDialog',
  // 新增、编辑的标题，医院相关数据
  props: [ 'editHospitalDialogType', 'hospitalData' ],
  data () {
    return {
      editHospitalDialogTitle: '新增机构',
      hospitalName: ''
    }
  },
  created () {
    if (this.editHospitalDialogType === 0) {
      this.editHospitalDialogTitle = '新增机构'
    } else {
      this.editHospitalDialogTitle = '编辑机构'
    }
    this.hospitalName = this.hospitalData.name
  },
  methods: {
    closeEdit () {
      this.$emit('close-edit')
    },
    saveHospital () {
      if (this.hospitalName === '') {
        tool.toast({
          type: 'warning',
          title: '请填写机构名称'
        })
        return
      }
      let hospitalInfo = {}
      for (let attr in this.hospitalData) {
        if (attr === 'name') {
          hospitalInfo.name = this.hospitalName
        } else {
          hospitalInfo[attr] = this.hospitalData[attr]
        }
      }
      this.$emit('save-hospital', hospitalInfo)
    }
  }
}
</script>

<style scoped>
.edit-hospital-dialog-wrap {
  width: 480px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.wrap-inner {
  padding: 0 24px;
}
.dialog-content {
  padding-bottom: 125px;
}
.hospital-code {
  display: inline-block;
  width: 350px;
}
</style>
