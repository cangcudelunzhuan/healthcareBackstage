<template>
<div class="base-info-wrap" v-loading.lock="isLoading" element-loading-text="保存中...">
  <div class="bread-wrap">
    <span class="bread bread-blue" @click="goReportList">促进方案管理</span>
    <span class="bread-separator"><i class="el-icon-arrow-right"></i></span>
    <span class="bread bread-grey">新建促进方案</span>
  </div>
  <div class="start-typein-btn greenBack" @click="save">开始录入</div>
  <div class="content">
    <h2>基础信息录入</h2>
    <div class="form-area">
      <div class="row">
        <span class="label">体检报告</span>
        <el-input class="member-input" placeholder="请输入" disabled v-model="filterCode"></el-input>
        <span class="add-member-btn" @click.stop="openSelect"><i class="iconfont icon-tianjiaIcon"></i>关联报告</span>
        <span class="label second-label">会员姓名</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="memberName"></el-input>
      </div>
      <div class="row">
        <span class="label">会员工号</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="memberNo"></el-input>
        <span class="label second-label">会员岗级</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="grade"></el-input>
      </div>
      <div class="row">
        <span class="label">会员性别</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="genderLabel" clearable></el-input>
        <span class="label second-label">检查机构</span>
        <el-select class="full-input" v-model="hospitalCode" disabled placeholder="请选择体检机构">
          <el-option v-for="item in hospitalOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <div class="row">
        <span class="label">体检年龄</span>
        <el-input class="full-input" placeholder="请输入" disabled v-model="age" clearable></el-input>
        <span class="label second-label">检查时间</span>
        <el-input class="full-input" placeholder="选择体检时间" disabled v-model="datePicker" clearable><i slot="suffix" class="el-icon-date">&nbsp;&nbsp;</i></el-input>
      </div>
    </div>
  </div>
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
import promoteManageApi from '@/fetch/report/promoteManageLXL'
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
      filterCode: '',
      memberName: '',
      memberNo: '',
      gender: '',
      grade: '',
      age: '',
      hospitalCode: '',
      hospitalOptions: null,
      reportType: '1',
      dateT: null,
      datePicker: null,
      id: ''
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
    openSelect () {
      this.memberSelectShow = true
    },
    closeSelect () {
      this.memberSelectShow = false
    },
    init () {
      reportManageApi.getHospitalList()
        .then(res => {
          this.hospitalOptions = res.data
        })
        .catch(() => {})
    },
    memberSelectFn (memberInfo) {
      this.filterCode = memberInfo.hospitalId + '-' + memberInfo.empNo + '-' + memberInfo.checkupTime
      this.memberName = memberInfo.empName
      this.memberNo = memberInfo.empNo
      this.gender = memberInfo.staffSex
      this.grade = memberInfo.grade
      this.age = memberInfo.staffAge
      this.dateT = memberInfo.checkupTime
      this.datePicker = memberInfo.checkupTime.slice(0, 4) + '年' + memberInfo.checkupTime.slice(4, 6) + '月' + memberInfo.checkupTime.slice(6, 8) + '日'
      this.hospitalCode = memberInfo.hospitalId
      this.id = memberInfo.id
    },
    async save () {
      if (this.memberName === '' || this.memberNo === '' || this.gender === '') {
        toast({type: 'warning', title: '请添加报告'})
        return
      }
      await this.$store.dispatch('checkSure', {title: '开始录入报告吗?', msg: '确认后基础信息不可更改，请问要开始录入报告吗？'})
      let info = {
        id: this.id,
        empName: this.memberName,
        empNo: this.memberNo,
        staffSex: this.gender,
        grade: this.grade,
        staffAge: this.age,
        hospitalId: this.hospitalCode,
        hospitalName: this.hospitalName,
        reportType: this.reportType,
        checkupTime: this.dateT,
        flag: 0,
        positiveNum: 0
      }
      this.isLoading = true
      promoteManageApi.addBaseInfo(info)
        .then((res) => {
          res.data = Object.assign({}, res.data, {hospitalName: this.hospitalName})
          store.dispatch('changePromoteBaseInfo', res.data)
          this.isLoading = false
          this.goReportTypein()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    goReportList () {
      this.$store.dispatch('changePromotePath', 'reportList')
    },
    goReportTypein () {
      store.dispatch('changePromoteType', 'add')
      this.$store.dispatch('changePromotePath', 'reportTypein')
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
</style>
