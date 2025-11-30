<script setup>
import { onMounted, reactive, ref } from 'vue'
import { PostAPI } from '../../api/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    mode: { type: String, required: true },
    id: { type: String, default: '' }
})

const categories = ['Technology', 'Business', 'Lifestyle', 'Education', 'Other']
const form = reactive({ title: '', content: '', category: 'Other' })
const loading = ref(false)
const error = ref('')

const load = async () => {
    if (props.mode === 'edit' && props.id) {
        try {
            const data = await PostAPI.get(props.id)
            form.title = data.title || ''
            form.content = data.content || ''
            form.category = data.category || 'Other'
        } catch (e) {
            error.value = e?.response?.data?.error || 'Failed to load post'
        }
    }
}

const save = async () => {
    try {
        loading.value = true
        error.value = ''

        if (props.mode === 'create') {
            await PostAPI.create(form)
        } else {
            await PostAPI.update(props.id, form)
        }

        router.push('/posts')
    } catch (e) {
        error.value = e?.response?.data?.error || 'Failed to save post'
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <div class="animate-fadeIn max-w-3xl mx-auto">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
                {{ props.mode === 'create' ? 'Create Post' : 'Edit Post' }}
            </h1>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
            <form @submit.prevent="save" class="space-y-6">
                <!-- Title Field -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Title <span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="form.title" 
                        required 
                        placeholder="Enter post title" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>

                <!-- Category Field -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span class="text-red-500">*</span>
                    </label>
                    <select 
                        v-model="form.category" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                        <option v-for="cat in categories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                    <p class="mt-2 text-sm text-gray-500">Choose a category for your post</p>
                </div>

                <!-- Content Field -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Content <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                        v-model="form.content" 
                        required 
                        placeholder="Write your post content here..."
                        rows="8"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                    <p class="mt-2 text-sm text-gray-500">{{ form.content.length }} characters</p>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {{ error }}
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-4 pt-4">
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <span v-if="loading">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        <span>{{ loading ? 'Saving...' : 'Save Post' }}</span>
                    </button>
                    
                    <RouterLink 
                        to="/posts"
                        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                        Cancel
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>