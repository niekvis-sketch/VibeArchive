<script setup>
import { onMounted, ref } from 'vue'
import { useProjects } from '../composables/useProjects'
import ProjectGrid from '../components/projects/ProjectGrid.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { useSearch } from '../composables/useSearch'

const { getProjects, loading, error } = useProjects()
const projects = ref([])

onMounted(async () => {
  projects.value = await getProjects()
})

const { searchQuery, filteredProjects } = useSearch(projects)
</script>

<template>
  <div class="projects-view">
    <header class="view-header">
      <div class="header-content">
        <p class="section-label">Recent Work</p>
        <h2>All Projects</h2>
      </div>
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text"
            placeholder="Search projects..." 
            class="search-input"
          />
        </div>
      </div>
    </header>

    <div v-if="error" class="error-msg">
      <span class="error-icon">⚠️</span>
      Error loading projects: {{ error }}
    </div>

    <ProjectGrid :projects="filteredProjects" :loading="loading" />
  </div>
</template>

<style scoped>
.projects-view {
  width: 100%;
  padding-top: 1rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-content h2 {
  margin: 0;
  font-size: 2rem;
}

.search-container {
  width: 100%;
  max-width: 320px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 0.875rem;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--speed-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px var(--accent-orange-glow);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--accent-danger);
  background: rgba(239, 68, 68, 0.1);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@media (max-width: 640px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    max-width: 100%;
  }
}
</style>
