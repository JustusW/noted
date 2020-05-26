import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import router from './routes'


Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.config.productionTip = false
let vuetify = new Vuetify({})

new Vue({
  render: h => h(App),
  vuetify,
  router: router.router,
}).$mount('#app')
