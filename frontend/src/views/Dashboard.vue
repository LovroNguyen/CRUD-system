<script setup>
import { ref, onMounted, computed } from 'vue'
import { PostAPI, AuthorAPI } from '../api/index'
import { session } from '../auth/session'

const postStats = ref(null)
const authorStats = ref(null)
const loading = ref(true)
const error = ref('')

const isAdmin = computed(() => session.isAdmin.value)

const getCategoryColor = (category) => {
  const colors = {
    'Technology': 'bg-blue-500',
    'Business': 'bg-purple-500',
    'Lifestyle': 'bg-orange-500',
    'Education': 'bg-green-500',
    'Other': 'bg-pink-500'
  }
  return colors[category] || 'bg-gray-500'
}

const loadStats = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const [posts, authors] = await Promise.all([
      PostAPI.stats(),
      AuthorAPI.stats()
    ])
    
    postStats.value = posts
    authorStats.value = authors
  } catch (e) {
    error.value = 'Failed to load statistics'
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div class="animate-fadeIn">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Welcome back, {{ session.state.username }}!</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Dashboard Content -->
    <div v-if="!loading && !error" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-semibold uppercase">Total Posts</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ postStats?.totalPosts || 0 }}</p>
            </div>
            <div class="text-5xl">📝</div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-semibold uppercase">Total Authors</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ authorStats?.totalAuthors || 0 }}</p>
            </div>
            <div class="text-5xl">👥</div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-semibold uppercase">Your Role</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ session.state.role }}</p>
            </div>
            <div class="text-5xl">{{ isAdmin ? '👑' : '👤' }}</div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Posts by Category</h2>
        <div class="space-y-4">
          <div 
            v-for="cat in postStats?.categoryStats || []" 
            :key="cat._id"
            class="flex items-center gap-4"
          >
            <span class="w-32 text-sm font-semibold text-gray-700">{{ cat._id }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500"
                :class="getCategoryColor(cat._id)"
                :style="{ width: `${(cat.count / postStats.totalPosts) * 100}%` }"
              ></div>
            </div>
            <span class="w-12 text-right text-sm font-bold text-gray-900">{{ cat.count }}</span>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Posts -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
          <div class="space-y-3">
            <RouterLink
              v-for="post in postStats?.recentPosts || []" 
              :key="post._id"
              :to="`/posts/${post._id}`"
              class="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ post.title }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ post.category }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ new Date(post.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Recent Authors -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Authors</h2>
          <div class="space-y-3">
            <RouterLink
              v-for="author in authorStats?.recentAuthors || []" 
              :key="author._id"
              :to="`/authors/${author._id}`"
              class="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ author.name }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm text-gray-600">{{ author.email }}</span>
                    <span class="text-xs text-gray-500">
                      {{ new Date(author.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>