import Vue from 'vue'
import App from './App.vue'
import CSelect from './plugin/c-select/src/main'
console.log(CSelect)

Vue.config.productionTip = false
Vue.use(CSelect)

new Vue({
  render: h => h(App),
}).$mount('#app')
