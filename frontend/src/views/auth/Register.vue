<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthAPI } from '../../api/index'

const username = ref('')
const password = ref('')
const role = ref('user')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
    error.value = ''
    try {
        loading.value = true
        await AuthAPI.register({
            username: username.value,
            password: password.value,
            role: role.value
        })
        router.push('/login')
    } catch (e) {
        error.value = e.response?.data?.error || 'Registration failed'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="animate-fadeIn min-h-[70vh] flex items-center justify-center">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
                </div>

                <form @submit.prevent="register" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input 
                            v-model="username" 
                            required 
                            placeholder="Choose a username" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            v-model="password" 
                            type="password" 
                            required 
                            placeholder="Create a strong password" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Role
                        </label>
                        <select 
                            v-model="role"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            <option value="user">👤 User</option>
                            <option value="admin">👑 Admin</option>
                        </select>
                        <p class="mt-2 text-sm text-gray-500">
                            Admin can create, edit, and delete posts
                        </p>
                    </div>

                    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {{ error }}
                    </div>

                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <span v-if="loading">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-gray-600">
                        Already have an account? 
                        <RouterLink to="/login" class="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign in
                        </RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>