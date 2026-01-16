<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useProjects } from '../composables/useProjects'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/ui/BaseButton.vue'
import ProjectComments from '../components/projects/ProjectComments.vue'

const route = useRoute()
const router = useRouter()
const { getProject, deleteProject, loading, error } = useProjects()
const { user } = useAuth()

const project = ref(null)

onMounted(async () => {
    project.value = await getProject(route.params.id)
})

const isOwner = computed(() => {
    return user.value && project.value && user.value.uid === project.value.userId
})

const imageUrl = computed(() => {
  return project.value?.imageUrl || '/PlaceholderFoto.svg'
})

const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this vibe?")) {
        await deleteProject(project.value.id)
        router.push('/projects')
    }
}

const scrollToComments = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="project-detail" v-if="project">
    <!-- Header Image -->
    <div class="hero-image glass-panel">
        <img :src="imageUrl" :alt="project.name">
        <div class="overlay">
            <h1 class="glow-text">{{ project.name }}</h1>
        </div>
    </div>

    <!-- Actions Bar -->
    <div class="actions-bar">
        <BaseButton variant="secondary" @click="router.push('/projects')">
            ← Back
        </BaseButton>
        <div class="right-actions">
            <BaseButton v-if="!isOwner" class="comment-btn" @click="scrollToComments">
                Leave a Comment
            </BaseButton>
            <template v-if="isOwner">
                <BaseButton @click="router.push(`/projects/${project.id}/edit`)">
                    Edit Project
                </BaseButton>
                <BaseButton variant="danger" @click="handleDelete">
                    Delete
                </BaseButton>
            </template>
        </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
        <div class="main-info glass-panel">
            <h2>About this Vibe</h2>
            <p class="description">{{ project.description }}</p>
            
            <div class="tech-stack">
                <h3>Tech Stack</h3>
                <div class="tags">
                    <span v-for="tag in project.techStack" :key="tag" class="tag">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </div>

        <div class="sidebar glass-panel">
            <div class="stat-row">
                <span class="label">Vibe Rating</span>
                <span class="value rating">{{ project.vibeRating }}/10</span>
            </div>
            <div class="stat-row">
                <span class="label">Created</span>
                <span class="value">{{ new Date(project.createdAt?.seconds * 1000).toLocaleDateString() }}</span>
            </div>
            
            <div class="links-group">
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="link-btn">
                    GitHub Repo
                </a>
                <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="link-btn">
                     Live Demo
                </a>
            </div>
        </div>
    </div>

    <!-- Comments Section -->
    <ProjectComments :projectId="project.id" :ownerId="project.userId" :projectName="project.name" />
  </div>
  
  <div v-else class="loading-state">
      <p v-if="loading">Loading project details...</p>
      <p v-if="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.project-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 0;
}

.hero-image {
  position: relative;
  height: 320px;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: var(--radius-xl);
  background: var(--bg-card);
  border: var(--border-card);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(13, 13, 13, 0.95));
  padding: 2.5rem;
}

.overlay h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin: 0;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.right-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.glass-panel {
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
}

.main-info h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.description {
  white-space: pre-wrap;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.tech-stack h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 107, 53, 0.1);
  color: var(--accent-orange);
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 107, 53, 0.15);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-row .label {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.stat-row .value {
  color: var(--text-primary);
  font-weight: 500;
}

.rating {
  color: var(--accent-orange) !important;
  font-weight: 700 !important;
  font-size: 1.125rem;
}

.links-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all var(--speed-fast);
}

.link-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-orange);
  color: var(--accent-orange);
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}
</style>
