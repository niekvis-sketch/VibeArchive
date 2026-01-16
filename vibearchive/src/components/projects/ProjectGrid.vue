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
  <div v-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Loading projects...</p>
  </div>
  
  <div v-else-if="projects.length === 0" class="empty-state">
    <div class="empty-icon">📁</div>
    <h3>No projects found</h3>
    <p>Try adjusting your search or add a new project.</p>
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
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 640px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
}

.loading-state p,
.empty-state p {
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 107, 53, 0.2);
  border-radius: 50%;
  border-top-color: var(--accent-orange);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
