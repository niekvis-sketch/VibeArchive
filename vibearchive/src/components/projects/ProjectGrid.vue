<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Loading projects...</p>
  </div>
  
  <div v-else-if="projects.length === 0" class="empty">
    <p>No projects found matching your criteria.</p>
  </div>
  
  <div v-else class="project-grid">
    <ProjectCard 
      v-for="project in projects" 
      :key="project.id" 
      :project="project" 
    />
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
}

@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.loading, .empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(224, 242, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 240, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
