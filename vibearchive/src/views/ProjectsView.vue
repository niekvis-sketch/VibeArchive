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
      <h2 class="glow-text">All Projects</h2>
      <div class="search-container">
        <BaseInput 
          v-model="searchQuery" 
          placeholder="Search projects by name..." 
        />
      </div>
    </header>

    <div v-if="error" class="error-msg">
      Error loading projects: {{ error }}
    </div>

    <ProjectGrid :projects="filteredProjects" :loading="loading" />
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  width: 100%;
  max-width: 400px;
}

.error-msg {
  color: var(--color-accent);
  background: rgba(255, 46, 151, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  border: 1px solid var(--color-accent);
}
</style>
