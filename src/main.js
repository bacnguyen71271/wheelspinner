import Vue from 'vue'
import { ToastPlugin, ModalPlugin, BootstrapVue } from 'bootstrap-vue'
import App from './App.vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import router from './router'

Vue.use(ToastPlugin)
Vue.use(BootstrapVue)
Vue.use(ModalPlugin)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')