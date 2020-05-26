import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import {TiptapVuetifyPlugin} from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'
import router from './routes'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader


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
}).$mount('#app')

Vue.use(TiptapVuetifyPlugin, {
    vuetify,
})