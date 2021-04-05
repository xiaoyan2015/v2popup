import Vue from 'vue'
import App from './App.vue'

// 引入弹窗Popup
import Popup from './components/popup'
Vue.use(Popup)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
