<template>
  <div class="password-dialog"
     v-loading="loading.active"
     :element-loading-text="loading.text">

    <el-form ref="form" :rules="formRules" :model="form" label-width="100px" label-position="right">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="newRepeat">
        <el-input type="password" v-model="form.newRepeat" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button type="primary" @click="savePassword">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>

  </div>
</template>

<script>
  import * as tool from '../../util/tool'

  import userApi from '../../fetch/systemUserApi'
  import {clearToken} from '../../fetch/api'

  export default {
    name: 'userinfo',
    data () {
      return {
        // 加载提示状态
        loading: {
          active: false,
          text: ''
        },
        form: {
          oldPassword: '',
          newPassword: '',
          newRepeat: ''
        },
        formRules: {
          oldPassword: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          newRepeat: [
            {required: true, message: '请重复新密码', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 保存密码修改
      savePassword () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.oldPassword === this.form.newPassword) {
              tool.toast({
                type: 'error',
                title: '新密码不能与原密码相同'
              })
              return
            }
            if (this.form.newPassword !== this.form.newRepeat) {
              tool.toast({
                type: 'error',
                title: '新密码两次输入不一致'
              })
              return
            }
            this.showLoading('正在保存密码修改')
            userApi.ModifyPassword(this.form.oldPassword, this.form.newPassword, this.form.newRepeat)
              .then(res => {
                this.hideLoading()
                tool.toast({
                  type: 'success',
                  title: '密码修改成功，请重新登录'
                })
                clearToken()
                this.$router.push({ path: '/' })
              })
              .catch(() => {
                this.hideLoading()
              })
          }
        })
      },
      // 关闭对话框
      closeDialog () {
        this.$emit('close-dialog')
      },
      // 本页显示加载进度条
      showLoading: function (text) {
        this.loading = {
          active: true,
          text: text
        }
      },
      // 本页隐藏加载进度条
      hideLoading: function () {
        this.loading = {
          active: false,
          text: ''
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .dialog-footer {
    text-align: right;
  }
</style>
