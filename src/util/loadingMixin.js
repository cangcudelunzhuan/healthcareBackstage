/**
 * Created by JianBo.Wang on 2018/11/14.
 */
const loadingMixin = {
  data: function () {
    return {
      // 加载提示状态
      loading: {
        active: false,
        text: ''
      }
    }
  },
  methods: {
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

export default loadingMixin
