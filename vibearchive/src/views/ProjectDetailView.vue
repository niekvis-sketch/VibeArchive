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
    <ProjectComments :projectId="project.id" :ownerId="project.userId" />
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
}

.hero-image {
    position: relative;
    height: 300px;
    overflow: hidden;
    margin-bottom: 2rem;
    border-radius: 12px;
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
    background: linear-gradient(transparent, rgba(10, 14, 39, 0.9));
    padding: 2rem;
}

.actions-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.right-actions {
    display: flex;
    gap: 1rem;
}

.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.glass-panel {
    padding: 2rem;
}

.description {
    white-space: pre-wrap;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.8;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.tag {
    background: rgba(0, 240, 255, 0.1);
    color: var(--color-primary);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(0, 240, 255, 0.3);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
}

.rating {
    color: var(--color-accent);
    font-weight: bold;
    font-size: 1.2rem;
}

.links-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.link-btn {
    display: block;
    text-align: center;
    padding: 0.8rem;
    border: 1px solid var(--color-text);
    color: var(--color-text);
    border-radius: 4px;
    font-weight: 500;
}

.link-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}
</style>
