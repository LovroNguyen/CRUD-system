<script setup>
import { session } from '../../auth/session'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PostAPI } from '../../api/index'

const isAdmin = computed(() => session.isAdmin.value)

const route = useRoute()
const router = useRouter()
const item = ref(null)
const loading = ref(true)
const error = ref('')

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
    try {
        const id = route.params.id
        item.value = await PostAPI.get(id)
    } catch (e) {
        error.value = e.response?.data?.error || 'Failed to load post'
    } finally {
        loading.value = false
    }
}

const remove = async () => {
    if (!confirm('Delete this post?')) return
    try {
        await PostAPI.remove(item.value._id)
        router.push('/posts')
    } catch (e) {
        alert('Failed to delete post')
    }
}

onMounted(load)
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
        </div>

        <!-- Post Detail -->
        <div v-if="item" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary-600 to-secondary-500 px-8 py-6 text-white">
                <h1 class="text-3xl font-bold mb-3">{{ item.title }}</h1>
                <div class="flex items-center gap-4">
                    <span 
                        class="px-3 py-1 rounded-full text-sm font-semibold"
                        :class="getCategoryColor(item.category)"
                    >
                        {{ item.category }}
                    </span>
                    <span class="text-sm opacity-90">
                        📅 {{ new Date(item.createdAt).toLocaleDateString() }}
                    </span>
                </div>
            </div>

            <!-- Content -->
            <div class="px-8 py-6">
                <div class="prose max-w-none">
                    <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{{ item.content }}</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="px-8 py-6 bg-gray-50 border-t flex gap-4">
                <RouterLink 
                    to="/posts"
                    class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                    ← Back to Posts
                </RouterLink>
                
                <template v-if="isAdmin">
                    <RouterLink 
                        :to="`/posts/${item._id}/edit`"
                        class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        ✏️ Edit
                    </RouterLink>
                    
                    <button 
                        @click="remove"
                        class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        🗑️ Delete
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>