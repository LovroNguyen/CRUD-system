import { api } from "./http"

export const AuthorAPI = {
    list: () => api.get('/authors').then(r => r.data),
    get: (id) => api.get(`/authors/${id}`).then(r => r.data),
    create: (payload) => api.post('/authors', payload).then(r => r.data),
    update: (id, payload) => api.put(`/authors/${id}`, payload).then(r => r.data),
    remove: (id) => api.delete(`/authors/${id}`),
    stats: () => api.get('/authors/stats').then(r => r.data)
}