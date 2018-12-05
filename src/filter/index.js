import Vue from 'vue'
Vue.filter('daterange', require('./daterange').default)
Vue.filter('formatNum', require('./formatNum').default)
Vue.filter('referenceValueFormat', require('./referenceValueFormat').default)
Vue.filter('sortNum', require('./sortNum').default)
