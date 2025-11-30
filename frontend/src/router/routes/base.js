import Home from '../../views/Home.vue'
import NotFound from '../../views/NotFound.vue'
import Dashboard from '../../views/Dashboard.vue'
import Test from '../../views/Test.vue'

export default [
    { path: '/', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/test', component: Test },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]