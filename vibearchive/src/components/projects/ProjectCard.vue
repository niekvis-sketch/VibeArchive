<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// Check if image exists, otherwise use placeholder
const imageUrl = computed(() => {
  return props.project.imageUrl || '/PlaceholderFoto.svg'
})
</script>

<template>
  <div class="project-card glass-panel">
    <div class="card-image">
      <img :src="imageUrl" :alt="project.name" loading="lazy">
      <div class="overlay">
        <RouterLink :to="{ name: 'project-detail', params: { id: project.id }}" class="view-btn">
          View Details
        </RouterLink>
      </div>
    </div>
    
    <div class="card-content">
      <div class="header">
        <h3>{{ project.name }}</h3>
        <div class="rating" v-if="project.vibeRating">
          <span class="star">★</span> {{ project.vibeRating }}/10
        </div>
      </div>
      
      <p class="description">{{ project.shortDescription || project.description }}</p>
      
      <div class="tags">
        <span 
          v-for="tech in project.techStack" 
          :key="tech"
          class="badge"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="actions">
        <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener">GitHub</a>
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener">Live Demo</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  overflow: hidden;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 240, 255, 0.15);
  border-color: var(--color-primary);
}

.card-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 14, 39, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-speed);
}

.project-card:hover .overlay {
  opacity: 1;
}

.view-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  text-transform: uppercase;
  font-family: var(--font-heading);
  letter-spacing: 1px;
}

.view-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg);
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
}

.rating {
  font-family: var(--font-heading);
  color: var(--color-secondary);
  font-weight: 600;
}

.star {
  color: var(--color-accent);
}

.description {
  color: rgba(224, 242, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  background: rgba(0, 240, 255, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.actions a {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
