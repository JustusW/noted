import Vue from 'vue'
import VueRouter from 'vue-router'
import resize from 'vue-resize-directive'
import Vuetify from 'vuetify'
import {TiptapVuetifyPlugin} from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'

import VueSimpleContextMenu from 'vue-simple-context-menu'

import App from './App.vue'
import router from './routes'
import Vue2TouchEvents from 'vue2-touch-events'

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

Vue.component('vue-simple-context-menu', VueSimpleContextMenu)
Vue.debug = true
new Vue({
    render: h => h(App),
    vuetify,
    router: router.router,
    directives: {
        resize
    }
}).$mount('#app')

Vue.use(TiptapVuetifyPlugin, {
    vuetify,
})