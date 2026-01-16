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

const { 
  searchQuery, 
  selectedTechStack,
  minVibeRating,
  availableTechStacks,
  toggleTechStack,
  isTechSelected,
  clearFilters,
  hasActiveFilters,
  filteredProjects 
} = useSearch(projects)
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

    <!-- Filters Section -->
    <div class="filters-section">
      <!-- Vibe Rating Slider -->
      <div class="filter-group vibe-filter">
        <label class="filter-label">
          <span class="filter-icon">★</span>
          Min Vibe Rating: <strong>{{ minVibeRating }}</strong>
        </label>
        <div class="slider-wrapper">
          <input 
            type="range" 
            v-model="minVibeRating" 
            min="1" 
            max="10" 
            class="vibe-slider"
          />
          <div class="slider-marks">
            <span v-for="n in 10" :key="n" :class="{ active: n <= minVibeRating }">{{ n }}</span>
          </div>
        </div>
      </div>

      <!-- Tech Stack Filter -->
      <div class="filter-group tech-filter" v-if="availableTechStacks.length > 0">
        <label class="filter-label">
          <span class="filter-icon">🛠️</span>
          Tech Stack
        </label>
        <div class="tech-chips">
          <button 
            v-for="tech in availableTechStacks" 
            :key="tech"
            @click="toggleTechStack(tech)"
            :class="['tech-chip', { selected: isTechSelected(tech) }]"
          >
            {{ tech }}
          </button>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <button 
        v-if="hasActiveFilters" 
        @click="clearFilters" 
        class="clear-filters-btn"
      >
        <span>✕</span> Clear Filters
      </button>
    </div>

    <!-- Results Count -->
    <div class="results-info" v-if="hasActiveFilters">
      <span>{{ filteredProjects.length }} project{{ filteredProjects.length !== 1 ? 's' : '' }} found</span>
    </div>

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
  margin-bottom: 2rem;
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

/* Filters Section */
.filters-section {
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.filter-label strong {
  color: var(--accent-orange);
  font-size: 1.1em;
}

.filter-icon {
  font-size: 1rem;
}

/* Vibe Slider */
.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vibe-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.vibe-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--accent-orange);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px var(--accent-orange-glow);
  transition: transform var(--speed-fast), box-shadow var(--speed-fast);
}

.vibe-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px var(--accent-orange-glow);
}

.vibe-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent-orange);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px var(--accent-orange-glow);
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.slider-marks span {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: color var(--speed-fast);
}

.slider-marks span.active {
  color: var(--accent-orange);
  font-weight: 600;
}

/* Tech Stack Chips */
.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-chip {
  padding: 0.4rem 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--speed-fast);
}

.tech-chip:hover {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.3);
  color: var(--text-primary);
}

.tech-chip.selected {
  background: var(--accent-orange);
  border-color: var(--accent-orange);
  color: white;
  font-weight: 500;
}

.tech-chip.selected:hover {
  background: var(--accent-orange-light);
}

/* Clear Filters Button */
.clear-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-full);
  color: #ef4444;
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--speed-fast);
  align-self: flex-start;
}

.clear-filters-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Results Info */
.results-info {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 53, 0.1);
  border-radius: var(--radius-md);
  display: inline-block;
}

.results-info span {
  font-size: 0.875rem;
  color: var(--accent-orange);
  font-weight: 500;
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

  .filters-section {
    padding: 1rem;
  }

  .tech-chips {
    gap: 0.4rem;
  }

  .tech-chip {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }
}
</style>
