import VueRouter from 'vue-router'
import Home from './components/home.vue'
import Notes from './components/notes.vue'

const routes = [
    {path: '/', component: Home, name: 'Home'},
    {path: '/notes/:id?/:zoom?', component: Notes, name: 'Notes', link: '/notes'},
]

export default {
    router: new VueRouter({routes}),
    routes: routes
}