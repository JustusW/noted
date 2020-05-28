import Vue from 'vue'
import VueRouter from 'vue-router'
import resize from 'vue-resize-directive'
import VueDraggableResizable from 'vue-draggable-resizable'
import Vuetify from 'vuetify'
import {TiptapVuetifyPlugin} from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import App from './App.vue'
import router from './routes'

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.config.productionTip = false
let vuetify = new Vuetify({
    icons: {
        iconfont: 'md',
    },
})

Vue.component('vue-draggable-resizable', VueDraggableResizable)

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