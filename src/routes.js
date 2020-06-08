import VueRouter from 'vue-router'
import Home from './views/home.vue'
import Notes from './views/notes.vue'

const routes = [
    {path: '/', component: Home, name: 'Home'},
    {path: '/notes/:id?/:zoom?', component: Notes, name: 'Notes', link: '/notes'},
    {path: '/help/:id?/:zoom?', component: Notes, name: 'Help', link: '/help'},
]

export default {
    router: new VueRouter({routes}),
    routes: routes
}