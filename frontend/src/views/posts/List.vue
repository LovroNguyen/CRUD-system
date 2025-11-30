<script setup>
import { session } from '../../auth/session'
import { onMounted, ref, computed } from 'vue'
import { PostAPI } from '../../api/index'

const isAdmin = computed(() => session.isAdmin.value)

const items = ref([])
const loading = ref(false)
const error = ref('')

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Technology', 'Business', 'Lifestyle', 'Education', 'Other']

const getCategoryColor = (category) => {
  const colors = {
    'Technology': 'bg-blue-100 text-blue-800',
    'Business': 'bg-purple-100 text-purple-800',
    'Lifestyle': 'bg-orange-100 text-orange-800',
    'Education': 'bg-green-100 text-green-800',
    'Other': 'bg-pink-100 text-pink-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedCategory.value !== 'All') params.category = selectedCategory.value
    
    items.value = await PostAPI.list(params)
  } catch (e) {
    error.value = e?.response?.data?.error || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

const remove = async (id) => {
  if (!confirm('Delete this post?')) return
  try {
    await PostAPI.remove(id)
    items.value = items.value.filter(x => x._id !== id)
  } catch (e) {
    alert('Failed to delete post')
  }
}

const handleSearch = () => {
  load()
}

const handleCategoryChange = () => {
  load()
}

onMounted(load)
</script>

<template>
  <div class="animate-fadeIn">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Posts</h1>
      <RouterLink 
        v-if="isAdmin" 
        to="/posts/new"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        <span>Create Post</span>
      </RouterLink>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Search Posts</label>
          <input 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Search by title or content..." 
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
          <select 
            v-model="selectedCategory" 
            @change="handleCategoryChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Posts Table -->
    <div v-if="!loading" class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Content Preview
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="items.length" v-for="item in items" :key="item._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ item.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 inline-flex text-xs font-semibold rounded-full"
                  :class="getCategoryColor(item.category)"
                >
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-md truncate">
                  {{ item.content.substring(0, 80) }}...
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(item.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <RouterLink 
                  :to="`/posts/${item._id}`"
                  class="text-primary-600 hover:text-primary-900"
                >
                  View
                </RouterLink>
                
                <template v-if="isAdmin">
                  <RouterLink 
                    :to="`/posts/${item._id}/edit`"
                    class="text-green-600 hover:text-green-900"
                  >
                    Edit
                  </RouterLink>
                  <button 
                    @click="remove(item._id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </template>
              </td>
            </tr>

            <tr v-else>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <div class="text-6xl mb-4">📭</div>
                <p class="text-lg">No posts found.</p>
                <RouterLink 
                  v-if="isAdmin" 
                  to="/posts/new"
                  class="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Create your first post
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>