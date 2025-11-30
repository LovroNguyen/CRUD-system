import { reactive, computed } from 'vue'
import { AuthAPI } from '../api/index.js'

const state = reactive({
    token: localStorage.getItem('token') || '',
    username: '',
    role: ''
})

export const session = {
    state,
    isAuthed: computed(() => !!state.token),
    isAdmin: computed(() => state.role === 'admin'),
    async restore() {
        if (!state.token) return
        try {
            const me = await AuthAPI.me()
            state.username = me.username
            state.role = me.role
        } catch {
            this.clear()
        }
    },
    setToken(token) {
        state.token = token || ''
        if (token) localStorage.setItem('token', token)
        else localStorage.removeItem('token')
    },
    clear() {
        state.token = ''; state.username = ''; state.role = ''
        localStorage.removeItem('token')
    }
}