import { api } from "./http"

export const PostAPI = {
    list: (params) => api.get('/posts', { params }).then(r => r.data),
    get: (id) => api.get(`/posts/${id}`).then(r => r.data),
    create: (payload) => api.post('/posts', payload).then(r => r.data),
    update: (id, payload) => api.put(`/posts/${id}`, payload).then(r => r.data),
    remove: (id) => api.delete(`/posts/${id}`),
    stats: () => api.get('/posts/stats').then(r => r.data) 
}