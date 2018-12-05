<template>
<div class="base-info-wrap" v-loading.lock="isLoading" element-loading-text="保存中...">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">报告管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">新建体检报告</span>
  </div>
  <div class="start-typein-btn greenBack" @click="save">开始录入</div>
  <div class="content">
    <h2>基础信息录入</h2>
    <div class="form-area">
      <div class="row">
        <span class="label">体检会员</span>
        <el-input class="member-input" placeholder="请输入" disabled v-model="memberName"></el-input>
        <span class="add-member-btn" @click.stop="openSelect"><i class="iconfont icon-tianjiaIcon"></i>添加会员</span>
        <span class="label second-label">会员工号</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="memberNo"></el-input>
      </div>
      <div class="row">
        <span class="label">性别</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="genderLabel"></el-input>
        <span class="label second-label">会员岗级</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="grade"></el-input>
      </div>
      <div class="row">
        <span class="label">体检年龄</span>
        <el-input class="full-input" placeholder="请输入" v-model="age" clearable></el-input>
        <span class="label second-label">检查机构</span>
        <el-select class="full-input" v-model="hospitalCode" placeholder="请选择体检机构">
          <el-option v-for="item in hospitalOptions"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <div class="row">
        <span class="label">报告类型</span>
        <el-select class="full-input" v-model="reportType" placeholder="请选择报告类型">
          <el-option v-for="item in reportTypeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="label second-label">检查时间</span>
         <el-date-picker
          class="full-input"
          v-model="datePicker"
          :picker-options="pickerOptions"
          type="date"
          placeholder="选择体检时间"
          :clearable="false">
        </el-date-picker>
      </div>
    </div>
  </div>
  <!--<div class="bottom-wrap">
    <div class="start-typein-btn greenBack" @click="save">开始录入</div>
  </div>-->
  <select-member
    @close-select="closeSelect"
    @select-change="memberSelectFn"
    v-if="memberSelectShow">
  </select-member>
</div>
</template>

<script>
import selectMember from './selectMember'
import reportManageApi from '@/fetch/report/reportManage'
import { toast } from '@/util/tool'
import store from '@/vuex/store'
export default {
  name: 'ReportBaseInfo',
  components: {
    selectMember
  },
  data () {
    return {
      isLoading: false,
      memberSelectShow: false,
      memberName: '',
      memberNo: '',
      gender: '',
      grade: '',
      age: '',
      hospitalCode: '',
      hospitalOptions: null,
      reportType: '1',
      reportTypeOptions: [
        { label: '体检报告', value: '1' },
        { label: '就诊报告单', value: '2' }
      ],
      datePicker: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  computed: {
    genderLabel () {
      if (this.gender === '0') {
        return '男'
      } else if (this.gender === '1') {
        return '女'
      } else {
        return ''
      }
    },
    hospitalName () {
      for (let i = 0; i < this.hospitalOptions.length; i++) {
        if (this.hospitalOptions[i].code === this.hospitalCode) {
          return this.hospitalOptions[i].name
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      reportManageApi.getHospitalList()
        .then(res => {
          // {id: 767, code: "0005", name: "浙二医院", parentCode: null, level: "1"}
          this.hospitalOptions = res.data
        })
        .catch(() => {})
    },
    openSelect () {
      this.memberSelectShow = true
    },
    closeSelect () {
      this.memberSelectShow = false
    },
    memberSelectFn (memberInfo) {
      this.memberName = memberInfo.empName
      this.memberNo = memberInfo.empNo
      this.gender = memberInfo.gender
      this.grade = memberInfo.grade
    },
    async save () {
      if (this.memberName === '' || this.memberNo === '' || this.gender === '') {
        toast({type: 'warning', title: '请添加会员'})
        return
      }
      if (this.age === '') {
        toast({type: 'warning', title: '请填写体检年龄'})
        return
      }
      if (!Number(this.age)) {
        toast({type: 'warning', title: '体检年龄只能填写数字'})
        return
      }
      if (this.hospitalCode === '') {
        toast({type: 'warning', title: '请选择检查机构'})
        return
      }
      if (this.datePicker === '') {
        toast({type: 'warning', title: '请选择检查时间'})
        return
      }
      await this.$store.dispatch('checkSure', {title: '开始录入报告吗?', msg: '确认后基础信息不可更改，请问要开始录入报告吗？'})
      let info = {
        empName: this.memberName,
        empNo: this.memberNo,
        staffSex: this.gender,
        grade: this.grade,
        staffAge: this.age,
        hospitalCode: this.hospitalCode,
        hospitalName: this.hospitalName,
        reportType: this.reportType,
        checkupTime: this.formatDate(this.datePicker)
      }
      this.isLoading = true
      reportManageApi.addBaseInfo(info)
        .then((res) => {
          this.isLoading = false
          if (res.data === false) {
            toast({
              type: 'warning',
              title: '报告已存在，请勿重复添加'
            })
          } else {
            store.dispatch('changeReportId', res.data)
            this.goReportTypein()
          }
        })
        .catch(() => {})
    },
    formatDate (t) {
      let y = t.getFullYear()
      let m = t.getMonth() + 1
      let d = t.getDate()
      return y.toString() + (m > 9 ? m.toString() : '0' + m.toString()) + (d > 9 ? d.toString() : '0' + d.toString())
    },
    goReportList () {
      this.$store.dispatch('changeReportPath', 'reportList')
    },
    goReportTypein () {
      store.dispatch('changeTypeInType', 'add')
      this.$store.dispatch('changeReportPath', 'reportTypein')
    }
  }
}
</script>

<style scoped>
.base-info-wrap {
  padding: 0 24px;
  height: 100%;
  position: relative;
}
.start-typein-btn {
  position: absolute;  
  right: 40px;
  top: 35px;
  width: 80px;
  height: 30px;
  border-radius: 2px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  cursor: pointer;
}
.start-typein-btn:hover {
  background: linear-gradient(45deg, #1DE9B6 0%, #03BFEE 50%);
}
.content {
  padding-top: 50px;
}
.content h2 {
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  margin-top: 57px;
  margin-bottom: 43px;
}
.row {
  margin-bottom: 24px;
  line-height: 30px;
  text-align: center;
  font-size: 0;
  white-space: nowrap;
}
.row > * {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
}
.label {
  width: 60px;
  text-align: right;
  white-space: nowrap;
  margin-right: 16px;
}
.second-label {
  margin-left: 120px;
}
.member-input {
  width: 168px;
  height: 30px;
}
.add-member-btn {
  width: 100px;
  border: 1px solid #D9D9D9;
  margin-left: 12px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  border-radius: 2px;
}
.add-member-btn:hover {
  border-color: #03BFEE;
  color: #03BFEE;
}
.add-member-btn i {
  display: inline-block;
  font-size: 12px;
  margin-right: 8px;
}
.full-input {
  width: 284px;
  height: 30px;
}

/*
.bottom-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.08);
  width: 100%;
  height: 78px;
  background-color: #fff;
}
.bottom-wrap .start-typein-btn {
  float: right;
  width: 80px;
  height: 30px;
  border-radius: 2px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  margin-top: 24px;
  margin-right: 38px;
  cursor: pointer;
}
*/
</style>
