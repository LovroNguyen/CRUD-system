<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthAPI } from '../../api/index'
import { session } from '../../auth/session'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
    try {
        loading.value = true
        error.value = ''
        
        const data = await AuthAPI.login({
            username: username.value,
            password: password.value
        })

        session.setToken(data.token)
        await session.restore()
        
        router.push('/dashboard')
    } catch (e) {
        error.value = e.response?.data?.error || 'Login failed'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <!-- Card -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <!-- Icon & Title -->
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                </div>

                <!-- Form -->
                <form @submit.prevent="login" class="space-y-5">
                    <!-- Username -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input 
                            v-model="username" 
                            required
                            placeholder="Enter your username"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            v-model="password" 
                            type="password" 
                            required
                            placeholder="Enter your password"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <span>❌</span>
                        <span>{{ error }}</span>
                    </div>

                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span v-if="loading" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Signing in...</span>
                        </span>
                        <span v-else>Sign In</span>
                    </button>
                </form>

                <!-- Register Link -->
                <div class="mt-6 text-center">
                    <p class="text-gray-600 text-sm">
                        No account? 
                        <RouterLink to="/register" class="text-primary-600 hover:text-primary-700 font-semibold">
                            Register
                        </RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>