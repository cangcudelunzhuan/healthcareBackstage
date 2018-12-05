<template>
  <div class="content-wrap">
    <div class="route-view-area">
      <p class="tip">暂无权限，请联系管理员</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.route-view-area {
  height: 100%;
  background: url(../../../static/images/noData.png) no-repeat center 30%;
  position: relative;
}
.route-view-area .tip {
  position: absolute;
  top: calc(30% + 180px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #515152;
}
</style>
