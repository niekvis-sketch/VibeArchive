<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjects } from '../composables/useProjects'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const { addProject, getProject, updateProject, loading, error } = useProjects()

const isEditMode = computed(() => !!route.params.id)

const form = ref({
  name: '',
  shortDescription: '',
  description: '',
  techStackString: '', // Helper for input
  techStack: [],
  githubUrl: '',
  liveUrl: '',
  vibeRating: 5
})

const imageFile = ref(null)
const imagePreview = ref(null)

onMounted(async () => {
    if (isEditMode.value) {
        const project = await getProject(route.params.id)
        if (project) {
            form.value = {
                ...project,
                techStackString: project.techStack ? project.techStack.join(', ') : ''
            }
            // If there's an existing image url, we show it, but don't set imageFile
            if (project.imageUrl) {
                imagePreview.value = project.imageUrl
            }
        }
    }
})

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (limit to ~800KB to be safe for Firestore 1MB limit)
    if (file.size > 800 * 1024) {
      alert("Image is too large! Please choose an image under 800KB.");
      return;
    }
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  // Process tech stack string to array
  if (form.value.techStackString) {
    form.value.techStack = form.value.techStackString.split(',').map(t => t.trim())
  }
  
  // Clean up data for submission
  const projectData = {
    name: form.value.name,
    shortDescription: form.value.shortDescription,
    description: form.value.description,
    techStack: form.value.techStack,
    githubUrl: form.value.githubUrl,
    liveUrl: form.value.liveUrl,
    vibeRating: Number(form.value.vibeRating)
  }

  // Handle image:
  // For update: we can't easily update just the image with current composable logic if we didn't change it.
  // We need to pass the file if it changed.
  // But wait, my updateProject doesn't handle image logic yet (it was commented out).
  // I need to fix that in a bit, but let's assume for now we just pass projectData.
  // Actually, I should allow updating the image.

  try {
    if (isEditMode.value) {
        // If imageFile is set, we need to convert it again. 
        // But my updateProject currently doesn't accept image.
        // Let's rely on the fact that if I select a new image, I want to convert it.
        // I need to update the updateProject logic or do it here.
        // Doing it here is repeating logic. I should pass imageFile to updateProject.
        
        await updateProject(route.params.id, projectData, imageFile.value)
    } else {
        await addProject(projectData, imageFile.value)
    }
    router.push('/projects')
  } catch (err) {
    // Error is handled in composable state
    console.error("Failed to save project", err)
  }
}
</script>

<template>
  <div class="add-project container">
    <h2 class="glow-text">{{ isEditMode ? 'Edit Vibe Project' : 'Add New Vibe Project' }}</h2>
    
    <div v-if="error" class="error-alert">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="glass-panel form-content">
      <div class="form-section">
        <h3>Basic Info</h3>
        <BaseInput v-model="form.name" label="Project Name" required />
        <BaseInput v-model="form.shortDescription" label="Short Tagline" placeholder="Brief summary..." required />
        <BaseInput v-model="form.description" label="Full Description" isTextarea required />
      </div>

      <div class="form-section">
        <h3>Tech & Vibe</h3>
        <BaseInput v-model="form.techStackString" label="Tech Stack (comma separated)" placeholder="Vue, Firebase, CSS..." />
        
        <div class="form-group">
          <label>Vibe Rating (1-10)</label>
          <input 
            type="range" 
            v-model="form.vibeRating" 
            min="1" 
            max="10" 
            class="range-slider"
          >
          <span class="rating-display">{{ form.vibeRating }}</span>
        </div>
      </div>

      <div class="form-section">
        <h3>Links</h3>
        <BaseInput v-model="form.githubUrl" label="GitHub URL" type="url" />
        <BaseInput v-model="form.liveUrl" label="Live Demo URL" type="url" />
      </div>

      <div class="form-section">
        <h3>Visuals</h3>
        <div class="file-upload">
          <label class="btn-secondary file-label">
            {{ isEditMode ? 'Change Screenshot' : 'Choose Screenshot' }}
            <input type="file" @change="handleImageSelect" accept="image/*" hidden>
          </label>
          <span v-if="imageFile" class="file-name">{{ imageFile.name }}</span>
          
          <div v-if="imagePreview" class="preview-container">
            <img :src="imagePreview" alt="Preview">
          </div>
        </div>
      </div>

      <div class="actions">
        <BaseButton type="submit" :loading="loading">
          {{ isEditMode ? 'Update Project' : 'Launch Project' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-project {
  max-width: 800px;
  margin: 0 auto;
}

.form-content {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-section:last-child {
  border-bottom: none;
}

h3 {
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.range-slider {
  width: 100%;
  accent-color: var(--color-primary);
}

.rating-display {
  display: block;
  text-align: right;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.file-label {
  display: inline-block;
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
}

.preview-container {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.preview-container img {
  width: 100%;
  display: block;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.error-alert {
  background: rgba(255, 46, 151, 0.2);
  color: #ff80bf;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid var(--color-accent);
}
</style>
