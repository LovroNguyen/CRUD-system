import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    withCredentials: true // Send refresh cookie automatically.
})

api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})