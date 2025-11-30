<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthorAPI } from '../../api/index'

const route = useRoute()
const router = useRouter()
const item = ref(null)
const loading = ref(true)
const error = ref('')

const load = async () => {
    try {
        const id = route.params.id
        item.value = await AuthorAPI.get(id)
    } catch (e) {
        error.value = e.response?.data?.error || 'Failed to load author'
    } finally {
        loading.value = false
    }
}

const remove = async () => {
    if (!confirm('Delete this author?')) return
    try {
        await AuthorAPI.remove(item.value._id)
        router.push('/authors')
    } catch (e) {
        alert('Failed to delete author')
    }
}

onMounted(load)
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
        </div>

        <!-- Author Detail -->
        <div v-if="item" class="bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-center gap-6 mb-6">
                <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-3xl text-primary-700 font-bold">
                        {{ item.name.charAt(0).toUpperCase() }}
                    </span>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">{{ item.name }}</h1>
                    <p class="text-gray-600">{{ item.email }}</p>
                </div>
            </div>

            <div class="border-t pt-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-500">Created</p>
                        <p class="text-lg font-semibold">
                            {{ new Date(item.createdAt).toLocaleDateString() }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Updated</p>
                        <p class="text-lg font-semibold">
                            {{ new Date(item.updatedAt).toLocaleDateString() }}
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <RouterLink 
                        to="/authors"
                        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                        ← Back to List
                    </RouterLink>
                    
                    <RouterLink 
                        :to="`/authors/${item._id}/edit`"
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
                </div>
            </div>
        </div>
    </div>
</template>