import { createRouter, createWebHistory } from 'vue-router'

import authRoutes from './routes/auth'
import baseRoutes from './routes/base'
import postRoutes from './routes/posts'
import authorRoutes from './routes/authors'

const routes = [
    ...authRoutes,
    ...baseRoutes,
    ...postRoutes,
    ...authorRoutes,
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() { return { top: 0 }; }
})