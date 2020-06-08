import Vue from 'vue'
import VueRouter from 'vue-router'
import resize from 'vue-resize-directive'
import Vuetify from 'vuetify'
import Vue2TouchEvents from 'vue2-touch-events'
import CKEditor from '@ckeditor/ckeditor5-vue'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'


import App from './App.vue'
import router from './routes'


Vue.use(CKEditor)
Vue.use(Vuetify)
Vue.use(Vue2TouchEvents, {
    disableClick: true
})
Vue.use(VueRouter)
Vue.config.productionTip = false
let vuetify = new Vuetify({
    icons: {
        iconfont: 'md',
    },
})

new Vue({
    render: h => h(App),
    vuetify,
    router: router.router,
    directives: {
        resize
    }
}).$mount('#app')