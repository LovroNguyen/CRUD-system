<script setup>
import { onMounted, reactive, ref } from 'vue'
import { AuthorAPI } from '../../api/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    mode: { type: String, required: true },
    id: { type: String, default: '' }
})

const form = reactive({ name: '', email: '' })
const loading = ref(false)
const error = ref('')

const load = async () => {
    if (props.mode === 'edit' && props.id) {
        try {
            const data = await AuthorAPI.get(props.id)
            form.name = data.name || ''
            form.email = data.email || ''
        } catch (e) {
            error.value = e?.response?.data?.error || 'Failed to load author'
        }
    }
}

const save = async () => {
    try {
        loading.value = true
        error.value = ''

        if (props.mode === 'create') {
            await AuthorAPI.create(form)
        } else {
            await AuthorAPI.update(props.id, form)
        }

        router.push('/authors')
    } catch (e) {
        error.value = e?.response?.data?.error || 'Failed to save author'
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
                {{ props.mode === 'create' ? 'Create Author' : 'Edit Author' }}
            </h1>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
            <form @submit.prevent="save" class="space-y-6">
                <!-- Name Field -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Name <span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="form.name" 
                        required 
                        placeholder="Enter author name" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <!-- Email Field -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="form.email" 
                        required 
                        type="email" 
                        placeholder="author@example.com" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <!-- Error Message -->
                <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {{ error }}
                </div>

                <!-- Buttons -->
                <div class="flex items-center gap-4 pt-4">
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                    >
                        {{ loading ? 'Saving...' : 'Save Author' }}
                    </button>
                    
                    <RouterLink 
                        to="/authors"
                        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                        Cancel
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>