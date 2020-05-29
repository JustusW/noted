import VueRouter from 'vue-router'
import Home from './components/home.vue'
import Notes from './components/notes.vue'

const routes = [
    {path: '/', component: Home, name: 'Home'},
    {path: '/notes/:id', component: Notes, name: 'Notes'},
]

export default {
    router: new VueRouter({routes}),
    routes: routes
}