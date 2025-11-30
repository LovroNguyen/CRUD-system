<script setup>
import { onMounted, ref } from 'vue'
import { AuthorAPI } from '../../api/index'

const items = ref([])
const loading = ref(false)
const error = ref('')

const load = async () => {
    loading.value = true
    error.value = ''
    try {
        items.value = await AuthorAPI.list()
    } catch (e) {
        error.value = e?.response?.data?.error || 'Failed to load authors'
    } finally {
        loading.value = false
    }
}

const remove = async (id) => {
    if (!confirm('Delete this author?')) return
    try {
        await AuthorAPI.remove(id)
        items.value = items.value.filter(x => x._id !== id)
    } catch (e) {
        alert('Failed to delete author')
    }
}

onMounted(load)
</script>

<template>
    <div class="animate-fadeIn">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Authors</h1>
            <RouterLink 
                to="/authors/new"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
                <span>Create Author</span>
            </RouterLink>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
        </div>

        <!-- Authors Table -->
        <div v-if="!loading" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email
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
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span class="text-primary-700 font-bold">{{ item.name.charAt(0).toUpperCase() }}</span>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-semibold text-gray-900">{{ item.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-600">{{ item.email }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ new Date(item.createdAt).toLocaleDateString() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                <RouterLink 
                                    :to="`/authors/${item._id}`"
                                    class="text-primary-600 hover:text-primary-900"
                                >
                                    View
                                </RouterLink>
                                <RouterLink 
                                    :to="`/authors/${item._id}/edit`"
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
                            </td>
                        </tr>

                        <tr v-else>
                            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                <div class="text-6xl mb-4">👥</div>
                                <p class="text-lg">No authors found.</p>
                                <RouterLink 
                                    to="/authors/new"
                                    class="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                                >
                                    Create your first author
                                </RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>