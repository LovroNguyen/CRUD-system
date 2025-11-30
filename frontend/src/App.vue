<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthAPI } from './api/auth'
import { session } from './auth/session'

const router = useRouter()
const isAuthed = computed(() => session.isAuthed.value)
const isAdmin = computed(() => session.isAdmin.value)
const username = computed(() => session.state.username)

const logout = async () => {
  await AuthAPI.logout()
  session.clear()
  router.push('/login')
}

onMounted(session.restore)

const refreshToken = async () => {
  try {
    const data = await AuthAPI.refresh()
    session.setToken(data.token)
  } catch {
    session.clear()
    router.push('/login')
  }
}

setInterval(refreshToken, 10 * 60 * 1000)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left Navigation -->
          <div class="flex items-center space-x-4 ">
              <RouterLink 
                to="/" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Home
              </RouterLink>
              
            <div v-if="isAuthed" class="hidden md:flex space-x-4">
              <RouterLink 
                to="/dashboard" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Dashboard
              </RouterLink>
              
              <RouterLink 
                to="/posts" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Posts
              </RouterLink>
              
              <RouterLink 
                to="/authors" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Authors
              </RouterLink>
              
              <RouterLink 
                to="/test" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Test
              </RouterLink>
            </div>
          </div>

          <!-- Right Navigation -->
          <div class="flex items-center space-x-4">
            <template v-if="isAuthed">
              <div class="flex items-center space-x-3">
                <span 
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="isAdmin 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                    : 'bg-blue-100 text-blue-800'"
                >
                  {{ isAdmin ? '👑' : '👤' }} {{ username }}
                </span>
                
                <button 
                  @click="logout"
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </template>

            <template v-else>
              <RouterLink 
                to="/login" 
                class="px-4 py-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Login
              </RouterLink>
              
              <RouterLink 
                to="/register" 
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium"
              >
                Register
              </RouterLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p class="text-sm">
          &copy; 2025 COMP1842 Web Programming 2
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.router-link-active {
  @apply text-primary-600 bg-primary-50;
}
</style>