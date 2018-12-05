<template>
  <div class="login-form">
    <div class="title">用户登录</div>
    <el-form ref="form" :rules="formRules" :model="form"
       v-loading="loading.active"
       :element-loading-text="loading.text">
      <el-form-item prop="username">
        <el-input v-model="form.username" auto-complete="off" icon="minus" placeholder="用户" class="form-item username" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" auto-complete="off" icon="minus" placeholder="密码" class="form-item password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as tool from '../../util/tool'
  import authApi from '../../fetch/authApi'
  import {setToken} from '../../fetch/api'

  export default {
    name: 'login-form',
    data () {
      return {
        // 加载提示状态
        loading: {
          active: false,
          text: ''
        },
        form: {
          username: '',
          password: ''
        },
        formRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.showLoading('正在登录中...')
            authApi.Login(this.form.username, this.form.password)
              .then(res => {
                this.hideLoading()
                setToken(res.token)
                tool.toast({
                  type: 'success',
                  title: '登录成功'
                })
                // sessionStorage.setItem('userName', this.form.username)
                sessionStorage.setItem('userName', res.name)
                this.$router.push({ path: '/Tabs' })
              })
              .catch(() => {
                this.hideLoading()
              })
          }
        })
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
.login-form {
  width: 344px;
  height: 269px;
  box-sizing: border-box;
  background: #ECEFF4;
  padding: 20px 25px 40px;
}
.title {
  font-size: 18px;
  height: 36px;
  padding-left: 5px;
  border-bottom: 2px solid #8B919A;
  margin-bottom: 20px;
  vertical-align: top;
}
.el-button {
  width: 100%;
}
</style>
