<template>
  <div class="login"
    v-loading="loading.active"
    :element-loading-text="loading.text">
  </div>
</template>

<script>
  import * as tool from './util/tool'
  import authApi from './fetch/authApi'
//  import {setToken} from '../../fetch/api'

  export default {
    name: 'login',
    data () {
      return {
        // 加载提示状态
        loading: {
          active: true,
          text: '正在获取用户信息...'
        }
      }
    },
    created () {
      this.login()
    },
    methods: {
      login () {
        authApi.getLoginInfo()
          .then(res => {
            if (res.code === 'user-not-login') {
              tool.toast({
                type: 'error',
                title: '登录失败'
              })
              let hrefOrign = res.data
              let hrefPart1 = hrefOrign.split('&redirectUrl=')[0]
              let hrefRedirect = hrefPart1 + '&redirectUrl=' + window.location.href
              window.location.href = hrefRedirect
            } else {
              sessionStorage.setItem('userCode', res.data.domainAccountList[0].domainAccount.toLowerCase())
              sessionStorage.setItem('userName', res.data.nickName)
              sessionStorage.setItem('userImageUrl', res.data.job)
              sessionStorage.setItem('userEmpNo', res.data.empNo)
              let tenantComs = {
                tenantComs: res.data.tenantComs
              }
              sessionStorage.setItem('tenantComs', JSON.stringify(tenantComs))
              this.$router.push({ path: '/Tabs' })

              // 前端埋点,用户画像
              let info = {
                'name': res.data.nickName,
                'username': res.data.nameDisplay,
                'email': res.data.email,
                'organization': res.data.tenantOrgs[0].orgName,
                'phone': res.data.phone,
                'picture': res.data.job,
                'gender': res.data.gender,
                'custom': {
                  '工号': '#' + res.data.empNo,
                  '职位': res.data.position,
                  'userId': res.data.userId
                }
              }
              localStorage.setItem('mdxxcc', JSON.stringify(info))
              tool.countlyUserDetail(info)
              tool.countlyLogin()
              // 部门前端埋点
              let inf = {
                userId: res.data.empNo,
                serviceId: 1003,
                menuName: '用户登入'
              }
              tool.accessLog(inf)
            }
          })
          .catch(() => {
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  height: 100%;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
}
.ico {
  position: absolute;
  background-repeat: no-repeat;
  background-size: contain;
}
.logo {
  top: 50%;
  left: 50%;
  margin-top: -210px;
  margin-left: -94px;
  width: 188px;
  height: 23px;
}
.copyright {
  position: absolute;
  bottom: 30px;
  width: 100%;
  font-size: 12px;
  color: #fff;
  text-align: center;
}
.loginform {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -162px;
  margin-left: -172px;
}
</style>
