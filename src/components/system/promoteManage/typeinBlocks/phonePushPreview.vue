<template>
<div class="phone-push-preview" @click="closePreview">
  <div class="phone-push-preview-inner" @click.stop="">
    <span class="preview-preview-btn" @click.stop="closePreview"></span>
    <div class="push-content-wrap">
      <h3>幸福千万家复查提醒</h3>
      <p class="front-word">{{frontWord}}</p>
      <p class="push-item" v-for="item,index in dataList">
        {{(index+1) + '、'}}{{item.reexaminationTime}}{{item.title}}；
      </p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PhonePushPreview',
  props: ['frontWord', 'dataList'],
  data () {
    return {
    }
  },
  methods: {
    closePreview () {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style scoped lang="scss">
.phone-push-preview {
  background-color: rgba(0,0,0,.4);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  z-index: 2;
  .phone-push-preview-inner {
    width: 301px;
    height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: transparent url(../../../../../static/images/phone-bg.png) no-repeat;
  }
}
.phone-push-preview-inner {
  .preview-preview-btn {
    position: absolute;
    right: -20px;
    top: -5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
    &:before, &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 4px;
      height: 1px;
      width: 16px;
      background-color: #515152;
    }
    &:before {
      transform: rotateZ(45deg);
    }
    &:after {
      transform: rotateZ(-45deg);
    }
  }
  .push-content-wrap {
    position: absolute;
    top: 86px;
    left: 31px;
    width: 240px;
    height: 475px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 16px 15px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.push-content-wrap {
  h3 {
    font-size: 14px;
    line-height: 25px;
    color: #000;
    margin-bottom: 16px;
  }
  .front-word {
    color: #000;
    font-size: 12px;
    line-height: 21px;
    margin-bottom: 16px;
  }
  .push-item {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 8px;
    color: #333;
  }
}
</style>
