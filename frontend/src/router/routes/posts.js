import List from '../../views/posts/List.vue'
import Form from '../../views/posts/Form.vue'
import Detail from '../../views/posts/Detail.vue'

export default [
    { path: '/posts', component: List },
    { path: '/posts/:id', component: Detail },
    { path: '/posts/new', component: Form, props: { mode: 'create' } },
    {
        path: '/posts/:id/edit', component: Form,
        props: route => ({ mode: 'edit', id: route.params.id })
    }
]