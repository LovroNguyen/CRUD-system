import List from '../../views/authors/List.vue'
import Form from '../../views/authors/Form.vue'
import Detail from '../../views/authors/Detail.vue'

export default [
    { path: '/authors', component: List },
    { path: '/authors/:id', component: Detail },
    { path: '/authors/new', component: Form, props: { mode: 'create' } },
    {
        path: '/authors/:id/edit', component: Form,
        props: route => ({ mode: 'edit', id: route.params.id })
    }
]