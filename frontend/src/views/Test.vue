<script setup>
import { ref } from 'vue'
import { AuthAPI, PostAPI, AuthorAPI } from '../api/index'

const testResults = ref([])
const loading = ref(false)

const addResult = (testName, success, data, error = null) => {
    testResults.value.unshift({
        id: Date.now(),
        testName,
        success,
        data,
        error,
        timestamp: new Date().toLocaleTimeString()
    })
}

const testGetMe = async () => {
    loading.value = true
    try {
        const data = await AuthAPI.me()
        addResult('GET /auth/me', true, data)
    } catch (e) {
        addResult('GET /auth/me', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testRefreshToken = async () => {
    loading.value = true
    try {
        await AuthAPI.refresh()
        addResult('POST /auth/refresh', true, { message: 'Token refreshed' })
    } catch (e) {
        addResult('POST /auth/refresh', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testGetPosts = async () => {
    loading.value = true
    try {
        const data = await PostAPI.list()
        addResult('GET /posts', true, { count: data.length, sample: data[0] })
    } catch (e) {
        addResult('GET /posts', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testGetPostStats = async () => {
    loading.value = true
    try {
        const data = await PostAPI.stats()
        addResult('GET /posts/stats', true, data)
    } catch (e) {
        addResult('GET /posts/stats', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testSearchPosts = async () => {
    loading.value = true
    try {
        const data = await PostAPI.list({ search: 'test' })
        addResult('GET /posts?search=test', true, { count: data.length })
    } catch (e) {
        addResult('GET /posts?search=test', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testFilterPosts = async () => {
    loading.value = true
    try {
        const data = await PostAPI.list({ category: 'Technology' })
        addResult('GET /posts?category=Technology', true, { count: data.length })
    } catch (e) {
        addResult('GET /posts?category=Technology', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testGetAuthors = async () => {
    loading.value = true
    try {
        const data = await AuthorAPI.list()
        addResult('GET /authors', true, { count: data.length, sample: data[0] })
    } catch (e) {
        addResult('GET /authors', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const testGetAuthorStats = async () => {
    loading.value = true
    try {
        const data = await AuthorAPI.stats()
        addResult('GET /authors/stats', true, data)
    } catch (e) {
        addResult('GET /authors/stats', false, null, e.response?.data?.error || e.message)
    } finally {
        loading.value = false
    }
}

const clearResults = () => {
    testResults.value = []
}

const runAllTests = async () => {
    clearResults()
    await testGetMe()
    await testGetPosts()
    await testGetPostStats()
    await testSearchPosts()
    await testFilterPosts()
    await testGetAuthors()
    await testGetAuthorStats()
}
</script>

<template>
    <div class="animate-fadeIn">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">API Testing Dashboard</h1>
        </div>

        <!-- Control Buttons -->
        <div class="flex gap-4 mb-8">
            <button 
                @click="runAllTests" 
                :disabled="loading"
                class="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
                <span>{{ loading ? 'Running Tests...' : 'Run All Tests' }}</span>
            </button>
            
            <button 
                @click="clearResults"
                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
                Clear Results
            </button>
        </div>

        <!-- Test Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Auth Tests -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">🔐 Authentication</h2>
                <div class="space-y-2">
                    <button 
                        @click="testGetMe" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        GET /auth/me
                    </button>
                    <button 
                        @click="testRefreshToken" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        POST /auth/refresh
                    </button>
                </div>
            </div>

            <!-- Post Tests -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">📝 Posts</h2>
                <div class="space-y-2">
                    <button 
                        @click="testGetPosts" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        GET /posts
                    </button>
                    <button 
                        @click="testGetPostStats" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        GET /posts/stats
                    </button>
                    <button 
                        @click="testSearchPosts" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Search Posts
                    </button>
                    <button 
                        @click="testFilterPosts" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Filter by Category
                    </button>
                </div>
            </div>

            <!-- Author Tests -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">👥 Authors</h2>
                <div class="space-y-2">
                    <button 
                        @click="testGetAuthors" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        GET /authors
                    </button>
                    <button 
                        @click="testGetAuthorStats" 
                        :disabled="loading"
                        class="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        GET /authors/stats
                    </button>
                </div>
            </div>
        </div>

        <!-- Test Results -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
                📊 Test Results ({{ testResults.length }})
            </h2>
            
            <div v-if="!testResults.length" class="text-center py-12">
                <div class="text-6xl mb-4">🧪</div>
                <p class="text-gray-500 text-lg">No tests run yet. Click a test button above to begin.</p>
            </div>

            <div v-else class="space-y-4">
                <div 
                    v-for="result in testResults" 
                    :key="result.id"
                    class="border-2 rounded-lg overflow-hidden"
                    :class="result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'"
                >
                    <div class="px-4 py-3 bg-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">{{ result.success ? '✅' : '❌' }}</span>
                            <span class="font-semibold text-gray-900">{{ result.testName }}</span>
                        </div>
                        <span class="text-sm text-gray-500">{{ result.timestamp }}</span>
                    </div>
                    
                    <div class="px-4 py-3">
                        <div v-if="result.success">
                            <p class="font-semibold text-green-800 mb-2">Response:</p>
                            <pre class="bg-white p-4 rounded-lg text-sm overflow-x-auto border border-green-200">{{ JSON.stringify(result.data, null, 2) }}</pre>
                        </div>
                        <div v-else>
                            <p class="font-semibold text-red-800 mb-2">Error:</p>
                            <p class="text-red-700 bg-white p-4 rounded-lg border border-red-200">{{ result.error }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>