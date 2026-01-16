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
  <article class="project-card">
    <div class="card-image">
      <img :src="imageUrl" :alt="project.name" loading="lazy">
      <div class="image-overlay">
        <RouterLink :to="{ name: 'project-detail', params: { id: project.id }}" class="view-btn">
          View
        </RouterLink>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3>{{ project.name }}</h3>
        <div class="rating" v-if="project.vibeRating">
          <span class="star">★</span> {{ project.vibeRating }}
        </div>
      </div>
      
      <p class="description">{{ project.shortDescription || project.description }}</p>
      
      <div class="tags" v-if="project.techStack?.length">
        <span 
          v-for="tech in project.techStack.slice(0, 4)" 
          :key="tech"
          class="tag"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="card-actions">
        <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener" class="action-link">
          <span>GitHub</span>
          <span class="arrow">↗</span>
        </a>
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener" class="action-link accent">
          <span>Live Demo</span>
          <span class="arrow">↗</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--speed-normal) var(--ease-smooth);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 107, 53, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: var(--bg-elevated);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--speed-slow) var(--ease-smooth);
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 13, 13, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--speed-normal);
}

.project-card:hover .image-overlay {
  opacity: 1;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background: var(--accent-orange);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: var(--radius-full);
  transition: all var(--speed-fast);
}

.view-btn:hover {
  background: var(--accent-orange-light);
  transform: scale(1.05);
  color: white;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.star {
  color: var(--accent-orange);
}

.description {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: rgba(255, 107, 53, 0.1);
  color: var(--accent-orange);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 107, 53, 0.15);
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--speed-fast);
}

.action-link:hover {
  color: var(--text-primary);
}

.action-link.accent {
  color: var(--accent-orange);
}

.action-link.accent:hover {
  color: var(--accent-orange-light);
}

.action-link .arrow {
  font-size: 0.75rem;
  transition: transform var(--speed-fast);
}

.action-link:hover .arrow {
  transform: translate(2px, -2px);
}
</style>
